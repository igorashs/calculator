'use strict';
const buttonsContainer = document.querySelector('.buttons-container');
const resultInputText = document.querySelector('.result-text');
const operationInputText = document.querySelector('.operation-text');

let currentOperand = '';
let currentOperation = '';

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

function insertDigit(digit) {}

function insertOperator(oper) {}

function clearAll() {}

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
  const multiplyReg = /\-?\d+(\.\d+)?\*\-?\d+(\.\d+)?/;
  const divisionReg = /\-?\d+(\.\d+)?\/\-?\d+(\.\d+)?/;
  const addReg = /\-?\d+(\.\d+)?\+\d+(\.\d+)?/;
  const subtractReg = /\-?\d+(\.\d+)?\-\d+(\.\d+)?/;

  const operationsRegs = [multiplyReg, divisionReg, addReg, subtractReg];

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

  console.log(expression);
}

evaluate('1/-2*2/1*-2');
//   1/-2*2/1*-2+1/1*-1+4*10/-2+4/1+25/-5*2.5/5*-4
//something wrong with with *
//1/-4/1*-2+1/1*-1+4*10/-2+4/1+25/-5*2.5/5*-4
//1/-4/-2+1/1*-1+4*10/-2+4/1+25/-5*2.5/5*-4"
//1/-4/-2+1/-1+4*10/-2+4/1+25/-5*2.5/5*-4
//1/-4/-2+1/-1+40/-2+4/1+25/-5*2.5/5*-4
//1/-4/-2+1/-1+40/-2+4/1+25/-12.5/5*-4
//1/-4/-2+1/-1+40/-2+4/1+25/-12.5/-20

//-0.25/-2+1/-1+40/-2+4/1+25/-12.5/-20
