'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// ACCOUNT MOVEMENTS

// to display the account movements, based on the Data of each account

const displayMovements = function (movements) {
  // to empty the container with hard data on the HTML file
  containerMovements.innerHTML = '';

  movements.forEach(function (mov, i) {
    // to set the type of account movement
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // to insert dynamic data on each row of the container
    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
      </div>
    `;

    // method to insert the new HTML in the DOM
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// CURRENT BALANCE

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// SUMMARY --> INCOMES, OUTCOMES AND INTEREST

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1) // to filter only interests that are greater than 1,00€
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

// 'Math.abs()' to take out the minus sign on the outcomes summary

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// DEFINING USER NAMES

// defining the accounts user names as the initials of each user's names
const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserNames(accounts);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// UPDATE UI

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// IMPLEMENTING LOGIN

// EVENT HANDLER

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and Welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';

    // Clear input focus
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// IMPLEMENTING TRANSFERS

// EVENT HANDLER

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );

  // Verify: positive amount | receiverAcc exists | sufficient balance | receiverAcc !== senderAcc
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.userName !== currentAccount.userName
  ) {
    // add negative movement to current user
    currentAccount.movements.push(-amount);

    // add positive movement to receiver
    receiverAcc.movements.push(amount);

    // update UI
    updateUI(currentAccount);

    // Clear input fields
    inputTransferTo.value = inputTransferAmount.value = '';
  }
});
