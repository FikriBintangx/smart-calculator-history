/**
 * Calculator Engine Module
 * Pure mathematical logic for Japanese physical calculator operations.
 * Handles chained expressions, operator precedence, %, √, ±, precision, and history log.
 */

// Helper to format float precision to avoid 0.1 + 0.2 = 0.30000000000000004
export function roundResult(value, decimals = 10) {
  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    return value;
  }
  const factor = Math.pow(10, decimals);
  const rounded = Math.round((value + Number.EPSILON) * factor) / factor;
  return rounded;
}

/**
 * Tokenize formula string into numbers and operators
 * e.g. "125468 + 135630 × 2 + 265 - 255410 ÷ 2 × 1.2"
 */
export function tokenizeExpression(expressionStr) {
  if (!expressionStr || typeof expressionStr !== 'string') return [];

  // Normalize symbols
  const normalized = expressionStr
    .replace(/×/g, '*')
    .replace(/÷/g, '/');

  const tokens = [];
  let currentNum = '';

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];

    if (char === ' ') continue;

    if (['+', '-', '*', '/'].includes(char)) {
      // Handle negative numbers at start or after operator
      if (char === '-' && (currentNum === '' && (tokens.length === 0 || ['+', '-', '*', '/'].includes(tokens[tokens.length - 1])))) {
        currentNum += '-';
      } else {
        if (currentNum !== '') {
          tokens.push(parseFloat(currentNum));
          currentNum = '';
        }
        tokens.push(char);
      }
    } else {
      currentNum += char;
    }
  }

  if (currentNum !== '') {
    tokens.push(parseFloat(currentNum));
  }

  return tokens;
}

/**
 * Evaluates tokens array using standard mathematical operator precedence (*, / over +, -)
 * Handles percentage calculations cleanly.
 */
export function evaluateTokens(tokens) {
  if (!tokens || tokens.length === 0) return 0;

  // Filter out dangling trailing operators
  let validTokens = [...tokens];
  while (validTokens.length > 0 && typeof validTokens[validTokens.length - 1] === 'string') {
    validTokens.pop();
  }

  if (validTokens.length === 0) return 0;
  if (validTokens.length === 1 && typeof validTokens[0] === 'number') return validTokens[0];

  // First pass: Multiplication (*), Division (/)
  const afterMultDiv = [];
  let i = 0;
  while (i < validTokens.length) {
    const token = validTokens[i];
    if (token === '*' || token === '/') {
      const prevNum = afterMultDiv.pop();
      const nextNum = validTokens[i + 1];
      if (typeof prevNum !== 'number' || typeof nextNum !== 'number') {
        return NaN;
      }
      let res;
      if (token === '*') {
        res = prevNum * nextNum;
      } else {
        if (nextNum === 0) return 'Error'; // Division by zero
        res = prevNum / nextNum;
      }
      afterMultDiv.push(roundResult(res));
      i += 2;
    } else {
      afterMultDiv.push(token);
      i++;
    }
  }

  // Second pass: Addition (+), Subtraction (-)
  let result = afterMultDiv[0];
  if (typeof result !== 'number') return 0;

  let j = 1;
  while (j < afterMultDiv.length) {
    const op = afterMultDiv[j];
    const nextVal = afterMultDiv[j + 1];
    if (typeof nextVal !== 'number') break;

    if (op === '+') {
      result += nextVal;
    } else if (op === '-') {
      result -= nextVal;
    }
    result = roundResult(result);
    j += 2;
  }

  return result;
}

/**
 * Full Expression Evaluator for Japanese Calculator
 */
export function evaluateExpression(expressionStr) {
  try {
    const tokens = tokenizeExpression(expressionStr);
    const result = evaluateTokens(tokens);
    return result;
  } catch {
    return 'Error';
  }
}

/**
 * Format number for display with Indonesian localization (dots as thousand separators if requested or standard LCD)
 */
export function formatDisplayNumber(numOrStr) {
  if (numOrStr === 'Error' || numOrStr === 'Tak Terdefinisi') return 'ERROR';
  if (numOrStr === '' || numOrStr === null || numOrStr === undefined) return '0';

  const str = String(numOrStr);
  if (str.endsWith('.')) {
    return str;
  }

  const num = Number(str);
  if (isNaN(num)) return str;

  try {
    if (str.includes('.')) {
      const [intPart, decPart] = str.split('.');
      const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return `${formattedInt},${decPart}`;
    }
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  } catch (e) {
    return str;
  }
}

/**
 * Process Calculator State Transformation on Button Press
 */
