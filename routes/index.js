var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.session.botReady)
    req.session.botReady = false;

  res.render('index', { title: 'Express', session: req.session });
});

module.exports = router;
