// Parser: convierte una lista de tokens en un Árbol de Sintaxis Abstracta (AST)
export function parser(tokens) {

  let i = 0; // Índice del token actual

  // Funciones auxiliares para manejar el flujo de tokens
  function peek() { return tokens[i]; }        // Mira el token actual sin consumirlo
  function next() { return tokens[i++]; }      // Devuelve el token actual y avanza
  function expect(type) {                      // Verifica que el siguiente token sea del tipo esperado
    const t = peek();
    if (t.type === type) return next();
    throw new Error(`Expected ${type} but found ${t.type}`);
  }

  // ----------------------
  //  Programa principal
  // ----------------------
  function parseProgram() {
    const body = [];
    // Lee declaraciones hasta llegar al final del archivo
    while (peek().type !== 'EOF') {
      body.push(parseStmt());
    }
    return { type: 'Program', body }; // Nodo raíz del AST
  }

  // ----------------------
  //  Sentencias
  // ----------------------
  function parseStmt() {
    const t = peek();
    
    // Declaración de variable: let x = expr;
    if (t.type === 'LET') {
      next(); // consume 'LET'
      const id = expect('IDENT').value; // nombre de variable
      expect('EQ');                     // símbolo "="
      const expr = parseExpr();         // expresión a asignar
      expect('SEMICOLON');               // fin de sentencia
      return { type: 'VarDecl', id, expr };
    
    // Sentencia print: print(expr);
    } else if (t.type === 'PRINT') {
      next(); // consume 'PRINT'
      expect('LPAREN');                  // "("
      const expr = parseExpr();          // expresión a imprimir
      expect('RPAREN');                  // ")"
      expect('SEMICOLON');               // ";"
      return { type: 'Print', expr };
    
    // Asignación: x = expr;
    } else if (t.type === 'IDENT') {
      const id = next().value;           // nombre de variable
      expect('EQ');                      // "="
      const expr = parseExpr();          // nueva expresión
      expect('SEMICOLON');               // ";"
      return { type: 'Assign', id, expr };

    // Si no coincide con nada conocido, error
    } else {
      throw new Error('Unknown statement start: ' + t.type);
    }
  }

  // ----------------------
  //  Expresiones
  // ----------------------
  function parseExpr() {
    let node = parseTerm(); // primer término
    // Mientras haya operadores + o -, seguir construyendo
    while (peek().type === 'PLUS' || peek().type === 'MINUS') {
      const op = next().type;
      const right = parseTerm();
      node = { type: 'Binary', op, left: node, right };
    }
    return node;
  }

  // ----------------------
  //  Términos (multiplicación/división)
  // ----------------------
  function parseTerm() {
    let node = parseFactor(); // primer factor
    while (peek().type === 'STAR' || peek().type === 'SLASH') {
      const op = next().type;
      const right = parseFactor();
      node = { type: 'Binary', op, left: node, right };
    }
    return node;
  }

  // ----------------------
  //  Factores (números, variables, paréntesis)
  // ----------------------
  function parseFactor() {
    const t = peek();

    // Números
    if (t.type === 'NUMBER') {
      next();
      return { type: 'NumberLiteral', value: Number(t.value) };

    // Identificadores
    } else if (t.type === 'IDENT') {
      next();
      return { type: 'Identifier', name: t.value };

    // Expresiones entre paréntesis
    } else if (t.type === 'LPAREN') {
      next();                     // "("
      const e = parseExpr();      // expresión interna
      expect('RPAREN');           // ")"
      return e;

    // Error si el token no es válido en un factor
    } else {
      throw new Error('Unexpected token in factor: ' + t.type);
    }
  }

  // Inicia el análisis sintáctico y devuelve el AST
  return parseProgram();
}
