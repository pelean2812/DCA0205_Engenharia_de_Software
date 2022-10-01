var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('Login');
});
router.get('/TelaCadastro', function(req, res, next) {
  res.render('TelaCadastro.ejs');
});

module.exports = router;
