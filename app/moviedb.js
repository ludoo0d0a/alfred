'use strict'

var request = require('request'),
  mdb = require('moviedb')('c6bf52a42e8b231bfc29314d0f99cbd3'),
  parser = require('episode-parser'),
  ptn = require('torrent-name-parser'),
  path = require('path'),
  _ = require('lodash');

  let cleanFilename = function(filename){
    return filename
      //Remove extension
      .replace(/\.\w{3,4}$/, '')
      //Remove [ provider]
      .replace(/^\[.*\]/, ' ')
      //Replace dot by space
      .replace(/\./g, ' ').trim();
  }

exports.guess = function(filename, next){
    var basename = path.basename(filename); 
    console.log(' ');
     console.log('search on themoviedb.org : ', basename);
//https://www.npmjs.com/package/torrent-name-parser
    /*
{ season: 5,
  episode: 2,
  resolution: '720p',
  quality: 'HDTV',
  codec: 'x264',
  group: 'KILLERS[rartv]',
  title: 'The Staying Alive' }
*/
    var query = basename, media = ptn(basename);
    console.log('media: ', media);
    if (media){
      query = cleanFilename(media.title);
    }else{
      query = cleanFilename(basename);
    }

    console.log('search moviedb =', basename, query);
    mdb.searchMulti({query:query}, function (error, response) {
      //console.log('...guessed ', response);
      if (error){
        next({error:error, query:query, basename:basename, media:media, response:response, text:'themoviedb.org failed !!'});
      }else if (response.total_results>=1) {
        var json = response.results[0];
//http://api.themoviedb.org/3/search/multi?api_key=c6bf52a42e8b231bfc29314d0f99cbd3&query=X-Men%20Apocalypse.
/*
poster_path: "/zSouWWrySXshPCT4t3UKCQGayyo.jpg",
adult: false,
overview: "After the re-emergence of the world's first mutant, world-destroyer Apocalypse, the X-Men must unite to defeat his extinction level plan.",
release_date: "2016-05-18",
original_title: "X-Men: Apocalypse",
genre_ids: [28,12,4,878],
id: 246655,
media_type: "movie",
original_language: "en",
title: "X-Men: Apocalypse",
backdrop_path: "/oQWWth5AOtbWG9o8SCAviGcADed.jpg",
popularity: 25.950617,
vote_count: 1878,
video: false,
vote_average: 6.09
*/
        var o = _.assign({filename:filename, basename:basename}, media);
        _.assign(o, json);

        if (o.episode){
          o.type='episode';
          o.lead = o.Network||''; 
          if (o.language){
            o.lead+= '('+o.language+')';
          }
        }else{
          o.type='movie';
        }
        //movie
        o.lead = o.Network||''; 
        next(null, o);
      }else{
        next({error:error, query:query, basename:basename, media:media, text:'themoviedb.org has no result  !!'});
      }
    });
};
