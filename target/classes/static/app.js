// Base URL for API requests - update with your actual API endpoint
const API_BASE_URL = '/bank-api'; // Include the context path for all API requests

// DOM Elements
// Tab navigation
const customersTab = document.getElementById('customersTab');
const accountsTab = document.getElementById('accountsTab');
const transferTab = document.getElementById('transferTab');
const sections = document.querySelectorAll('.section');

// Customer section
const customersTable = document.getElementById('customersTable').querySelector('tbody');
const addCustomerBtn = document.getElementById('addCustomerBtn');
const customerSearchInput = document.getElementById('customerSearchInput');
const customerSearchBtn = document.getElementById('customerSearchBtn');

// Account section
const accountSearchInput = document.getElementById('accountSearchInput');
const accountSearchBtn = document.getElementById('accountSearchBtn');
const accountDetails = document.getElementById('accountDetails');
const transactionsTable = document.getElementById('transactionsTable').querySelector('tbody');
const addAccountBtn = document.getElementById('addAccountBtn');
const customerForAccountInput = document.getElementById('customerForAccountInput');

// Transfer section
const customerNumberInput = document.getElementById('customerNumber');
const fromAccountInput = document.getElementById('fromAccount');
const toAccountInput = document.getElementById('toAccount');
const amountInput = document.getElementById('amount');
const transferBtn = document.getElementById('transferBtn');

// Modals
const customerModal = document.getElementById('customerModal');
const accountModal = document.getElementById('accountModal');
const customerForm = document.getElementById('customerForm');
const accountForm = document.getElementById('accountForm');
const closeModalButtons = document.querySelectorAll('.close-modal');

// Notification
const notification = document.getElementById('notification');

// Global state
let currentCustomer = null;
let editMode = false;
let customerToEditId = null;

// Utility function to generate random numbers (for demo purposes)
function generateRandomNumber() {
    return Math.floor(100000 + Math.random() * 900000);
}

// Tab Navigation
customersTab.addEventListener('click', () => switchTab('customers'));
accountsTab.addEventListener('click', () => switchTab('accounts'));
transferTab.addEventListener('click', () => switchTab('transfer'));

function switchTab(tabId) {
    // Update nav links
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
    });
    document.getElementById(`${tabId}Tab`).classList.add('active');
    
    // Show/hide sections
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

