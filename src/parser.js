// src/parser.js

const TokenType = require("./tokenTypes");
const { Expr, Stmt } = require("./ast");

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }

  // Función principal: inicia el análisis sintáctico
  parse() {
    const statements = [];

    // Recorremos los tokens y parseamos declaraciones o sentencias
    while (!this.isAtEnd()) {
      const stmt = this.parseStmt();
      if (stmt) {
        statements.push(stmt);
      } else {
        break;
      }
    }

    return statements;
  }

  // Analiza una declaración o sentencia
  parseStmt() {
    if (this.match(TokenType.Let)) {
      return this.parseLetStmt();
    }

    if (this.match(TokenType.If)) {
      return this.parseIfStmt();
    }

    if (this.match(TokenType.While)) {
      return this.parseWhileStmt();
    }

    if (this.match(TokenType.Loop)) {
      return this.parseLoopStmt();
    }

    if (this.match(TokenType.Return)) {
      return this.parseReturnStmt();
    }

    if (this.match(TokenType.LBrace)) {
      return Stmt.BlockStmt(this.parseBlock());
    }

    // Por defecto: tratar como una expresión
    const expr = this.parseExpression();
    this.consume(TokenType.Semicolon, "Expected ';' after expression.");
    return Stmt.ExprStmt(expr);
  }

  // let nombre = expresión;
  parseLetStmt() {
    const name = this.consume(TokenType.Identifier, "Expected variable name.");
    this.consume(TokenType.Assign, "Expected '=' after variable name.");
    const value = this.parseExpression();
    this.consume(TokenType.Semicolon, "Expected ';' after variable declaration.");
    return Stmt.LetStmt(name.value, value);
  }

  parseIfStmt() {
    const condition = this.parseExpression();
    const thenBranch = this.parseStmt();

    let elseBranch = null;
    if (this.match(TokenType.Else)) {
      elseBranch = this.parseStmt();
    }

    return Stmt.IfStmt(condition, thenBranch, elseBranch);
  }

  parseWhileStmt() {
    const condition = this.parseExpression();
    const body = this.parseStmt();
    return Stmt.WhileStmt(condition, body);
  }

  parseLoopStmt() {
    const body = this.parseStmt();
    return Stmt.LoopStmt(body);
  }

  parseReturnStmt() {
    const expr = this.parseExpression();
    this.consume(TokenType.Semicolon, "Expected ';' after return value.");
    return Stmt.ReturnStmt(expr);
  }

  parseBlock() {
    const statements = [];
    while (!this.check(TokenType.RBrace) && !this.isAtEnd()) {
      statements.push(this.parseStmt());
    }
    this.consume(TokenType.RBrace, "Expected '}' after block.");
    return statements;
  }

  // Expresión general (aquí puedes expandirlo luego)
  parseExpression() {
    return this.parseEquality(); // Punto de entrada para expresiones
  }

  // Comparaciones: ==, !=
  parseEquality() {
    let expr = this.parseComparison();

    while (this.match(TokenType.Equal, TokenType.NotEqual)) {
      const operator = this.previous();
      const right = this.parseComparison();
      expr = Expr.BinaryOp(expr, operator.type, right);
    }

    return expr;
  }

  // Comparaciones: <, >, <=, >=
  parseComparison() {
    let expr = this.parseTerm();

    while (this.match(TokenType.LessThan, TokenType.GreaterThan, TokenType.LessEqual, TokenType.GreaterEqual)) {
      const operator = this.previous();
      const right = this.parseTerm();
      expr = Expr.BinaryOp(expr, operator.type, right);
    }

    return expr;
  }

  // Suma y resta
  parseTerm() {
    let expr = this.parseFactor();

    while (this.match(TokenType.Plus, TokenType.Minus)) {
      const operator = this.previous();
      const right = this.parseFactor();
      expr = Expr.BinaryOp(expr, operator.type, right);
    }

    return expr;
  }

  // Multiplicación, división, módulo
  parseFactor() {
    let expr = this.parseUnary();

    while (this.match(TokenType.Asterisk, TokenType.Slash, TokenType.Percent)) {
      const operator = this.previous();
      const right = this.parseUnary();
      expr = Expr.BinaryOp(expr, operator.type, right);
    }

    return expr;
  }

  // Unario (por ahora no implementamos ! o - unario)
  parseUnary() {
    return this.parsePrimary();
  }

  // Literales, identificadores, llamadas a funciones
  parsePrimary() {
    if (this.match(TokenType.Number)) {
      return Expr.Number(this.previous().value);
    }

    if (this.match(TokenType.Float)) {
      return Expr.Float(this.previous().value);
    }

    if (this.match(TokenType.StringLiteral)) {
      return Expr.StringLiteral(this.previous().value);
    }

    if (this.match(TokenType.Identifier)) {
      const id = this.previous();
      if (this.match(TokenType.LParen)) {
        const arg = this.parseExpression();
        this.consume(TokenType.RParen, "Expected ')' after argument.");
        return Expr.Call(id.value, arg);
      } else {
        return Expr.Identifier(id.value);
      }
    }

    if (this.match(TokenType.LParen)) {
      const expr = this.parseExpression();
      this.consume(TokenType.RParen, "Expected ')' after expression.");
      return expr;
    }

    throw new Error("Unexpected token in expression.");
  }

  // Helpers
  match(...types) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  consume(type, message) {
    if (this.check(type)) return this.advance();
    throw new Error(message);
  }

  check(type) {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  advance() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  isAtEnd() {
    return this.peek().type === TokenType.EOF;
  }

  peek() {
    return this.tokens[this.current];
  }

  previous() {
    return this.tokens[this.current - 1];
  }
}

module.exports = Parser;
