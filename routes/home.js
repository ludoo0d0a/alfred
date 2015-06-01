var express = require('express'),
    router = express.Router(),
    analyzer = require('../app/analyzer');


/* GET home page. */
router.get('/', function(req, res) {
  res.render('home', { title: 'Alfred, the movies mover' });
});

router.get('/scanner', function(req, res) {
 var op =  req.query.op;
 analyzer.execute({op:op}, req, res);
});

// //force scan 
// router.post('/scanner', function(req, res) {
//   var op =  'scan';
//   analyzer.execute({op:op}, req, res);
// });

module.exports = router;
