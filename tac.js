// Generador de Código Intermedio (Three Address Code - TAC)
// Recibe un AST y devuelve una lista de instrucciones TAC
export function generateTAC(ast) {
  let tempCount = 0;     // Contador para variables temporales
  const instrs = [];     // Lista de instrucciones TAC

  // Genera un nuevo nombre temporal único (t1, t2, t3, ...)
  function newTemp() {
    tempCount++;
    return 't' + tempCount;
  }

  // Genera TAC para expresiones recursivamente
  function genExpr(node) {
    switch (node.type) {
      case 'NumberLiteral': {
        // Para un número literal, asignamos su valor a un temporal
        const t = newTemp();
        instrs.push({ op: 'assign', arg1: node.value, arg2: null, result: t });
        return t;
      }
      case 'Identifier':
        // Para un identificador simplemente regresamos su nombre (variable)
        return node.name;
      case 'Binary': {
        // Para una expresión binaria generamos código para subexpresiones
        const L = genExpr(node.left);   // Lado izquierdo
        const R = genExpr(node.right);  // Lado derecho
        const res = newTemp();          // Temporal para resultado
        let op;
        // Mapear operadores del AST a operadores TAC
        if (node.op === 'PLUS') op = 'add';
        else if (node.op === 'MINUS') op = 'sub';
        else if (node.op === 'STAR') op = 'mul';
        else if (node.op === 'SLASH') op = 'div';
        else throw new Error('Unknown binary op ' + node.op);
        // Agregar la instrucción TAC
        instrs.push({ op, arg1: L, arg2: R, result: res });
        return res;
      }
      default:
        throw new Error('Unknown expr in TAC: ' + node.type);
    }
  }

  // Generar TAC para cada sentencia del programa
  for (const stmt of ast.body) {
    if (stmt.type === 'VarDecl') {
      // Generar código para la expresión y asignar a variable
      const temp = genExpr(stmt.expr);
      instrs.push({ op: 'assign', arg1: temp, arg2: null, result: stmt.id });
    } else if (stmt.type === 'Assign') {
      // Igual que VarDecl, pero sin declaración
      const temp = genExpr(stmt.expr);
      instrs.push({ op: 'assign', arg1: temp, arg2: null, result: stmt.id });
    } else if (stmt.type === 'Print') {
      // Generar código para la expresión y emitir print
      const temp = genExpr(stmt.expr);
      instrs.push({ op: 'print', arg1: temp, arg2: null, result: null });
    } else {
      throw new Error('Unknown statement in TAC gen: ' + stmt.type);
    }
  }

  return instrs; // Retornar la lista de instrucciones TAC
}

// Ejecuta el código intermedio TAC generado
export function runTAC(instrs) {
  const env = {};    // Ambiente de ejecución: variables y temporales con valores
  const output = []; // Array para capturar salidas de print

  // Obtiene el valor numérico de un nombre o literal
  function getVal(nameOrLiteral) {
    if (typeof nameOrLiteral === 'number') return nameOrLiteral;          // Literal numérico directo
    if (/^t[0-9]+$/.test(nameOrLiteral)) return env[nameOrLiteral];       // Temporal
    if (!isNaN(Number(nameOrLiteral))) return Number(nameOrLiteral);      // Literal numérico en string
    return env[nameOrLiteral];                                            // Variable normal
  }

  // Ejecuta cada instrucción TAC en orden
  for (const ins of instrs) {
    if (ins.op === 'assign') {
      // Asignación simple: result = arg1
      const v = getVal(ins.arg1);
      env[ins.result] = v;

    } else if (ins.op === 'add' || ins.op === 'sub' || ins.op === 'mul' || ins.op === 'div') {
      // Operaciones aritméticas binarias
      const a = getVal(ins.arg1);
      const b = getVal(ins.arg2);
      let res;
      if (ins.op === 'add') res = a + b;
      else if (ins.op === 'sub') res = a - b;
      else if (ins.op === 'mul') res = a * b;
      else if (ins.op === 'div') res = a / b;
      env[ins.result] = res;

    } else if (ins.op === 'print') {
      // Print: obtener valor y guardarlo en la salida
      const v = getVal(ins.arg1);
      output.push(v);

    } else {
      throw new Error('Unknown TAC op: ' + ins.op);
    }
  }

  // Retornar ambiente final y salida de print
  return { env, output };
}
