document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('beverages-container');
    const addButton = document.querySelector('.add-button');
    const orderForm = document.getElementById('order-form');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalText = document.getElementById('modal-text');
    const modalClose = document.querySelector('.modal-close');
    const orderTableBody = document.getElementById('order-table-body');
    const submitOrderBtn = document.querySelector('.submit-order-btn');
    const orderTimeInput = document.getElementById('order-time');

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

    function updateRemoveButtons() {
        const removeButtons = container.querySelectorAll('.remove-button');
        removeButtons.forEach(button => {
            button.disabled = removeButtons.length === 1;
        });
    }

    function setupRemoveButton(button, beverageElement) {
        button.addEventListener('click', function () {
            beverageElement.remove();
            updateBeverageNumbers();
            updateRemoveButtons();
        });
    }

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

    addButton.addEventListener('click', function () {
        const beverageCount = container.querySelectorAll('.beverage').length + 1;
        const newBeverage = container.firstElementChild.cloneNode(true);

        newBeverage.querySelector('.beverage-count').textContent = `Напиток №${beverageCount}`;

        const milkRadios = newBeverage.querySelectorAll('[name^="milk"]');
        milkRadios.forEach(radio => {
            radio.name = `milk${beverageCount}`;
            radio.checked = radio.value === "обычное";
        });

        const optionsCheckboxes = newBeverage.querySelectorAll('[name^="options"]');
        optionsCheckboxes.forEach(checkbox => {
            checkbox.name = `options${beverageCount}`;
            checkbox.checked = false;
        });

        const removeButton = newBeverage.querySelector('.remove-button');
        setupRemoveButton(removeButton, newBeverage);

        const textarea = newBeverage.querySelector('.user-comment');
        textarea.value = '';
        setupTextareaHandler(textarea);
        newBeverage.querySelector('.user-text-display').textContent = '';

        container.appendChild(newBeverage);
        updateRemoveButtons();
    });

    orderForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const beverages = container.querySelectorAll('.beverage');
        const count = beverages.length;
        const word = getDrinkWord(count);
        const now = new Date();
        orderTimeInput.min = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        modalText.textContent = `Вы заказали ${count} ${word}`;

        orderTableBody.innerHTML = '';

        beverages.forEach(beverage => {
            const row = document.createElement('tr');

            const drinkCell = document.createElement('td');
            drinkCell.textContent = beverage.querySelector('.drink-type').value;
            row.appendChild(drinkCell);

            const milkCell = document.createElement('td');
            const selectedMilk = beverage.querySelector('[name^="milk"]:checked');
            milkCell.textContent = selectedMilk ? selectedMilk.value : '';
            row.appendChild(milkCell);

            const optionsCell = document.createElement('td');
            optionsCell.textContent = Array.from(beverage.querySelectorAll('[name^="options"]:checked'))
                .map(checkbox => checkbox.value)
                .join(', ');
            row.appendChild(optionsCell);

            const commentCell = document.createElement('td');
            commentCell.textContent = beverage.querySelector('.user-comment').value;
            row.appendChild(commentCell);

            orderTableBody.appendChild(row);
        });

        modalOverlay.style.display = 'flex';
    });

    modalClose.addEventListener('click', function () {
        modalOverlay.style.display = 'none';
        modalOverlay.style.display = 'none';
        orderTimeInput.value = '';
        orderTimeInput.classList.remove('error');
    });

    submitOrderBtn.addEventListener('click', function () {
        const selectedTime = orderTimeInput.value;
        const currentTime = new Date().toTimeString().slice(0, 5);

        if (!selectedTime || selectedTime < currentTime) {
            orderTimeInput.classList.add('error');
            alert('Мы не умеем перемещаться во времени. Выберите время позже, чем текущее');
            return;
        }

        orderTimeInput.classList.remove('error');
        modalOverlay.style.display = 'none';

        orderTimeInput.value = '';
    });


    const firstBeverage = container.querySelector('.beverage');
    const firstRemoveButton = firstBeverage.querySelector('.remove-button');
    setupRemoveButton(firstRemoveButton, firstBeverage);
    updateRemoveButtons();
});

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



