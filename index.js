document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('beverages-container');
    const addButton = document.querySelector('.add-button');
    const orderForm = document.getElementById('order-form');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalText = document.getElementById('modal-text');
    const modalClose = document.querySelector('.modal-close');

    function getDrinkWord(count) {
        const lastTwo = count % 100;
        const lastOne = count % 10;

        if (lastTwo >= 11 && lastTwo <= 19) {
            return 'напитков';
        }
        if (lastOne === 1) {
            return 'напиток';
        }
        if (lastOne >= 2 && lastOne <= 4) {
            return 'напитка';
        }
        return 'напитков';
    }

    addButton.addEventListener('click', function () {
        const beverageCount = container.querySelectorAll('.beverage').length + 1;
        const newBeverage = container.firstElementChild.cloneNode(true);

        newBeverage.querySelector('.beverage-count').textContent = `Напиток №${beverageCount}`;

        const milkRadios = newBeverage.querySelectorAll('[name^="milk"]');
        milkRadios.forEach(radio => {
            radio.name = `milk${beverageCount}`;
        });

        const optionsCheckboxes = newBeverage.querySelectorAll('[name^="options"]');
        optionsCheckboxes.forEach(checkbox => {
            checkbox.name = `options${beverageCount}`;
        });

        const removeButton = newBeverage.querySelector('.remove-button');
        removeButton.disabled = false;
        removeButton.addEventListener('click', function () {
            newBeverage.remove();
            updateBeverageNumbers();
            updateRemoveButtons();
        });

        container.appendChild(newBeverage);
        updateRemoveButtons();
    });

    function updateBeverageNumbers() {
        const beverages = container.querySelectorAll('.beverage');
        beverages.forEach((beverage, index) => {
            beverage.querySelector('.beverage-count').textContent = `Напиток №${index + 1}`;

            const milkRadios = beverage.querySelectorAll('[name^="milk"]');
            milkRadios.forEach(radio => {
                radio.name = `milk${index + 1}`;
            });

            const optionsCheckboxes = beverage.querySelectorAll('[name^="options"]');
            optionsCheckboxes.forEach(checkbox => {
                checkbox.name = `options${index + 1}`;
            });
        });
    }

    function updateRemoveButtons() {
        const removeButtons = container.querySelectorAll('.remove-button');
        removeButtons.forEach((button, index) => {
            button.disabled = removeButtons.length === 1;
        });
    }

    orderForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const count = container.querySelectorAll('.beverage').length;
        const word = getDrinkWord(count);
        modalText.textContent = `Вы заказали ${count} ${word}`;
        modalOverlay.style.display = 'flex';
    });

    modalClose.addEventListener('click', function () {
        modalOverlay.style.display = 'none';
    });

    modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) {
            modalOverlay.style.display = 'none';
        }
    });

    const firstRemoveButton = container.querySelector('.remove-button');
    firstRemoveButton.disabled = true;
});

// Функции для обработки текста
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightKeywords(text) {
    const keywords = ['срочно', 'быстрее', 'побыстрее', 'скорее', 'поскорее', 'очень нужно'];
    let escapedText = escapeHtml(text);

    keywords.forEach(keyword => {
        const regex = new RegExp(`(${escapeRegExp(keyword)})`, 'gi');
        escapedText = escapedText.replace(regex, '<b>$1</b>');
    });

    return escapedText;
}

function setupTextareaHandler(textarea) {
    const displayDiv = textarea.closest('.field').querySelector('.user-text-display');

    textarea.addEventListener('input', function () {
        displayDiv.innerHTML = highlightKeywords(this.value);
    });
}

document.querySelectorAll('.user-comment').forEach(textarea => {
    setupTextareaHandler(textarea);
});

document.querySelector('.add-button').addEventListener('click', function () {
    const beveragesContainer = document.getElementById('beverages-container');
    const lastBeverage = beveragesContainer.lastElementChild.cloneNode(true);

    const newIndex = beveragesContainer.children.length + 1;
    lastBeverage.querySelector('.beverage-count').textContent = `Напиток №${newIndex}`;

    lastBeverage.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.name = `milk${newIndex}`;
    });

    lastBeverage.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.name = `options${newIndex}`;
    });

    const textarea = lastBeverage.querySelector('.user-comment');
    textarea.value = '';
    setupTextareaHandler(textarea);

    const removeButton = lastBeverage.querySelector('.remove-button');
    removeButton.disabled = false;
    removeButton.addEventListener('click', () => lastBeverage.remove());

    beveragesContainer.appendChild(lastBeverage);
});