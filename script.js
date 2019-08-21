'use strict';
const buttonsContainer = document.querySelector('.buttons-container');
const resultInputText = document.querySelector('.result-text');
const operationInputText = document.querySelector('.operation-text');

let currentOperand = '0';

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

function insertDigit(digit) {
  if (currentOperand == '0') currentOperand = digit;
  else currentOperand += digit;

  resultInputText.textContent = currentOperation + currentOperand;
}

function insertOperator(oper) {
  let lastC = currentOperand.charAt(currentOperand.length - 1);
  let firstC = currentOperand.charAt(0);
  if (lastC == '.') currentOperand = currentOperand.replace('.', '');
  if (firstC == '.') currentOperand = '0' + currentOperand;

  if (
    (currentOperand == '0' || currentOperand == '') &&
    currentOperation != ''
  ) {
    lastC = currentOperation.charAt(currentOperation.length - 1);
    if (lastC == '+' || lastC == '-' || lastC == '*' || lastC == '/') {
      currentOperation = currentOperation.replace(/.$/, oper);
    }
  } else {
    if (currentOperand != '') currentOperation += currentOperand + oper;
    currentOperand = '0';
  }
  //if (currentOperand == '0') currentOperand = '';
  resultInputText.textContent = currentOperation;
}

function clearAll() {
  resultInputText.textContent = '0';
  operationInputText.textContent = '0';
  currentOperand = '0';
  currentOperation = '';
}

function insertDot() {
  if (!currentOperand.includes('.')) currentOperand += '.';
  resultInputText.textContent = currentOperation + currentOperand;
}

function undoInput() {
  if (currentOperation == '') {
    if (currentOperand != '0') {
      currentOperand = currentOperand.replace(/.$/, '');
      if (currentOperand == '') currentOperand = '0';
    }
    resultInputText.textContent = currentOperand;
  }

  if (currentOperation != '' && currentOperand == '') {
    currentOperation = currentOperation.replace(/.$/, ''); //remove operator
    currentOperand = currentOperation.match(/\d+(\.\d+)?$/)[0];

    currentOperation = currentOperation.replace(/\d+(\.\d+)?$/, '');
    resultInputText.textContent = currentOperation + currentOperand;
  }

  if (currentOperation != '' && currentOperand != '') {
    if (currentOperand == '0') {
      currentOperand = currentOperand.replace(/.$/, '');
    } else {
      currentOperand = currentOperand.replace(/.$/, '');
    }
    resultInputText.textContent = currentOperation + currentOperand;
    return;
  }

  console.log('current operand ' + currentOperand);
  console.log('current operation ' + currentOperation);
  console.log('result ' + resultInputText.textContent);
}