export function processButtonInput(currentState, buttonKey) {
  let {
    displayValue,      // Current number displayed on lower line
    formula,           // Full formula string e.g. "125468 + 135630 × 2"
    isNewInput,        // True if next digit should replace display
    history,           // Array of past calculations
    isError            // True if calculation resulted in error
  } = currentState;

  if (isError && buttonKey !== 'C' && buttonKey !== 'AC') {
    return currentState;
  }

  // 1. Clear (C / AC)
  if (buttonKey === 'C' || buttonKey === 'AC') {
    return {
      displayValue: '0',
      formula: '',
      isNewInput: true,
      lastOperator: null,
      history: history || [],
      isError: false
    };
  }

  // 2. Backspace (⌫)
  if (buttonKey === '⌫' || buttonKey === 'Backspace') {
    if (isNewInput || displayValue === '0' || displayValue.length <= 1) {
      return { ...currentState, displayValue: '0' };
    }
    const newValue = displayValue.slice(0, -1);
    return {
      ...currentState,
      displayValue: newValue === '' || newValue === '-' ? '0' : newValue
    };
  }

  // 3. Digits (0 - 9)
  if (/^[0-9]$/.test(buttonKey)) {
    if (isNewInput || displayValue === '0') {
      return {
        ...currentState,
        displayValue: buttonKey,
        isNewInput: false
      };
    }
    // Limit max digits length for realistic physical display (12-14 digits)
    if (displayValue.replace(/[-.]/g, '').length >= 14) {
      return currentState;
    }
    return {
      ...currentState,
      displayValue: displayValue + buttonKey
    };
  }

  // 4. Double Zero (00)
  if (buttonKey === '00') {
    if (isNewInput || displayValue === '0') {
      return {
        ...currentState,
        displayValue: '0',
        isNewInput: false
      };
    }
    if (displayValue.replace(/[-.]/g, '').length >= 13) {
      return currentState;
    }
    return {
      ...currentState,
      displayValue: displayValue + '00'
    };
  }

  // 5. Decimal Point (.)
  if (buttonKey === '.') {
    if (isNewInput) {
      return {
        ...currentState,
        displayValue: '0.',
        isNewInput: false
      };
    }
    if (!displayValue.includes('.')) {
      return {
        ...currentState,
        displayValue: displayValue + '.'
      };
    }
    return currentState;
  }

  // 6. Plus / Minus (±)
  if (buttonKey === '±') {
    if (displayValue === '0') return currentState;
    const toggled = displayValue.startsWith('-')
      ? displayValue.slice(1)
      : '-' + displayValue;
    return {
      ...currentState,
      displayValue: toggled
    };
  }

  // 7. Square Root (√)
  if (buttonKey === '√') {
    const val = parseFloat(displayValue);
    if (isNaN(val) || val < 0) {
      return {
        ...currentState,
        displayValue: 'Error',
        isError: true
      };
    }
    const sqResult = roundResult(Math.sqrt(val));
    return {
      ...currentState,
      displayValue: String(sqResult),
      isNewInput: true
    };
  }

  // 8. Percentage (%)
  if (buttonKey === '%') {
    const currentNum = parseFloat(displayValue);
    if (isNaN(currentNum)) return currentState;

    let percentVal;
    // Check if there is an active operation in formula, e.g. "100 +"
    const parts = formula.trim().split(' ');
    if (parts.length >= 2) {
      const prevNum = parseFloat(parts[0]);
      const op = parts[1];
      if ((op === '+' || op === '-') && !isNaN(prevNum)) {
        // e.g. 100 + 10% = 10
        percentVal = roundResult((prevNum * currentNum) / 100);
      } else {
        percentVal = roundResult(currentNum / 100);
      }
    } else {
      percentVal = roundResult(currentNum / 100);
    }

    return {
      ...currentState,
      displayValue: String(percentVal),
      isNewInput: true
    };
  }

  // 9. Binary Operators (+, -, ×, ÷)
  if (['+', '-', '×', '÷'].includes(buttonKey)) {
    let newFormula;
    if (formula === '' || isNewInput) {
      if (formula !== '' && isNewInput) {
        // Replace last operator
        const trimmed = formula.trim();
        const lastSpace = trimmed.lastIndexOf(' ');
        if (lastSpace > -1 && ['+', '-', '×', '÷'].includes(trimmed.slice(lastSpace + 1))) {
          newFormula = trimmed.slice(0, lastSpace + 1) + buttonKey + ' ';
        } else {
          newFormula = `${displayValue} ${buttonKey} `;
        }
      } else {
        newFormula = `${displayValue} ${buttonKey} `;
      }
    } else {
      newFormula = `${formula}${displayValue} ${buttonKey} `;
    }

    return {
      ...currentState,
      formula: newFormula,
      lastOperator: buttonKey,
      isNewInput: true
    };
  }

  // 10. Equals (=)
  if (buttonKey === '=') {
    if (formula === '') return currentState;

    let fullExpression = formula;
    if (!isNewInput || formula.trim().endsWith('+') || formula.trim().endsWith('-') || formula.trim().endsWith('×') || formula.trim().endsWith('÷')) {
      fullExpression += displayValue;
    }

    const evalResult = evaluateExpression(fullExpression);

    if (evalResult === 'Error' || typeof evalResult !== 'number' || isNaN(evalResult)) {
      return {
        ...currentState,
        displayValue: 'Error',
        isError: true,
        isNewInput: true
      };
    }

    const rounded = roundResult(evalResult);
    const resultStr = String(rounded);

    const nowTime = new Date();
    const timeStr = `${String(nowTime.getHours()).padStart(2, '0')}:${String(nowTime.getMinutes()).padStart(2, '0')}:${String(nowTime.getSeconds()).padStart(2, '0')}`;
    const historyItem = {
      id: Date.now().toString(),
      expression: fullExpression,
      result: resultStr,
      timestamp: timeStr
    };

    const updatedHistory = [historyItem, ...(history || [])].slice(0, 50); // Keep last 50

    return {
      displayValue: resultStr,
      formula: `${fullExpression} =`,
      isNewInput: true,
      lastOperator: null,
      history: updatedHistory,
      isError: false
    };
  }

  return currentState;
}

