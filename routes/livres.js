var express = require('express'),
    router = express.Router();

/* GET books listing. */
router.get('/', function(req, res) {
  res.render('livres', {});
});


module.exports = router;
