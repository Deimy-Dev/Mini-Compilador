// Convierte la lista de tokens en una cadena legible
// Ejemplo: LET(let) IDENT(x) EQ(=) NUMBER(2)
export function dumpTokens(tokens) {
  return tokens
    .map(t => 
      // Para cada token, muestra el tipo y, si tiene valor, también el valor entre paréntesis
      `${t.type}${t.value !== null ? '(' + t.value.trim() + ')' : ''}`
    )
    .join(' ');  // Une todos con espacio
}

// Convierte un objeto JS (como el AST) en una cadena JSON con formato legible
export function pretty(obj) {
  return JSON.stringify(obj, null, 2); // 2 espacios de indentación
}

// Convierte las instrucciones TAC en texto legible línea por línea
export function prettyTAC(instrs) {
  return instrs
    .map(i => {
      if (i.op === 'print') 
        return `print ${i.arg1}`;                 // print t1
      if (i.op === 'assign') 
        return `${i.result} = ${i.arg1}`;         // x = t1
      // operaciones binarias: t3 = t1 add t2
      return `${i.result} = ${i.arg1} ${i.op} ${i.arg2}`;
    })
    .join('\n');  // Salto de línea entre instrucciones
}
