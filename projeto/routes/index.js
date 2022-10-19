
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
    enunciado: "Qual é o nome da bankai do ichigo?",
    alternativas: ['Zangetsu','Tensa Zangetsu','Bankai', 'Zampakutou'],
    resposta: 1,
    dificuldade: 'Mediana',
    categoria: 'Geek'
  },
  {
    id: 3,
    enunciado: "Who is Mr. Robot?",
    alternativas: ['Mr. Robot','Elliot', 'Nobody', 'Who is?'],
    resposta: 3,
    dificuldade: 'DIFÍCIL',
    categoria: 'Geek'
  },
  {
    id: 4,
    enunciado: "Quanto custa o sanduiche natural do amigão?",
    alternativas: ['R$ 4,00','R$ 2,50','R$ 3,00', 'R$ 2,00'],
    resposta: 0,
    dificuldade: 'Fácil',
    categoria: 'Cumê'
  },
  {
    id: 5,
    enunciado: "Qual é o melhor peixe para se comer com cuscuz?",
    alternativas: ['Piaba','Tainha','Pilato', 'Atum'],
    resposta: 2,
    dificuldade: 'DIFÍCIL',
    categoria: 'Cumê'
  },
  {
    id: 6,
    enunciado: "Quanto é 20 + 10 ?",
    alternativas: ['30','2010','40', 'DÁBLIU'],
    resposta: 2,
    dificuldade: 'DIFÍCIL',
    categoria: 'MATEMÁTICA'
  },
  {
    id: 7,
    enunciado: "No domínio da frequência, uma convolução vira uma:",
    alternativas: ['Multiplicação','Divisão','Subtração', 'Somatória Infinita'],
    resposta: 0,
    dificuldade: 'Mediana',
    categoria: 'MATEMÁTICA'
  },
  {
    id: 8,
    enunciado: "Integrar no domínio do tempo, equivale, no domínio de laplace à:",
    alternativas: ['Dividir a Função transforamda por s','Multiplicar a Função transforamda por s','Inegrar a função transformada', 'Derivar a função transformada'],
    resposta: 0,
    dificuldade: 'Mediana',
    categoria: 'MATEMÁTICA'
  },
  {
    id: 9,
    enunciado: "Qual é a técnica mais poderosa de demon slayer?",
    alternativas: ['Hinokami Kagura','Respiração do som','Respitação do sol', 'Respiração da água'],
    resposta: 2,
    dificuldade: 'Fácil',
    categoria: 'Geek'
  },
  {
    id: 10,
    enunciado: "Feijão em cima ou em baixo do arroz?",
    alternativas: ['Cima','Baixo','SIM!', 'De lado'],
    resposta: 0,
    dificuldade: 'DIFÍCIL',
    categoria: 'Cumê'
  }
];

var exams= [];

//Framework Express
var express = require('express');
var router = express.Router();
//como só tem uma questão cadastrada, o ID da próxima eh 2.
//inc = n Questões + 1
let inc = 11;
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
    //req.username = users.filter((user) => (user.id === decoded.userid));
    req.username = decoded.username;
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

//Rota obter tela criar prova
router.get('/TelaCriarProva', verifyJWT ,function (req, res, next) {
  if(req.role !== 'teacher'){
    return res.sendStatus(401);
  }
  res.render('TelaCriarProva');
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

//Rota POST para cadastrar provas
router.post('/exam', verifyJWT, (req, res) => {
  if(req.role !== 'teacher'){
    return res.sendStatus(401);
  }
  let ids = req.body.ids;
  let newQuestions = questions.filter((question) => (ids.includes(question.id)));
  exams.push({
    id: exams.length+1,
    questions: newQuestions,
    teachername: req.username
  })
  res.sendStatus(200);
  return;
});

//Rota para obter provas
router.get('/exam', verifyJWT, (req, res) => {
    res.send({ exams });
  return;
});

//Rota de saída
router.get('/logout', (req, res) =>{
  res.clearCookie('token');
  return res.sendStatus(200);
})

module.exports = router;
