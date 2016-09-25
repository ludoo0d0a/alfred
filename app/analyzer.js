'use strict'

//
// https://mediahome-ludoo0d0a.c9.io/books/analyze
//
var path = require('path'),
  fs = require('fs-extra'),
  glob = require('glob'),
  async= require('async'),
  path= require('path'),
  changeCase = require('change-case'),
  _ = require('lodash'),
  //guessit = require('./guessit'),
  guessit = require('./moviedb'),
  tvbanner = require('./tvbanner'),
  jsonfile = require('jsonfile');

var DB_PATH = path.join(__dirname, '/../data/db.json'); //db.json

function printout(res, err, files){
  if (err){
      res.send(err);
    }else{
      res.json(files);
    }
}

exports.execute = function(opts, req, res){
  var op = opts.op;
  console.log('Start execute op=', op);
  if (op === 'scan' || op ==='move'){
    this.analyze({op:op}, req, function(err, results){
      printout(res, err, results);
    });
  }else if (op === 'log'){
    this.load(req, res);
  }
};

exports.load = function(req, res){
  jsonfile.readFile(DB_PATH, function(err, obj) {
    if (err){
      res.send(err);
    }else{
      formatOutput(obj, function(err, files){
        res.json(files);
      });
    }
  });
};

exports.analyze = function(opts, req, callback){
    var mapsType= {
        'episode':'tvshow',
        'movie':'movie'
      }, 
      app = req.app, 
      dirTocleans=[], 
      settings = app.nconf.get('settings'),
      okMove = opts && opts.op==='move';

	console.log('Start analyze opts=', opts);

    function scan(next){
      var dir = settings.path.download;
      
      console.log('Start scan %s', okMove);
      
      glob('**/*.{mkv,avi,mp4,wmv}', {cwd:dir}, function (err, files) {
        var movies = files;
        if (err){
        	
          console.error('glob search failed', err);
          //No result / error
          movies = [];
        }else{
          if (settings.minsize>0){
            movies= _.filter(files, function(file) {
              var size = getFilesizeInBytes(dir+file);
              return (size>settings.minsize);
            });
          }
        }
        
        console.log('### Found %d movies', movies.length);
        
        next(null, movies);
      });
    }
  
    function detectFiles(files, next){
      console.log('Start detectfiles');
      async.map(files, guessit.guess, next);
    }
    
    //Remove [ source ] xxx.via
    function cleanoutputfile(name){
      return name.replace(/^\[[^\]]+\]/, '').trim();
    }
  
    function moveFiles(wfiles, next){
      console.log('Start movefiles okMove=',okMove);
      var type='', newdirs=[], moves = [];
      var dir = settings.path.download;
      
      _.each(wfiles, function(wfile){
        
        if ((type=mapsType[wfile.type])){
          var dirout = settings.path[type];
          
          if (wfile.series){
            dirout=path.join(dirout, changeCase.titleCase(wfile.series));
            fs.exists(dirout, function(exists){
              if (!exists){
                console.warn('Will create dir %s',dirout);
                newdirs.push(async.apply(fs.mkdirp, dirout));
              }
            });
          }
          
          var dest = path.join(dirout,cleanoutputfile(wfile.basename)),
          f = path.join(dir,wfile.filename);
          
          wfile.source = f;
          wfile.dest = dest;
          wfile.status='ready';

          //console.warn('Will move file %s to %s',f , dest);
          //moves.push(async.apply(fs.move, dir+wfile.filename, dest));
          moves.push(function(next){
              console.log('move (%s) %s ', okMove, dest);
              
              fs.exists(dest, function(err){
                if (err){
                  //TODO: if already exists err.code=='EEXIST'
                  console.error('Exists : Destination %s already exists or error', dest, err);
                  wfile.error = {code:err.code};
                }
                wfile.destexists = !err;
                wfile.status='exists';

                if (okMove){
                  console.log('file move %s to %s ', f, dest);
                  //overwrite?
                  //var overwrite = wfile.destexists;
                  fs.move(f, dest, {clobber: false}, function(err){
                    if (err){
                      //TODO: if already exists err.code=='EEXIST'
                      console.error('Move : %s to %s', f, dest, err);
                      wfile.error = {code:err.code};
                      wfile.status='exists';
                    }else{
                      console.log('file moved - %s ', dest);
                      wfile.status='moved';
                    }
                    
                    wfile.success =!err;
                    wfile.moved = wfile.success;
                    
                    next(null, wfile);
                  });
                }else{
                  //Simulate move to cache status (op=scan)
                  next(null, wfile);
                }

              });
            
          });
          
          var subdir = path.dirname(wfile.filename);
          if (okMove && subdir && subdir !=='.'){
            var p = path.dirname(f);
            console.warn('Will remove subdir %s',p);
            dirTocleans.push(async.apply(fs.remove, p));
          }
        }else{
          console.warn('Ignore file '+wfile.filename);
        }
      });
      
      async.series({
        _newdirs: function(next){
        	console.log('start newdirs');
        	next();
        },
        //Create dirs
        newdirs: async.apply(async.parallel, newdirs), 
        _moves: function(next){
        	console.log('start moves');
        	next();
        },
        //then move files
        moves: async.apply(async.parallel, moves),
        _cleans: function(next){
        	console.log('start cleans');
        	next();
        },
        //then clean dirs
        cleans: async.apply(async.parallel, dirTocleans)
      }, function(err, r){
        console.log('dir manip done, err=', err);
        //Return successed/moved files
        next(err, err?{}:r);
      });
    }
    
    function savelog(r, next){
      console.log('save log');
      r.date = new Date();
      
      if (!_.isEmpty(r.moves)){
        //No moved files
        //Save log
        jsonfile.writeFile(DB_PATH, r, function(err) {
          console.log(err);
          next(err, r);
        });
      }else{
        //No save, just forward
        next(null, r);
      }
    }
    
    async.waterfall([scan, detectFiles, moveFiles, savelog, formatOutput], callback);
};

function formatOutput(r, next){
  var files = r.moves;
  async.map(files, tvbanner.findBanner, next);
}

function getFilesizeInBytes(filename) {
  var stats = fs.statSync(filename);
  var fileSizeInBytes = stats.size;
  //Convert the file size to megabytes (optional)
  var fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
  return fileSizeInMegabytes;
}