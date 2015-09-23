'use strict'

var request = require('request'),
  path = require('path'),
  _ = require('lodash');

exports.guess = function(filename, next){
    var basename = path.basename(filename); 
    console.log('guess ', filename);
    request('http://guessit.io/guess?filename='+basename, function (error, response, body) {
      console.log('...guessed ', filename);
      if (!error && response.statusCode == 200) {
        var json = JSON.parse(body);
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
        next({error:error, statusCode:response.statusCode});
      }
    });
};
