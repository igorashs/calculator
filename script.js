'use strict';
const buttonsContainer = document.querySelector('.buttons-container');
const expressionOutput = document.querySelector('.expression-text');
const evaluationOutput = document.querySelector('.evaluation-text');

const lastOperandReg = /[\*\/]\-?\d+(\.\d+)?$/;
let lastOperand = '0';
let expression = '';

function processInputValue(value) {
  if (value != undefined) {
    switch (value) {
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        {
          if ((expression + lastOperand).length >= 19) return;
          insertDigit(value);
          if (lastOperand != 0) displayPreResult(expression + lastOperand);
        }
        break;

      case '+':
      case '-':
      case '*':
      case '/':
        {
          if ((expression + lastOperand).length >= 19) return;
          insertOperator(value);
        }
        break;
      case 'ac':
        {
          clearAll();
        }
        break;
      case 'bs':
        {
          undoInput();
          if (lastOperand != 0) displayPreResult(expression + lastOperand);
        }
        break;
      case '.':
        {
          if ((expression + lastOperand).length >= 19) return;
          insertDot();
        }
        break;
      case '=':
        {
          displayResult();
        }
        break;
    }
  }
}

buttonsContainer.addEventListener('click', (e) => {
  let value = e.target.dataset.value;
  processInputValue(value);
});

window.addEventListener('keydown', (e) => {
  let value = '';
  switch (e.key) {
    case 'Backspace':
      value = 'bs';
      break;
    case 'Enter':
      value = '=';
      break;
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
    case '0':
    case '.':
    case '+':
    case '-':
    case '=':
    case '*':
    case '/':
      value = e.key;
      break;
  }
  processInputValue(value);
});

function displayPreResult(expression) {
  if (expression) {
    let preResult = evaluate(expression);
    if (preResult.length >= 19) {
      evaluationOutput.textContent = 'Not enough Memory<';
    } else {
      evaluationOutput.textContent = preResult;
    }
  }
}

function displayResult() {
  const LAST_OPERAND_REG = /(\-)?\d+(\.\d+)?$/;

  if (expression && lastOperand) {
    lastOperand = clearDot(lastOperand);
    if (/\d$/.test(expression + lastOperand)) {
      let result = evaluate(expression + lastOperand);

      if (
        result.includes('Infinity') ||
        result.includes('NaN') ||
        result.length >= 19
      ) {
        expressionOutput.textContent = 'Error.';
        evaluationOutput.textContent = 'Error.';
        expression = '';
        lastOperand = '0';
        return;
      }

      evaluationOutput.textContent = expression + lastOperand;
      expressionOutput.textContent = result;

      expression = result;

      lastOperand = expression.match(LAST_OPERAND_REG)[0];
      expression = expression.replace(LAST_OPERAND_REG, '');
    }
  }
}

function insertDigit(digit) {
  if (expression == '' && lastOperand == '0') {
    lastOperand = digit;
  } else if (lastOperand == '0') {
    lastOperand = digit;
  } else {
    lastOperand += digit;
  }

  expressionOutput.textContent = expression + lastOperand;
}

function insertOperator(oper) {
  const LAST_OPER_REG = /[\+\-\*\/]$/;
  lastOperand = clearDot(lastOperand);

  if (lastOperand == '-') return;

  if (expression == '' && oper == '-' && lastOperand == '0') {
    lastOperand = '-';
    expressionOutput.textContent = lastOperand;
    return;
  }

  if (expression == '') {
    expression = lastOperand + oper;
    expressionOutput.textContent = expression;
    lastOperand = '';
    return;
  }

  if (expression != '') {
    let lastOper = expression.match(LAST_OPER_REG)[0];
    if (
      lastOperand == '' &&
      oper == '-' &&
      (lastOper == '*' || lastOper == '/')
    ) {
      lastOperand = oper;
      expressionOutput.textContent = expression + lastOperand;
    } else if (lastOperand == '') {
      expression = expression.replace(LAST_OPER_REG, oper);
      expressionOutput.textContent = expression;
    } else if (lastOperand != '') {
      expression += lastOperand + oper;
      expressionOutput.textContent = expression;
      lastOperand = '';
    }
  }
}

