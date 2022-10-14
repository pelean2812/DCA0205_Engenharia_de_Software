//Iniciando array com algumas questões
/*{
  id: 1,
  enunciado: "Quanto é 1 + 1 ?",
  
}*/
var questions = [];




//Framework Express
var express = require('express');
var router = express.Router();
//inc vai definir qual o id da questão
let inc = 1;
//As linhas a seguir são para implementar o JWT (JSON Web Token)
const jwt = require('jsonwebtoken');
const SECRET = "projetopes";

//users são os usuários e as senhas que podem fazer login no sistema
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
},
{
  userid: "3",
  username: "adm",
  password: "adm",
  role: "teacher"
}];

//Rota inicial
router.get('/', function (req, res, next) {
  res.render('Login');
});

//Rota obter página questões cadastradas
router.get('/QuestoesCadastradas', function (req, res, next) {
  res.render('QuestoesCadastradas');
});

//Rota POST para fazer login
router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = users.find((user) => user.username === username);

  //Procurando usuário no banco
  if (!user) {
    return res.sendStatus(404);
  }
  //Verificando senha
  if (password !== user.password) {
    return res.sendStatus(404)
  }

  //Gerando Token com tempo válido de 1 dia
  const token = jwt.sign({ userid: user.userid, role: user.role }, SECRET, { expiresIn: '1d' });

  return res.json({ token: token, role: user.role });
});

//Função para verificar se o token é válido
function verifyJWT(req,res,next){
  //A linha a seguir é para recuperar o token e separar o token da string: "Bearer "
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

//Rota obter página TelaCadastro
router.get('/TelaCadastro', function (req, res, next) {
  res.render('TelaCadastro');
});

//Rota POST para cadastrar questões
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

//Rota obter questões cadastradas
router.get('/question', (req, res) => {
  res.send({ questions });
  return;
});

//Rota para deletar questões
router.delete('/question/:id', (req, res) => {
  const index = req.params.id;
  questions = questions.filter((question) => +index !== question.id);
  return res.sendStatus(200);
});

module.exports = router;
