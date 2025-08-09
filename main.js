// Importar módulos principales del compilador
import { lexer } from './lexer.js';
import { parser } from './parser.js';
import { semanticAnalyzer } from './semantic.js';
import { generateTAC, runTAC } from './tac.js';
import { dumpTokens, pretty, prettyTAC } from './utils.js';

// Obtener referencias a los elementos del DOM para mostrar resultados
const outTokens = document.getElementById('tokens');
const outAST = document.getElementById('ast');
const outSym = document.getElementById('symbols');
const outTAC = document.getElementById('tac');
const outOutput = document.getElementById('output');

// Evento click en el botón "run" para compilar y ejecutar el código
document.getElementById('run').addEventListener('click', () => {
  const src = document.getElementById('source').value; // Obtener código fuente

  // Limpiar salidas previas
  outTokens.textContent = '';
  outAST.textContent = '';
  outSym.textContent = '';
  outTAC.textContent = '';
  outOutput.textContent = '';

  try {
    // Paso 1: Analizar léxico (tokenizar)
    const tokens = lexer(src);
    outTokens.textContent = dumpTokens(tokens); // Mostrar tokens legibles

    // Paso 2: Analizar sintáctico (parsear)
    const ast = parser(tokens);
    outAST.textContent = pretty(ast); // Mostrar AST formateado

    // Paso 3: Análisis semántico
    const sem = semanticAnalyzer(ast);
    // Mostrar símbolos declarados y errores semánticos
    outSym.textContent = 'Symbols: ' + sem.symbols.join(', ') + '\nErrors:\n' +
      (sem.errors.length ? sem.errors.join('\n') : '(ninguna)');

    // Si hay errores semánticos, no continuar con generación ni ejecución
    if (sem.errors.length) {
      outOutput.textContent = 'Errores semánticos. No se genera TAC.';
      return;
    }

    // Paso 4: Generar código intermedio TAC
    const tac = generateTAC(ast);
    outTAC.textContent = prettyTAC(tac); // Mostrar instrucciones TAC legibles

    // Paso 5: Ejecutar código TAC
    const run = runTAC(tac);
    // Mostrar salida de print (resultado de ejecución)
    outOutput.textContent = run.output.map(x => String(x)).join('\n');

  } catch (e) {
    // Mostrar error de compilación o ejecución
    outAST.textContent = 'Error: ' + e.message;
  }
});

// Evento click para mostrar AST en alerta (modo debug)
document.getElementById('showAst').addEventListener('click', () => {
  try {
    const tokens = lexer(document.getElementById('source').value);
    const ast = parser(tokens);
    alert(JSON.stringify(ast, null, 2)); // Mostrar AST en ventana emergente
  } catch (e) {
    alert('Error: ' + e.message);
  }
});
