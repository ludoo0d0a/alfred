
var TVDBClient = require("node-tvdb"),
    _ = require("lodash"),
    tvdb = new TVDBClient(process.env.TVDB_KEY || "5665D3A6E50F1BBB"),
    MovieDB = require('moviedb')(process.env.TMDB_KEY || 'c6bf52a42e8b231bfc29314d0f99cbd3'),
    tmdb = require('tmdbv3').init(process.env.TMDB_KEY || 'c6bf52a42e8b231bfc29314d0f99cbd3');

function findBannerTvshow(r, next){
    tvdb.getSeries(r.series || r.title, function(err, results) {
        var tvshow = results && results[0];
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
        next(null, res);
    });
}
 
function findBannerMovie(r, next){
    var format = 'w500';
    tmdb.configuration(function(err, res){
        var config = res;
        tmdb.search.movie(r.title, function(err, response) {
        //MovieDB.searchMovie({query: r.title}, function(err, response) {
            var movie = response.results && response.results[0];
            //original_title, poster_path
            //tmdb.movie.info(res.id, function(err, movie){
            //MovieDB.movieInfo({id: response.id}, function(err, movie){
            var res = _.merge(r, movie);
            if (res && res.poster_path){
                res.banner = config.images.base_url+format+res.poster_path;
            }
            next(null, res);
            //});
        });
    });
       
}
exports.findBanner = function(o, next){
    var r = o;
    if (!o){
        next(null);//no banner, bypass
        return;
    }
    if (_.isString(o)){
        r = {title: o};
    }
    
    if (r.type ==='episode'){
        findBannerTvshow(r, next);
    }else{
        findBannerMovie(r, next);
    }
};

