'use strict'

var config = require('../data/config.json'),
    TVDB = require('node-tvdb'),
    tvdb = new TVDB(process.env.TVDB_KEY || config.keys.tvdb),
    _ = require("lodash"),
    tmdb = require('tmdbv3').init(process.env.TMDB_KEY ||  config.keys.tmdb);

function findBannerTvshow(r, next){
    console.log('find tvdb banner for tvshow: ', r.title);
// r.link='';
// next(null, r);
// return;

    tvdb.getSeriesByName(r.title, function(err, results) {
        console.log('>> ', r, err, results);
        if (err){
            console.error('tvbd search tvshow error on '+r.title, err);
            next(err, null);
            return;
        }
        var tvshow = results && results[0];
        console.log('Found tvshow '+r.title, tvshow);
        /*
SeriesName: "Elementary"
IMDB_ID: "tt2191671"
zap2it_id: "EP01568604"
Overview: "Following his fall from grace in London and a stint in rehab, eccentric Sherlock... (length: 842)"
id: "255316"
FirstAired: "2012-09-27"
banner: "graphical/255316-g12.jpg"
Network: "CBS"
seriesid: "255316"
language: "en"
        */
        var res = _.merge(r, tvshow);
        if (res && res.banner){
            res.banner = 'http://thetvdb.com/banners/'+res.banner;
        }
        res.link = 'http://thetvdb.com/?tab=series&id='+res.id;
        next(null, res);
    });
}
 
function findBannerMovie(r, next){
    var format = 'w500';
    try{
        console.log('find tmdb banner for movie ', r.title);
        tmdb.configuration(function(err, res){
            if (err){
                console.error('tmbd config error', err);
                next(err, null);
                return;
            }
            var config = res;
            tmdb.search.movie(r.title, function(err, response) {
            //MovieDB.searchMovie({query: r.title}, function(err, response) {
                if (err){
                    console.error('tmbd search movie error on '+r.title, err);
                    next(err, null);
                    return;
                }
                var movie = response.results && response.results[0];
                //original_title, poster_path
                //tmdb.movie.info(res.id, function(err, movie){
                //MovieDB.movieInfo({id: response.id}, function(err, movie){
                var res = _.merge(r, movie);
                if (res && res.poster_path){
                    res.banner = config.images.base_url+format+res.poster_path;
                }
                res.link = 'https://www.themoviedb.org/movie/'+res.id;
                next(null, res);
                //});
            });
        });
    } catch(e){
        next(e, null);
    }
}
function idCreator(o, next){
    if (o){
        o.badgeclass = 'icon-film';
        
        if (o.type==='episode'){
            o.id = [o.seriesid, o.episodeNumber, o.language].join('_');
            o.badgeclass='icon-tv';
        }
        if (!o.id){
          o.id = (o.title || o.basename).replace(/\s/g, '_');
        }
    }
    next(null, o);
}

exports.findBanner = function(o, next){
    var r = o;
    if (!o){
        console.log('no banner to find');
        next(null);//no banner, bypass
        return;
    }
    if (_.isString(o)){
        r = {title: o};
    }

    if (r.type ==='episode'){
        findBannerTvshow(r, function(err, o){
            idCreator(o, next);
        });
        
    }else{
        findBannerMovie(r, function(err, o){
            idCreator(o, next);
        });
    }
};

