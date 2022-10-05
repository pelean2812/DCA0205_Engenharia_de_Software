var express = require('express');
var router = express.Router();
var questions = [];
let inc = 1;

router.get('/', function(req, res, next) {
  res.render('Login');
});
router.get('/TelaCadastro', function(req, res, next) {
  res.render('TelaCadastro');
});

router.post('/question', (req ,res) => {
    let question = req.body;
    question.id = inc;
    questions.push(question);
    console.log(questions);
    res.send({question})
    inc++;
    return;
});

router.get('/question', (req ,res) => {
    res.send({questions});
    return;
});

router.delete('/question', (req ,res) => {
  const index = req.params.id
  console.log("apagou com sucesso");
  return;
});

module.exports = router;
