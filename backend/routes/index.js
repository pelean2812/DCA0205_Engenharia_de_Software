var express = require('express');
var router = express.Router();
var questions = [];
let inc = 1;
const jwt = require('jsonwebtoken');
const SECRET = "projetopes";

let users = [{
  userid: "1",
  username: "Professor",
  password: "professor",
  role: "teacher"
},
{
  userid: "2",
  username: "Aluno",
  password: "aluno",
  role: "student"
}];

router.get('/', function (req, res, next) {
  res.render('Login');
});

router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = users.find((user) => user.username === username);

  if (!user) {
    return res.sendStatus(404);
  }
  if (password !== user.password) {
    return res.sendStatus(404)
  }

  const token = jwt.sign({ userid: user.userid, role: user.role }, SECRET, { expiresIn: '1d' });

  return res.json({ token: token, role: user.role });
});

router.get('/TelaCadastro', function (req, res, next) {
  res.render('TelaCadastro');
});

router.post('/question', (req, res) => {
  console.log(req.headers);
  let question = req.body;
  question.id = inc;
  questions.push(question);
  console.log(questions);
  res.send({ question })
  inc++;
  return;
});

router.get('/question', (req, res) => {
  res.send({ questions });
  return;
});

router.delete('/question', (req, res) => {
  const index = req.params.id
  console.log("apagou com sucesso");
  return;
});

module.exports = router;
