var express = require('express'),
    router = express.Router();

/* GET todos listing. */
router.get('/', function(req, res) {
  res.render('todos', {});
});


module.exports = router;
