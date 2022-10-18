
var questions = [
  {
    id: 1,
    enunciado: "Quanto é 1 + 1 ?",
    alternativas: ['11','2','5', 'JOTA'],
    resposta: 1,
    dificuldade: 'Fácil',
    categoria: 'Matemática'
  },
  {
    id: 2,
    enunciado: "Quanto é 2 + 2 ?",
    alternativas: ['12','22','4', 'DÁBLIU'],
    resposta: 2,
    dificuldade: 'DIFÍCIL',
    categoria: 'Matemática'
  },
  {
    id: 3,
    enunciado: "Quanto é 2 + 3 ?",
    alternativas: ['5','22','4', 'DÁBLIU'],
    resposta: 0,
    dificuldade: 'DIFÍCIL',
    categoria: 'Matemática'
  },
  {
    id: 4,
    enunciado: "Quanto é 5 + 5 ?",
    alternativas: ['VINTE','DEZ','4', 'DÁBLIU'],
    resposta: 1,
    dificuldade: 'DIFÍCIL',
    categoria: 'Matemática'
  },
  {
    id: 5,
    enunciado: "Quanto é 20 + 10 ?",
    alternativas: ['5','22','40', 'DÁBLIU'],
    resposta: 2,
    dificuldade: 'DIFÍCIL',
    categoria: 'MATEMÁGICA'
  },
  {
    id: 6,
    enunciado: "Quanto é 20 + 30 ?",
    alternativas: ['5','CINQUENTA','40', 'DÁBLIU'],
    resposta: 1,
    dificuldade: 'DIFÍCIL',
    categoria: 'MATEMÁTICA'
  },
  {
    id: 7,
    enunciado: "Quanto é 20 + 40 ?",
    alternativas: ['5','CINQUENTA','60', 'DÁBLIU'],
    resposta: 2,
    dificuldade: 'DIFÍCIL',
    categoria: 'MATEMÁTICA'
  },
  {
    id: 8,
    enunciado: "Quanto é 40 + 40 ?",
    alternativas: ['5','OITENTA','60', 'DÁBLIU'],
    resposta: 1,
    dificuldade: 'DIFÍCIL',
    categoria: 'MATEMÁTICA'
  },
  {
    id: 9,
    enunciado: "Quanto é 100 + 40 ?",
    alternativas: ['140','CINQUENTA','60', 'DÁBLIU'],
    resposta: 0,
    dificuldade: 'DIFÍCIL',
    categoria: 'MATEMÁTICA'
  },
  {
    id: 10,
    enunciado: "Quanto é 50 + 40 ?",
    alternativas: ['5','OITENTA','60', 'NOVENTAH'],
    resposta: 3,
    dificuldade: 'DIFÍCIL',
    categoria: 'MATEMÁTICA'
  }
];

//Framework Express
var express = require('express');
var router = express.Router();
//como só tem uma questão cadastrada, o ID da próxima eh 2.
//inc = n Questões + 1
let inc = 7;
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

//Função para verificar se o token é válido
function verifyJWT(req,res,next){
  //A linha a seguir é para recuperar o token e separar o token da string: "Bearer "
  const token = req.cookies.token;
  if(!token){
    return res.sendStatus(401);
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if(err){
      return res.sendStatus(401);
    }
    req.userid = decoded.userid;
    req.role = decoded.role;
    next();
  })
}


//Rota inicial
router.get('/', function (req, res, next) {
  res.render('Login');
});

//Rota obter página questões cadastradas
router.get('/QuestoesCadastradas', verifyJWT ,function (req, res, next) {
  if(req.role !== 'teacher'){
    return res.sendStatus(401);
  }
  res.render('QuestoesCadastradas');
});

//Rota obter página provas cadastradas
router.get('/TelaAlunoProvas', verifyJWT , function (req, res, next) {
  if(req.role !== 'student'){
    return res.sendStatus(401);
  }
  res.render('TelaAlunoProvas');
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

  //Gerando Token com tempo válido de 1 hora
  const token = jwt.sign({ userid: user.userid, role: user.role }, SECRET, { expiresIn: '1h' });

  //Guardando o token nos cookies da página
  return res.cookie('token',token,{httpOnly: true, maxAge: 3600000}).json({ token: token, role: user.role });
});

//Rota obter página TelaCadastro
router.get('/TelaCadastro', verifyJWT ,function (req, res, next) {
  if(req.role !== 'teacher'){
    return res.sendStatus(401);
  }
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
router.get('/question', verifyJWT, (req, res) => {
  if(req.role !== 'teacher'){
    return res.sendStatus(401);
  }
  res.send({ questions });
  return;
});

//Rota para deletar questões
router.delete('/question/:id', verifyJWT, (req, res) => {
  if(req.role !== 'teacher'){
    return res.sendStatus(401);
  }
  const index = req.params.id;
  questions = questions.filter((question) => +index !== question.id);
  return res.sendStatus(200);
});

router.get('/logout', (req, res) =>{
  res.clearCookie('token');
  return res.sendStatus(200);
})

module.exports = router;
