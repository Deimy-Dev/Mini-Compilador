// server.js
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");

const Lexer = require("./src/lexer");
const Parser = require("./src/parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // para servir index.html

app.post("/analizar", (req, res) => {
  try {
    const sourceCode = req.body.code;

    const lexer = new Lexer(sourceCode);
    const tokens = lexer.scanTokens();

    const parser = new Parser(tokens);
    const ast = parser.parse();

    res.json({
      success: true,
      tokens,
      ast,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});
