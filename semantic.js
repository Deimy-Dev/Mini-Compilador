// Analizador semántico: revisa el AST para validar reglas como
// - Variables declaradas antes de usarse
// - No declarar dos veces la misma variable
// - No asignar a variables inexistentes
export function semanticAnalyzer(ast) {
  const symbols = new Map();  // Tabla de símbolos: guarda variables declaradas
  const errors = [];          // Lista de errores semánticos

  // Visita recursivamente cada nodo del AST
  function visit(node) {
    switch (node.type) {

      // Nodo raíz: recorrer todas las sentencias
      case 'Program':
        node.body.forEach(visit);
        break;

      // Declaración de variable: let x = expr;
      case 'VarDecl':
        if (symbols.has(node.id)) {
          errors.push(`Variable "${node.id}" already declared`);
        } else {
          symbols.set(node.id, { declared: true });
        }
        visit(node.expr); // Verificar la expresión asignada
        break;

      // Asignación: x = expr;
      case 'Assign':
        if (!symbols.has(node.id)) {
          errors.push(`Assignment to undeclared variable "${node.id}"`);
        }
        visit(node.expr); // Verificar la expresión de la derecha
        break;

      // print(expr);
      case 'Print':
        visit(node.expr);
        break;

      // Expresiones binarias: izquierda y derecha
      case 'Binary':
        visit(node.left);
        visit(node.right);
        break;

      // Literales numéricos: no hay nada que verificar
      case 'NumberLiteral':
        break;

      // Identificador: verificar que esté declarado
      case 'Identifier':
        if (!symbols.has(node.name)) {
          errors.push(`Use of undeclared variable "${node.name}"`);
        }
        break;

      // Si aparece un tipo de nodo no reconocido, error
      default:
        throw new Error('Unknown node in semantic: ' + node.type);
    }
  }

  // Inicia el recorrido desde la raíz del AST
  visit(ast);

  // Devuelve lista de variables y errores detectados
  return {
    symbols: Array.from(symbols.keys()), // Convertir Map a array de nombres
    errors
  };
}