function clearDot(lastOperand) {
  const DOT_ON_START_REG = /^\-?\./;
  const DOT_ON_END_REG = /\.$/;

  if (lastOperand != '') {
    if (DOT_ON_START_REG.test(lastOperand))
      lastOperand = lastOperand.replace('.', '0.');
    if (DOT_ON_END_REG.test(lastOperand))
      lastOperand = lastOperand.replace('.', '');
  }
  return lastOperand;
}

function clearAll() {
  lastOperand = '0';
  expression = '';
  expressionOutput.textContent = '0';
  evaluationOutput.textContent = '0';
}

function insertDot() {
  if (!lastOperand.includes('.')) lastOperand += '.';
  expressionOutput.textContent = expression + lastOperand;
}

function undoInput() {
  const LAST_OPERAND_REG = /(\-)?\d+(\.\d+)?$/;
  const OPER_ON_END = /[\*\/\+\-]$/;

  if (lastOperand != '') {
    lastOperand = lastOperand.replace(/.$/, '');
    if (lastOperand == '' && expression == '') lastOperand = 0;
    expressionOutput.textContent = expression + lastOperand;
  } else if (lastOperand == '' && expression != '') {
    if (OPER_ON_END.test(expression)) {
      expression = expression.replace(OPER_ON_END, '');

      lastOperand = expression.match(LAST_OPERAND_REG)[0];
      expression = expression.replace(LAST_OPERAND_REG, '');

      expressionOutput.textContent = expression + lastOperand;
    } else {
      lastOperand = expression.match(LAST_OPERAND_REG)[0];
      lastOperand = lastOperand.replace(/.$/, '');
      expression = expression.replace(LAST_OPERAND_REG, '');
      expressionOutput.textContent = expression + lastOperand;
    }
  }
}

function operate(operator, firstOperand, secondOperand) {
  switch (operator) {
    case '*':
      return firstOperand * secondOperand;
    case '/':
      return firstOperand / secondOperand;
    case '+':
      return (+firstOperand * 10 + +secondOperand * 10) / 10;
    case '-':
      return firstOperand - secondOperand;
  }
}

function evaluate(expression) {
  const multiDivReg = /\-?\d+(\.\d+)?[\*\/]\-?\d+(\.\d+)?/;
  const addSubReg = /\-?\d+(\.\d+)?[\+\-]\d+(\.\d+)?/;

  const operationsRegs = [multiDivReg, addSubReg];

  const firstOperandReg = /^\-?\d+(\.\d+)?/;
  const operatorReg = /\d[\*\/\+\-]/;
  const secondOperandReg = /([\*\/]\-)?\d+(\.\d+)?$/;

  for (let i = 0; i < operationsRegs.length; i++) {
    while (operationsRegs[i].test(expression) == true) {
      let curOperation = expression.match(operationsRegs[i])[0];

      let firstOperand = curOperation.match(firstOperandReg)[0];
      let operator = curOperation.match(operatorReg)[0].replace(/\d/, '');
      let secondOperand = curOperation
        .match(secondOperandReg)[0]
        .replace(/[\*\/]/, '');

      let result = operate(operator, firstOperand, secondOperand);

      let plus = /^\-/.test(firstOperand) && result >= 0 ? '+' : '';
      expression = expression.replace(operationsRegs[i], plus + result);

      expression = expression.replace(/\+\-/, '-');
      expression = expression.replace(/\-\-/, '-');
      expression = expression.replace(/\/\+/, '/');
      expression = expression.replace(/\*\+/, '*');
      expression = expression.replace(/^\+/, '');
    }
  }
  return expression;
}
