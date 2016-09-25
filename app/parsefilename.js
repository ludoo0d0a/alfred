'use strict'

var request = require('request'),
  parser = require('episode-parser'),
  path = require('path'),
  _ = require('lodash');

exports.guess = function(filename, next){
    var basename = path.basename(filename); 
    console.log('search on themoviedb.org : ', filename);
    mdb.searchMulti({query:basename}, function (error, response) {
      //console.log('...guessed ', filename);
      if (!error && response.statusCode == 200) {
        var json = JSON.parse(response.responseText);
        var o = _.merge({filename:filename, basename:basename}, json);

        //tvshow
        if (o.type==='episode'){
          o.lead = o.Network||''; 
          if (o.language){
            o.lead+= '('+o.language+')';
          }
         
        }
        //movie
        o.lead = o.Network||''; 
        next(null, o);
      }else{
        next({error:error, query:basename, statusCode:response.statusCode, response:response, text:'themoviedb.org is unreachable !!'});
      }
    });
};
