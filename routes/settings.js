var express = require('express'),
    fs    = require('fs'),
    router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  var o = req.app.nconf.get('settings') || {};

  res.render('settings', {settings:o});
});

//save settings
router.post('/', function(req, res) {
    var r= req.body, o = {
      path: {
          tvshow: r.path && r.path.tvshow,
          movie : r.path && r.path.movie
      },
      delay: r.delay || '12h'
  };
  req.app.nconf.set('custom', o);
  req.app.nconf.save(function (err) {
    //done
    if (!err){
        res.send({succes:true});
        //res.render('settings', app.nconf.get('custom'));
    }
    
  });

});


module.exports = router;
