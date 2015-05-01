var express = require('express'),
    router = express.Router(),
   Backbone = require('backbone');
   
 
var fixture = require('./fixture');//books.json
var collection = new Backbone.Collection(fixture);

/* GET books listing. */
router.get('/', function(req, res) {
  res.render('books', {});
});

router.get('/all', function(req, res) {
  res.json(collection);
});
router.get('/:id', function(req, res) {
  var model = collection.get(req.params.id);
  res.json(model);
});

module.exports = router;
