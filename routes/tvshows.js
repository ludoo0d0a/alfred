var express = require('express');
var fs = require('fs-extra');
var guessit = require('../app/guessit');

var router = express.Router();

/* GET tvshows page. */
router.get('/', function(req, res) {
    guessit.guess("Downton Abbey S02E05 HDTV.XviD.RedStarBG", function(err, json) {
        res.send(json);
    });
});

module.exports = router;
