// src/lexer.js
const TokenType = require("./tokenTypes");
const lookupKeyword = require("./keywords");

function isDigit(ch) { // verificamos si un carácter es un dígito
  return /\d/.test(ch);
}

function isAlpha(ch) {  // Verificamos si un carácter es una letra o guion bajo
  return /[a-zA-Z_]/.test(ch);
}

function isAlphanumeric(ch) {  // verificamos si un carácter es alfanúmerico o guion bajo
  return /[a-zA-Z0-9_]/.test(ch);
}

function lexer(input) {
  let pos = 0;
  const tokens = [];

  function peek() {  // Devuelve el carácter actual sin avanzar
    return input[pos];
  }

  function advance() {  // Avanza al siguiente carácter y lo devuelve
    return input[pos++];
  }

  function match(expected) { // Verifica si el carácter actual coincide con el esperado
    if (peek() === expected) {
      advance();
      return true;
    }
    return false;
  }

  function skipWhitespace() {  // Salta espacios, tabs y saltos de línea
    while (/\s/.test(peek())) advance();
  }

  function readNumber() {  // Analiza un número entero o flotante
    let num = '';
    while (isDigit(peek())) num += advance();
    if (peek() === '.' && isDigit(input[pos + 1])) {  // Si encuentra un punto seguido de dígitos, es flotante
      num += advance();
      while (isDigit(peek())) num += advance();
      return { type: TokenType.Float, value: parseFloat(num) };
    }
    return { type: TokenType.Number, value: parseInt(num) };
  }

  function readIdentifier() {
    let ident = '';
    while (isAlphanumeric(peek())) ident += advance();
    const type = lookupKeyword(ident);
    return { type, value: ident };
  }

  function readString() {
    let str = '';
    advance(); // salta la comilla de apertura "
    while (peek() && peek() !== '"') {
      str += advance();
    }
    advance(); // salta la comilla de cierre "
    return { type: TokenType.StringLiteral, value: str };
  }

// Analiza comentarios de línea (// ...)
  function readComment() {
    advance(); // salta primer /
    advance(); // salta segundo /
    let comment = '';
    while (peek() && peek() !== '\n') {
      comment += advance();
    }
    return { type: TokenType.Comment, value: comment };
  }

  // Comienza el bucle principal de análisis
  while (pos < input.length) {
    skipWhitespace();

    const ch = peek();
    if (!ch) break;

    if (isDigit(ch)) { // Detecta números
      tokens.push(readNumber());
    } else if (isAlpha(ch)) { // Detecta identificadores o palabras clave
      tokens.push(readIdentifier());
    } else if (ch === '"') { // Detecta cadenas entre comillas
      tokens.push(readString());
    } else if (ch === '/' && input[pos + 1] === '/') { // Detecta comentarios de línea
      tokens.push(readComment());
    } else {
      // Detecta operadores y símbolos
      switch (ch) {
        case '=':
          advance();
          if (match('=')) tokens.push({ type: TokenType.Equal });
          else if (match('>')) tokens.push({ type: TokenType.Arrow });
          else tokens.push({ type: TokenType.Assign });
          break;
        case '+': advance(); tokens.push({ type: TokenType.Plus }); break;
        case '-':
          advance();
          if (match('>')) tokens.push({ type: TokenType.FatArrow });
          else tokens.push({ type: TokenType.Minus });
          break;
        case '*': advance(); tokens.push({ type: TokenType.Asterisk }); break;
        case '/': advance(); tokens.push({ type: TokenType.Slash }); break;
        case '%': advance(); tokens.push({ type: TokenType.Percent }); break;
        case '!':
          advance();
          if (match('=')) tokens.push({ type: TokenType.NotEqual });
          else tokens.push({ type: TokenType.Not });
          break;
        case '&':
          advance();
          if (match('&')) tokens.push({ type: TokenType.And });
          else tokens.push({ type: TokenType.BitAnd });
          break;
        case '|':
          advance();
          if (match('|')) tokens.push({ type: TokenType.Or });
          else tokens.push({ type: TokenType.BitOr });
          break;
        case '<':
          advance();
          if (match('=')) tokens.push({ type: TokenType.LessEqual });
          else if (match('<')) tokens.push({ type: TokenType.Shl });
          else tokens.push({ type: TokenType.LessThan });
          break;
        case '>':
          advance();
          if (match('=')) tokens.push({ type: TokenType.GreaterEqual });
          else if (match('>')) tokens.push({ type: TokenType.Shr });
          else tokens.push({ type: TokenType.GreaterThan });
          break;

          // Delimitadores y símbolos
        case '(': advance(); tokens.push({ type: TokenType.LParen }); break;
        case ')': advance(); tokens.push({ type: TokenType.RParen }); break;
        case '{': advance(); tokens.push({ type: TokenType.LBrace }); break;
        case '}': advance(); tokens.push({ type: TokenType.RBrace }); break;
        case '[': advance(); tokens.push({ type: TokenType.LBracket }); break;
        case ']': advance(); tokens.push({ type: TokenType.RBracket }); break;
        case ';': advance(); tokens.push({ type: TokenType.Semicolon }); break;
        case ':':
          advance();
          if (match(':')) tokens.push({ type: TokenType.DoubleColon });
          else tokens.push({ type: TokenType.Colon });
          break;
        case ',': advance(); tokens.push({ type: TokenType.Comma }); break;
        case '.': advance(); tokens.push({ type: TokenType.Dot }); break;
        
        // Cualquier carácter desconocido es un error
        default:
          tokens.push({ type: TokenType.Error, value: ch });
          advance();
          break;
      }
    }
  }

  // Agrega el token EOF al final
  tokens.push({ type: TokenType.EOF });
  return tokens;
}

module.exports = lexer;
