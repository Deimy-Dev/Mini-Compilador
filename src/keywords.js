// src/keywords.js
const TokenType = require("./tokenTypes"); // Importa los tipos de tokens definidos en tokenTypes.js


// Mapa de palabras clave reservadas del lenguaje a sus respectivos tipos de token.
// Si un identificador coincide con una de estas palabras, se considera una palabra clave.
// Si no coincide, se tratará como un identificador normal.
const keywords = {
  let: TokenType.Let,
  mut: TokenType.Mut,
  if: TokenType.If,
  else: TokenType.Else,
  match: TokenType.Match,
  while: TokenType.While,
  loop: TokenType.Loop,
  fn: TokenType.Fn,
  return: TokenType.Return,
  break: TokenType.Break,
  continue: TokenType.Continue,
  struct: TokenType.Struct,
  enum: TokenType.Enum,
  impl: TokenType.Impl,
  trait: TokenType.Trait,
  mod: TokenType.Mod,
  use: TokenType.Use,
  const: TokenType.Const,
  static: TokenType.Static,
  async: TokenType.Async,
  await: TokenType.Await,
  for: TokenType.For,
  in: TokenType.In,
  pub: TokenType.Pub,
  crate: TokenType.Crate,
  super: TokenType.Super,
  self: TokenType.SelfLower,
  Self: TokenType.SelfUpper,
  type: TokenType.Type,
  where: TokenType.Where,
  move: TokenType.Move,
  unsafe: TokenType.Unsafe,
};


// Función que verifica si una palabra es una palabra clave del lenguaje.
// Si lo es, retorna el tipo de token correspondiente.
// Si no lo es, retorna TokenType.Identifier (es un identificador normal).
function lookupKeyword(word) {
  return keywords[word] || TokenType.Identifier;
}

module.exports = lookupKeyword; //Exporta la función