/**
 * ------------------------------------------------------------------
 * CASCADING TAPE ENGINE LOGIC (Section 3.1 Specification)
 * ------------------------------------------------------------------
 * Handles sequential tape calculation where editing, inserting, or
 * deleting any row automatically recalculates all downstream rows.
 */

/**
 * Recalculate entire tape history array in cascading order (top to bottom)
 * @param {Array<{id: string, operator: string, value: number, note?: string}>} tapeRows
 * @returns {Array<{id: string, operator: string, value: number, result: number|string, note?: string}>}
 */
export function recalculateTape(tapeRows) {
  if (!Array.isArray(tapeRows) || tapeRows.length === 0) return [];

  let accumulated = 0;
  return tapeRows.map((row, index) => {
    const val = typeof row.value === 'number' ? row.value : parseFloat(row.value) || 0;
    const op = row.operator || '';

    if (index === 0) {
      accumulated = val;
    } else {
      if (typeof accumulated === 'number') {
        if (op === '+' || op === '') {
          accumulated = accumulated + val;
        } else if (op === '-') {
          accumulated = accumulated - val;
        } else if (op === '×' || op === '*') {
          accumulated = accumulated * val;
        } else if (op === '÷' || op === '/') {
          if (val === 0) {
            accumulated = 'Error';
          } else {
            accumulated = accumulated / val;
          }
        }
      }
    }

    const currentResult = typeof accumulated === 'number' ? roundResult(accumulated) : accumulated;

    return {
      ...row,
      value: val,
      operator: op,
      result: currentResult
    };
  });
}

/**
 * Edit a specific row in the tape and recalculate downstream
 */
export function editTapeRow(tapeRows, targetId, updatedFields) {
  const updated = tapeRows.map((row) => {
    if (row.id === targetId) {
      return { ...row, ...updatedFields };
    }
    return row;
  });
  return recalculateTape(updated);
}

/**
 * Insert a new row after specified index and recalculate downstream
 */
export function insertTapeRow(tapeRows, insertAfterIndex, newRow) {
  const rowToInsert = {
    id: `tape-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    operator: newRow.operator || '+',
    value: typeof newRow.value === 'number' ? newRow.value : parseFloat(newRow.value) || 0,
    note: newRow.note || ''
  };

  const copy = [...tapeRows];
  const insertIndex = Math.min(Math.max(insertAfterIndex + 1, 0), copy.length);
  copy.splice(insertIndex, 0, rowToInsert);

  return recalculateTape(copy);
}

/**
 * Delete a specific row by ID and recalculate downstream
 */
export function deleteTapeRow(tapeRows, targetId) {
  const filtered = tapeRows.filter((r) => r.id !== targetId);
  return recalculateTape(filtered);
}

/**
 * Export tape history rows into clean plain text for clipboard / sharing
 */
export function exportTapeToText(tapeRows, title = 'SMART CALCULATOR WITH HISTORY') {
  if (!Array.isArray(tapeRows) || tapeRows.length === 0) {
    return `=== ${title} ===\n(Belum ada riwayat pita calculations)`;
  }

  const recalculated = recalculateTape(tapeRows);
  const lines = [
    `=================================`,
    `   ${title}`,
    `=================================`
  ];

  recalculated.forEach((row, i) => {
    const opStr = row.operator ? `${row.operator} ` : '  ';
    const valStr = formatDisplayNumber(row.value);
    const resStr = formatDisplayNumber(row.result);
    const noteStr = row.note ? ` (${row.note})` : '';

    if (i === 0) {
      lines.push(`  ${valStr}${noteStr}`);
      lines.push(`  = ${resStr}`);
    } else {
      lines.push(`${opStr}${valStr}${noteStr}`);
      lines.push(`  = ${resStr}`);
    }
  });

  const lastRow = recalculated[recalculated.length - 1];
  const finalTotal = lastRow ? formatDisplayNumber(lastRow.result) : '0';

  lines.push(`---------------------------------`);
  lines.push(`TOTAL AKHIR: ${finalTotal}`);
  lines.push(`=================================`);
  const dt = new Date();
  const dtStr = `${dt.getDate()}/${dt.getMonth() + 1}/${dt.getFullYear()} ${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`;
  lines.push(`Dicetak pada: ${dtStr}`);

  return lines.join('\n');
}

