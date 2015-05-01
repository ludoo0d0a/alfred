var express = require('express');
var fs = require('fs-extra');
var MovieDB = require('moviedb');
var guessit = require('../app/guessit');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    guessit.guess('Dracula.Untold.2014.TRUEFRENCH.1080p.BDRip.x264-HMiDiMADRiDi.www.wawa-film.net.mkv', function(err, json) {
        res.send(json);
    });
});

module.exports = router;
