

const itemsBody = document.getElementById('items-body');
const addItemBtn = document.getElementById('add-item');
const subtotalEl = document.getElementById('subtotal');
const totalDiscountEl = document.getElementById('total-discount');
const taxRateEl = document.getElementById('tax-rate');
const taxAmountEl = document.getElementById('tax-amount');
const grandTotalEl = document.getElementById('grand-total');
const resetBtn = document.getElementById('reset');
const printBtn = document.getElementById('print');


function formatMoney(n) {
    return parseFloat(n).toFixed(2);
}

function validateNumber(input) {
    const value = parseFloat(input.value);
    if (isNaN(value) || value < 0) {
        input.value = '';
        return false;
    }
    return true;
}

function calculateRow(row) {
    const qtyInput = row.querySelector('.qty');
    const priceInput = row.querySelector('.price');
    const discInput = row.querySelector('.discount');
    const totalCell = row.querySelector('.row-total');

    if (!validateNumber(qtyInput) || !validateNumber(priceInput) || (discInput.value && !validateNumber(discInput))) {
        totalCell.textContent = '0.00';
        return 0;
    }

    let qty = parseFloat(qtyInput.value) || 0;
    let price = parseFloat(priceInput.value) || 0;
    let discount = parseFloat(discInput.value) || 0;

    const itemTotal = qty * price;
    if (discount > itemTotal) {
        discount = itemTotal;
        discInput.value = formatMoney(discount);
    }

    const finalTotal = itemTotal - discount;
    totalCell.textContent = formatMoney(finalTotal);
    return finalTotal;
}

function updateSummary() {
    let subtotal = 0;
    let totalDiscount = 0;

    itemsBody.querySelectorAll('tr').forEach(row => {
        const qty = parseFloat(row.querySelector('.qty').value) || 0;
        const price = parseFloat(row.querySelector('.price').value) || 0;
        const disc = parseFloat(row.querySelector('.discount').value) || 0;
        const itemTotal = qty * price;
        subtotal += itemTotal;
        totalDiscount += disc;
        calculateRow(row);
    });

    subtotalEl.textContent = formatMoney(subtotal);
    totalDiscountEl.textContent = formatMoney(totalDiscount);

    const taxRate = parseFloat(taxRateEl.value) || 0;
    const taxable = subtotal - totalDiscount;
    const taxAmount = (taxRate / 100) * taxable;
    taxAmountEl.textContent = formatMoney(taxAmount);

    const grand = taxable + taxAmount;
    grandTotalEl.textContent = formatMoney(grand);
}

function createRow() {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" class="name" placeholder="Item name" required></td>
        <td><input type="number" class="qty" min="0" value="1"></td>
        <td><input type="number" class="price" min="0" step="0.01" value="0"></td>
        <td><input type="number" class="discount" min="0" step="0.01" value="0"></td>
        <td class="row-total">0.00</td>
        <td><button class="remove">✖</button></td>
    `;

    row.querySelectorAll('input').forEach(inp => {
        inp.addEventListener('input', updateSummary);
    });

    row.querySelector('.remove').addEventListener('click', () => {
        row.remove();
        updateSummary();
    });

    itemsBody.appendChild(row);
    return row;
}

addItemBtn.addEventListener('click', () => {
    createRow();
});

taxRateEl.addEventListener('input', updateSummary);
resetBtn.addEventListener('click', () => {
    
    itemsBody.innerHTML = '';
    
    taxRateEl.value = 0;
    updateSummary();
});

printBtn.addEventListener('click', () => {
    window.print();
});


createRow();
updateSummary();


function saveState() {
    const items = [];
    itemsBody.querySelectorAll('tr').forEach(row => {
        items.push({
            name: row.querySelector('.name').value,
            qty: row.querySelector('.qty').value,
            price: row.querySelector('.price').value,
            discount: row.querySelector('.discount').value
        });
    });
    const data = {
        items,
        taxRate: taxRateEl.value
    };
    localStorage.setItem('invoiceState', JSON.stringify(data));
}

function loadState() {
    const raw = localStorage.getItem('invoiceState');
    if (!raw) return;
    try {
        const data = JSON.parse(raw);
        itemsBody.innerHTML = '';
        data.items.forEach(i => {
            const r = createRow();
            r.querySelector('.name').value = i.name;
            r.querySelector('.qty').value = i.qty;
            r.querySelector('.price').value = i.price;
            r.querySelector('.discount').value = i.discount;
        });
        taxRateEl.value = data.taxRate || 0;
        updateSummary();
    } catch (e) {
        console.error('Failed to load state', e);
    }
}


setInterval(saveState, 1000);
loadState();
