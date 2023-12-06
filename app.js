document.addEventListener('DOMContentLoaded', function () {
    const expenseForm = document.getElementById('expenseForm');
    const expenseList = document.getElementById('expenseList');

    expenseForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;

        fetch('http://localhost:5500/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description, amount }),
        })
        .then(response => response.json())
        .then(data => {
            const expenseItem = document.createElement('div');
            expenseItem.className = 'expense-item';
            expenseItem.innerHTML = `<strong>${data.description}:</strong> ₹${data.amount}`;
            expenseList.appendChild(expenseItem);
        })
        .catch(error => console.error('Error:', error));

        expenseForm.reset();
    });

    fetch('http://localhost:5500/expenses')
        .then(response => response.json())
        .then(data => {
            data.forEach(expense => {
                const expenseItem = document.createElement('div');
                expenseItem.className = 'expense-item';
                expenseItem.innerHTML = `<strong>${expense.description}:</strong> ₹${expense.amount}`;
                expenseList.appendChild(expenseItem);
            });
        })
        .catch(error => console.error('Error:', error));
});
