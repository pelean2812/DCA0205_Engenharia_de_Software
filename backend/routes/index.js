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

router.get('/QuestoesCadastradas', function (req, res, next) {
  res.render('QuestoesCadastradas');
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

function verifyJWT(req,res,next){
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, SECRET, (err, decoded) => {
    if(err){
      return res.sendStatus(401);
    }
    req.userid = decoded.userid;
    req.role = decoded.role;
    next();
  })
}

router.get('/TelaCadastro', function (req, res, next) {
  res.render('TelaCadastro');
});

router.post('/question', verifyJWT, (req, res) => {
  if(req.role !== 'teacher'){
    return res.sendStatus(401);
  }
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
