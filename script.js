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
