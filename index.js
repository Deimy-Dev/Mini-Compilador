// index.js
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const lexer = require("./src/lexer");

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/compile", (req, res) => {
  const input = req.body.code || "";
  const tokens = lexer(input);
  res.json({ output: JSON.stringify(tokens, null, 2) });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
