# DCA0205_Engenharia_de_Software

Componentes do grupo:
- PEDRO LEANDRO BATISTA MARQUES
- RYCHARDSON RIBEIRO DE SOUZA
- EDSON AUGUSTO DIAS GOMES
- PAULO RICARDO DANTAS
- GABRIEL CRUZ DE LAVOR

# Histórias de usuário
- [X] No papel de professor, eu gostaria de cadastrar perguntas do tipo múltipla escolha (juntamente com a resposta, as categorias do tipo disciplina, assunto e dificuldade).

- [ ] No papel de professor, eu gostaria de selecionar algumas questões e criar uma prova

- [ ] No papel de professor, eu gostaria de corrigir as provas automaticamente e obter uma lista com as notas dos alunos 

# Passos da primeira Spring

Levando em consideração as três históriasd de usuário, conseguimos implementar a parte de cadastrar as questões.

1. Tela de login (não é todo mundo que vai poder cadastrar as questões): Feita por Edson, Rychardson e Gabriel.
2. Tela de cadastro (Formulário: enunciado, as alternativas, a categoria das questões, o tipo da disciplina, o assunto e a dificuldade): Feita por Pedro, Rychardson e Paulo

---
![tela de login](/sprint1imagens/1.PNG)

![tela de login erro](/sprint1imagens/2.PNG)

![tela de cadastro](/sprint1imagens/3.PNG)

## Dificuldades
Como tudo isso foi feito sem um banco de dados, não conseguimos cadastrar um professor para que só assim ele consiga logar, por isso, o usuário e senha padrão são, respectivamente "admin" e "admin" (sem as aspas). Também devido a ausência de um banco de dados, sempre que a página é recarregada, as questões cadastradas sumiam. Em suma, a dificuldade está no armazenamento das questões. Com isso, das três histórias de usuário, apenas uma foi implementada aceitavelmente.