// API functions
async function fetchAllCustomers() {
    try {
        const response = await fetch(`${API_BASE_URL}/customers/all`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const customers = await response.json();
        return customers;
    } catch (error) {
        console.error('Error fetching customers:', error);
        showNotification('Failed to fetch customers', false);
        return [];
    }
}

async function fetchCustomerById(customerNumber) {
    try {
        const response = await fetch(`${API_BASE_URL}/customers/${customerNumber}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const customer = await response.json();
        return customer;
    } catch (error) {
        console.error('Error fetching customer:', error);
        showNotification('Customer not found', false);
        return null;
    }
}

async function addCustomer(customerData) {
    try {
        const response = await fetch(`${API_BASE_URL}/customers/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customerData)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error adding customer:', error);
        showNotification('Failed to add customer', false);
        return null;
    }
}

async function updateCustomer(customerData, customerNumber) {
    try {
        const response = await fetch(`${API_BASE_URL}/customers/${customerNumber}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customerData)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating customer:', error);
        showNotification('Failed to update customer', false);
        return null;
    }
}

async function deleteCustomer(customerNumber) {
    try {
        const response = await fetch(`${API_BASE_URL}/customers/${customerNumber}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error deleting customer:', error);
        showNotification('Failed to delete customer', false);
        return null;
    }
}

async function fetchAccountDetails(accountNumber) {
    try {
        const response = await fetch(`${API_BASE_URL}/accounts/${accountNumber}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const account = await response.json();
        return account;
    } catch (error) {
        console.error('Error fetching account details:', error);
        showNotification('Account not found', false);
        return null;
    }
}

async function addAccount(accountData, customerNumber) {
    try {
        const response = await fetch(`${API_BASE_URL}/accounts/add/${customerNumber}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(accountData)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error adding account:', error);
        showNotification('Failed to add account', false);
        return null;
    }
}

async function fetchTransactions(accountNumber) {
    try {
        const response = await fetch(`${API_BASE_URL}/accounts/transactions/${accountNumber}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const transactions = await response.json();
        return transactions;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        showNotification('Failed to fetch transactions', false);
        return [];
    }
}

async function transferFunds(transferData, customerNumber) {
    try {
        const response = await fetch(`${API_BASE_URL}/accounts/transfer/${customerNumber}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transferData)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error transferring funds:', error);
        showNotification('Failed to transfer funds', false);
        return null;
    }
}

// UI Functions
function renderCustomersTable(customers) {
    customersTable.innerHTML = '';
    if (!customers || customers.length === 0) {
        customersTable.innerHTML = '<tr><td colspan="4">No customers found</td></tr>';
        return;
    }

    customers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.customerNumber}</td>
            <td>${customer.firstName} ${customer.middleName ? customer.middleName + ' ' : ''}${customer.lastName}</td>
            <td>${customer.status}</td>
            <td>
                <button class="secondary-btn edit-customer" data-id="${customer.customerNumber}">Edit</button>
                <button class="secondary-btn delete-customer" data-id="${customer.customerNumber}">Delete</button>
            </td>
        `;
        customersTable.appendChild(row);
    });

    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-customer').forEach(button => {
        button.addEventListener('click', () => editCustomer(button.dataset.id));
    });

    document.querySelectorAll('.delete-customer').forEach(button => {
        button.addEventListener('click', () => confirmDeleteCustomer(button.dataset.id));
    });
}

function displayAccountDetails(account) {
    if (!account) {
        accountDetails.innerHTML = '<p>Account not found</p>';
        transactionsTable.innerHTML = '<tr><td colspan="3">No transactions available</td></tr>';
        return;
    }

    accountDetails.innerHTML = `
        <h3>Account Details</h3>
        <div class="account-info">
            <p><strong>Account Number:</strong> ${account.accountNumber}</p>
            <p><strong>Account Type:</strong> ${account.accountType}</p>
            <p><strong>Status:</strong> ${account.accountStatus}</p>
            <p><strong>Balance:</strong> $${account.accountBalance.toFixed(2)}</p>
            <p><strong>Bank:</strong> ${account.bankInformation.bankName}</p>
            <p><strong>Branch:</strong> ${account.bankInformation.branchName}</p>
            <p><strong>Created:</strong> ${new Date(account.accountCreated).toLocaleDateString()}</p>
        </div>
    `;

    // Fetch and display transactions
    fetchTransactions(account.accountNumber).then(renderTransactionsTable);
}

function renderTransactionsTable(transactions) {
    transactionsTable.innerHTML = '';
    if (!transactions || transactions.length === 0) {
        transactionsTable.innerHTML = '<tr><td colspan="3">No transactions found</td></tr>';
        return;
    }

    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(transaction.date).toLocaleDateString()}</td>
            <td>${transaction.description}</td>
            <td>${transaction.transactionType === 'CREDIT' ? '+' : '-'}$${transaction.amount.toFixed(2)}</td>
        `;
        transactionsTable.appendChild(row);
    });
}

function showCustomerModal(isEdit = false) {
    editMode = isEdit;
    customerModal.style.display = 'block';
    document.getElementById('customerModalTitle').textContent = isEdit ? 'Edit Customer' : 'Add New Customer';
}

function showAccountModal() {
    accountModal.style.display = 'block';
}

function closeModals() {
    customerModal.style.display = 'none';
    accountModal.style.display = 'none';
    customerForm.reset();
    accountForm.reset();
    editMode = false;
    customerToEditId = null;
}

async function editCustomer(customerNumber) {
    try {
        const customer = await fetchCustomerById(customerNumber);
        if (!customer) return;

        // Fill form with customer data
        document.getElementById('firstName').value = customer.firstName || '';
        document.getElementById('lastName').value = customer.lastName || '';
        document.getElementById('middleName').value = customer.middleName || '';
        
        if (customer.customerAddress) {
            document.getElementById('street').value = customer.customerAddress.street || '';
            document.getElementById('city').value = customer.customerAddress.city || '';
            document.getElementById('state').value = customer.customerAddress.state || '';
            document.getElementById('zipCode').value = customer.customerAddress.zipCode || '';
            document.getElementById('country').value = customer.customerAddress.country || '';
        }
        
        if (customer.contactDetails) {
            document.getElementById('email').value = customer.contactDetails.email || '';
            document.getElementById('homePhone').value = customer.contactDetails.homePhone || '';
            document.getElementById('workPhone').value = customer.contactDetails.workPhone || '';
            document.getElementById('mobilePhone').value = customer.contactDetails.mobilePhone || '';
        }

        customerToEditId = customerNumber;
        showCustomerModal(true);
    } catch (error) {
        console.error('Error in edit customer:', error);
    }
}

