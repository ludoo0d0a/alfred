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
  console.log();
  if (err){
    console.error('return error', err, files);
    res.send(err);
  }else{
    console.log('return JSON', files);
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
      
      console.log('[1/5] Start scan %s', okMove);
      
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
      console.log('[2/5] Start detectfiles');
      async.map(files, guessit.guess, next);
    }
    
    //Remove [ source ] xxx.via
    function cleanoutputfile(name){
      return name.replace(/^\[[^\]]+\]/, '').trim();
    }
  
    function moveFiles(wfiles, next){
      console.log('[3/5] Start movefiles okMove=',okMove);
      var type='', newdirs=[], moves = [];
      var dir = settings.path.download;
      
      _.each(wfiles, function(wfile){
        
        if ((type=mapsType[wfile.type])){
          var dirout = settings.path[type];
          
          if (wfile.type==='episode'){
            dirout=path.join(dirout, changeCase.titleCase(wfile.title));
            fs.exists(dirout, function(exists){
              if (!exists){
                console.warn('Will create dir %s',dirout);
                newdirs.push(async.apply(fs.mkdirp, dirout));
              }
            });
          }
          
          var dest = path.join(dirout,cleanoutputfile(wfile.basename));
          var f = path.join(dir,wfile.filename);
          
          wfile.source = f;
          wfile.dest = dest;
          wfile.status='ready';

          //console.warn('Will move file %s to %s',f , dest);
          //moves.push(async.apply(fs.move, dir+wfile.filename, dest));
          moves.push(function(next){
              console.log('move (%s) %s ', okMove, dest);
              
              fs.exists(dest, function(exists){
                if (exists){
                  console.error('Exists : Destination %s already exists', dest);
                  wfile.error = {code:99};
                }
                wfile.destexists = exists;
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
      console.log('[4/5] save log');
      r.date = new Date();
      
      jsonfile.writeFileSync(DB_PATH, r);
      if (false && !_.isEmpty(r.moves)){
        //No moved files
        //Save log
        console.log(' Will save log into ', DB_PATH, r);
        jsonfile.writeFile(DB_PATH, r, function(err) {
          if (err){
            console.error(' Error to save log into ', DB_PATH);
            console.log(err);
          }else{
            console.log(' Saved log into ', DB_PATH);
          }
          next(err, r);
        });
      }else{
        //No save, just forward
        console.log(' Nothing to move');
        next(null, r);
      }
    }
    
    async.waterfall([scan, detectFiles, moveFiles, savelog, formatOutput], callback);
};

function formatOutput(r, next){
  var files = r.moves;
  console.log('[5/5] findBanner for '+files.length+' files');
  async.map(files, tvbanner.findBanner, function(err, o){
    console.log('Banners search finished');
    next(err,o);
  });
}

function getFilesizeInBytes(filename) {
  var stats = fs.statSync(filename);
  var fileSizeInBytes = stats.size;
  //Convert the file size to megabytes (optional)
  var fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
  return fileSizeInMegabytes;
}