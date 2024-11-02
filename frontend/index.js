import { backend } from 'declarations/backend';

let currentValue = '';
let previousValue = '';
let currentOperation = null;

const display = document.getElementById('display');
const loadingSpinner = document.getElementById('loading');

function showLoading() {
    loadingSpinner.style.display = 'block';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
}

window.appendToDisplay = (value) => {
    currentValue += value;
    display.value = currentValue;
};

window.clearDisplay = () => {
    currentValue = '';
    previousValue = '';
    currentOperation = null;
    display.value = '';
};

window.setOperation = (operation) => {
    if (currentValue !== '') {
        if (previousValue !== '') {
            calculate();
        } else {
            previousValue = currentValue;
            currentValue = '';
        }
        currentOperation = operation;
    }
};

window.calculate = async () => {
    if (previousValue !== '' && currentValue !== '' && currentOperation) {
        showLoading();
        try {
            const x = parseFloat(previousValue);
            const y = parseFloat(currentValue);
            let result;

            switch (currentOperation) {
                case '+':
                    result = await backend.add(x, y);
                    break;
                case '-':
                    result = await backend.subtract(x, y);
                    break;
                case '*':
                    result = await backend.multiply(x, y);
                    break;
                case '/':
                    const divisionResult = await backend.divide(x, y);
                    result = divisionResult[0] !== null ? divisionResult[0] : 'Error';
                    break;
            }

            display.value = result;
            previousValue = result.toString();
            currentValue = '';
            currentOperation = null;
        } catch (error) {
            console.error('Error during calculation:', error);
            display.value = 'Error';
        } finally {
            hideLoading();
        }
    }
};