function confirmDeleteCustomer(customerNumber) {
    if (confirm(`Are you sure you want to delete customer #${customerNumber}?`)) {
        deleteCustomer(customerNumber).then(result => {
            if (result) {
                showNotification('Customer deleted successfully', true);
                loadCustomers();
            }
        });
    }
}

function showNotification(message, success) {
    notification.textContent = message;
    notification.className = 'notification';
    notification.classList.add(success ? 'success' : 'error');
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Event Listeners
window.addEventListener('load', () => {
    loadCustomers();
});

function loadCustomers() {
    fetchAllCustomers().then(renderCustomersTable);
}

customerSearchBtn.addEventListener('click', async () => {
    const customerNumber = customerSearchInput.value.trim();
    if (!customerNumber) {
        loadCustomers();
        return;
    }
    
    const customer = await fetchCustomerById(customerNumber);
    if (customer) {
        renderCustomersTable([customer]);
    }
});

accountSearchBtn.addEventListener('click', async () => {
    const accountNumber = accountSearchInput.value.trim();
    if (!accountNumber) {
        accountDetails.innerHTML = '<p>Please enter an account number</p>';
        transactionsTable.innerHTML = '';
        return;
    }
    
    const accountResponse = await fetchAccountDetails(accountNumber);
    displayAccountDetails(accountResponse);
});

addCustomerBtn.addEventListener('click', () => {
    showCustomerModal();
});

addAccountBtn.addEventListener('click', () => {
    const customerNumber = customerForAccountInput.value.trim();
    if (!customerNumber) {
        showNotification('Please enter a customer number', false);
        return;
    }
    showAccountModal();
});

transferBtn.addEventListener('click', async () => {
    const customerNumber = customerNumberInput.value.trim();
    const fromAccount = fromAccountInput.value.trim();
    const toAccount = toAccountInput.value.trim();
    const amount = amountInput.value.trim();
    
    if (!customerNumber || !fromAccount || !toAccount || !amount) {
        showNotification('Please fill in all fields', false);
        return;
    }
    
    const transferData = {
        fromAccountNumber: parseInt(fromAccount),
        toAccountNumber: parseInt(toAccount),
        transferAmount: parseFloat(amount)
    };
    
    const result = await transferFunds(transferData, customerNumber);
    if (result) {
        showNotification('Transfer completed successfully', true);
        fromAccountInput.value = '';
        toAccountInput.value = '';
        amountInput.value = '';
    }
});

customerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const customerData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        middleName: document.getElementById('middleName').value,
        customerNumber: editMode && customerToEditId ? customerToEditId : generateRandomNumber(),
        status: 'ACTIVE',
        customerAddress: {
            street: document.getElementById('street').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zipCode: document.getElementById('zipCode').value,
            country: document.getElementById('country').value
        },
        contactDetails: {
            email: document.getElementById('email').value,
            homePhone: document.getElementById('homePhone').value,
            workPhone: document.getElementById('workPhone').value,
            mobilePhone: document.getElementById('mobilePhone').value
        }
    };
    
    let result;
    if (editMode && customerToEditId) {
        result = await updateCustomer(customerData, customerToEditId);
        if (result) {
            showNotification('Customer updated successfully', true);
        }
    } else {
        result = await addCustomer(customerData);
        if (result) {
            showNotification('Customer added successfully', true);
        }
    }
    
    if (result) {
        closeModals();
        loadCustomers();
    }
});

accountForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const customerNumber = customerForAccountInput.value.trim();
    if (!customerNumber) {
        showNotification('Please enter a customer number', false);
        return;
    }
    
    const accountData = {
        accountType: document.getElementById('accountType').value,
        accountBalance: parseFloat(document.getElementById('initialBalance').value),
        bankInformation: {
            bankName: document.getElementById('bankName').value,
            branchName: document.getElementById('branchName').value
        }
    };
    
    const result = await addAccount(accountData, customerNumber);
    if (result) {
        showNotification('Account created successfully', true);
        closeModals();
    }
});

closeModalButtons.forEach(button => {
    button.addEventListener('click', closeModals);
});

window.addEventListener('click', (e) => {
    if (e.target === customerModal) {
        closeModals();
    }
    if (e.target === accountModal) {
        closeModals();
    }
}); 