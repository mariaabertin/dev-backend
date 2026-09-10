const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Permite requisições de qualquer origem local para evitar bloqueios no desenvolvimento
app.use(cors());
app.use(express.json());

// Verifique se a porta do MySQL no XAMPP é 3306 ou 3307
const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  port: 3307, // Altere para 3307 apenas se alterou no my.ini do XAMPP
  password: "",
  database: "crudealunos"
});

// Teste de conexão com o banco de dados no terminal
db.getConnection((err, connection) => {
  if (err) {
    console.error("Erro ao conectar no MySQL (XAMPP):", err.message);
  } else {
    console.log("Conectado ao MySQL com sucesso!");
    connection.release();
  }
});

app.get("/listar", (req, res) => {
  const SQL = "SELECT * FROM alunos";
  db.query(SQL, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao listar alunos" });
    }
    res.json(result);
  });
});

app.post("/register", (req, res) => {
  const { nome, idade } = req.body;
  const SQL = "INSERT INTO alunos(nome, idade) VALUES (?, ?)";

  db.query(SQL, [nome, idade], (err, result) => {
    if (err) {
      console.error("Erro no INSERT:", err);
      return res.status(500).json({ error: "Erro ao cadastrar aluno" });
    }
    res.json({ message: "Aluno cadastrado com sucesso", id: result.insertId });
  });
});

app.put("/editar/:id", (req, res) => {
  const alunoId = req.params.id;
  const { nome, idade } = req.body;
  const SQL = "UPDATE alunos SET nome = ?, idade = ? WHERE id = ?";

  db.query(SQL, [nome, idade, alunoId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao editar aluno" });
    }
    res.json({ message: "Aluno editado com sucesso" });
  });
});

app.delete("/excluir/:id", (req, res) => {
  const alunoId = req.params.id;
  const SQL = "DELETE FROM alunos WHERE id = ?";

  db.query(SQL, [alunoId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao excluir aluno" });
    }
    res.json({ message: "Aluno excluído com sucesso" });
  });
});

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});