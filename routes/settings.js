var express = require('express'),
    _ = require('lodash'),
    router = express.Router();

function getSettings(req){
  return req.app.nconf.get('settings') || {};
}
/* GET users listing. */
router.get('/', function(req, res) {
  var o = getSettings(req);
  res.send(o);
});

//save settings
router.post('/', function(req, res) {
  var settings = getSettings(req);
    var r= req.body, o = {
      path: {
          tvshow: (r.path && r.path.tvshow) || '',
          movie : (r.path && r.path.movie) || ''
      },
      delay: r.delay || '12h'
  };
  o = _.assign(settings, o);
  req.app.nconf.set('settings', o);
  req.app.nconf.save(function (err) {
    //done
    if (!err){
        res.send({succes:true});
        //res.render('settings', app.nconf.get('custom'));
    }
  });
});

module.exports = router;
