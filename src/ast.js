// src/ast.js

// Representación de expresiones
class Expr {
  static Number(value) {
    return { type: "Number", value };
  }

  static Float(value) {
    return { type: "Float", value };
  }

  static StringLiteral(value) {
    return { type: "StringLiteral", value };
  }

  static Identifier(name) {
    return { type: "Identifier", name };
  }

  static BinaryOp(left, op, right) {
    return { type: "BinaryOp", left, op, right };
  }

  static Call(functionName, argument) {
    return { type: "Call", functionName, argument };
  }
}

// Representación de sentencias
class Stmt {
  static LetStmt(name, value) {
    return { type: "LetStmt", name, value };
  }

  static ExprStmt(expression) {
    return { type: "ExprStmt", expression };
  }

  static IfStmt(condition, thenBranch, elseBranch) {
    return { type: "IfStmt", condition, thenBranch, elseBranch };
  }

  static WhileStmt(condition, body) {
    return { type: "WhileStmt", condition, body };
  }

  static LoopStmt(body) {
    return { type: "LoopStmt", body };
  }

  static ReturnStmt(expression) {
    return { type: "ReturnStmt", expression };
  }

  static BlockStmt(statements) {
    return { type: "BlockStmt", statements };
  }
}

module.exports = { Expr, Stmt };
