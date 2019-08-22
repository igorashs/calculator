'use strict';
const buttonsContainer = document.querySelector('.buttons-container');
const expressionOutput = document.querySelector('.expression-text');
const evaluationOutput = document.querySelector('.evaluation-text');

const lastOperandReg = /[\*\/]\-?\d+(\.\d+)?$/;
let lastOperand = '0';
let expression = '';

buttonsContainer.addEventListener('click', (e) => {
  let value = e.target.dataset.value;
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
          insertDigit(value);
        }
        break;

      case '+':
      case '-':
      case '*':
      case '/':
        {
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
        }
        break;
      case '.':
        {
          insertDot();
        }
        break;
      case '=':
        {
        }
        break;
    }
  }
});

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

function clearAll() {
  let lastOperand = '0';
  let expression = '';
  expressionOutput.textContent = '0';
  evaluationOutput.textContent = '0';
}

function insertDot() {}

function undoInput() {}

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
}
