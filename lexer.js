// Analizador Léxico (Lexer)
// Convierte una cadena de entrada (código fuente) en una lista de tokens
export function lexer(input) {

  // Lista de especificaciones de tokens: [expresión regular, tipo de token]
  // Si el tipo es null, el token se ignora (espacios, comentarios, etc.)
  const tokenSpecs = [
    [/^\s+/, null],                      // Espacios en blanco (ignorar)
    [/^\/\/.*(?:\r\n|[\r\n])?/, null],   // Comentarios de una sola línea (ignorar)
    [/^\/\*[\s\S]*?\*\//, null],         // Comentarios de múltiples líneas (ignorar)
    [/^\blet\b/, 'LET'],                 // Palabra reservada "let"
    [/^\bprint\b/, 'PRINT'],             // Palabra reservada "print"
    [/^[A-Za-z_][A-Za-z0-9_]*/, 'IDENT'],// Identificadores (variables, funciones)
    [/^[0-9]+(?:\.[0-9]+)?/, 'NUMBER'],  // Números (enteros y decimales)
    [/^==/, 'EQEQ'],                     // Operador de comparación "=="
    [/^=/, 'EQ'],                        // Operador de asignación "="
    [/^\+/, 'PLUS'],                     // Operador suma "+"
    [/^-/, 'MINUS'],                     // Operador resta "-"
    [/^\*/, 'STAR'],                     // Operador multiplicación "*"
    [/^\//, 'SLASH'],                    // Operador división "/"
    [/^\(/, 'LPAREN'],                   // Paréntesis izquierdo "("
    [/^\)/, 'RPAREN'],                   // Paréntesis derecho ")"
    [/^;/, 'SEMICOLON'],                 // Punto y coma ";"
    [/^,/, 'COMMA'],                     // Coma ","
  ];

  let pos = 0;             // Posición actual en el texto
  const tokens = [];       // Lista de tokens resultantes

  // Recorre la entrada hasta consumir todo el texto
  while (pos < input.length) {
    const part = input.slice(pos); // Subcadena desde la posición actual
    let matched = false;           // Bandera para saber si se encontró un token válido

    // Probar cada patrón de token en orden
    for (const [regex, type] of tokenSpecs) {
      const m = regex.exec(part); // Verifica si el inicio de 'part' coincide con el patrón
      if (m) {
        matched = true;
        const text = m[0];        // Texto que coincide con el patrón
        if (type) {
          // Guardar solo si el token no es ignorado
          tokens.push({ type, value: text });
        }
        pos += text.length;       // Avanzar en la posición del texto
        break;                    // Salir del bucle de patrones y continuar con el siguiente token
      }
    }

    // Si ningún patrón coincide, lanzar error léxico
    if (!matched) {
      throw new Error('Lexical error near: "' + part.slice(0, 20) + '"');
    }
  }

  // Agregar token especial de fin de archivo
  tokens.push({ type: 'EOF', value: null });

  return tokens; // Devolver lista de tokens
}
