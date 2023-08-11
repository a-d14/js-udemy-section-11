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

const displayMovements = function(movements, sort=false) {

  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((mov, i) => {

    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__value">${mov}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

// displayMovements(account1.movements);

const calcDisplaySummary = function(acc) {
  const income = acc.movements
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}€`;

  const out = acc.movements
  .filter(mov => mov < 0)
  .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
  .filter(mov => mov > 0)
  .map(deposit => deposit * acc.interestRate/100)
  .filter(int => int >= 1)
  .reduce((arr, cur) => arr + cur, 0);
  labelSumInterest.textContent = `${interest}€`;
}

// calcDisplaySummary(account1.movements);

const createUserNames = function(accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
    .toLowerCase()
    .split(" ")
    .map(ele => ele[0])
    .join('')
  });
}

createUserNames(accounts);
console.log(accounts);

const balance = function(acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
}

// balance(account1.movements);

const updateUI = function() {
    displayMovements(currentAccount.movements);
    balance(currentAccount);
    calcDisplaySummary(currentAccount);
}

let currentAccount;
btnLogin.addEventListener('click', function(e) {
  e.preventDefault(); // to stop page from reloading when the submit button is clicked
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  // console.log(currentAccount);
  if(currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI();
  }
});

btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  console.log(amount, receiverAcc);

  if(amount > 0 && 
    receiverAcc &&
    currentAccount.balance >= amount && 
    receiverAcc?.username !== currentAccount.username) {
      // console.log('tv');
      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);
      updateUI();
  }

  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferTo.blur();
});

btnClose.addEventListener('click', function(e) {
  e.preventDefault();
  if(inputCloseUsername.value === currentAccount.username && 
    Number(inputClosePin.value) === currentAccount.pin) {
      const index = accounts.findIndex(acc => acc.username === currentAccount.username);
      accounts.splice(index, 1);
      containerApp.style.opacity = 0;
      inputCloseUsername.value = inputClosePin.value = '';
  }

});

btnLoan.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if(amount > 0 && currentAccount.movements.some(mov => mov > 0.1 * amount)) {
    currentAccount.movements.push(amount);
    updateUI();
  }
  inputLoanAmount.blur();
});

let sorted = false;
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  sorted = !sorted;
  displayMovements(currentAccount.movements, sorted);
});

/***** CHALLENGE #1 *****/

const juliaTestOne = [3, 5, 2, 12, 7];
const kateTestOne = [4, 1, 15, 8, 3];

const juliaTestTwo = [9, 16, 6, 8, 3];
const kateTestTwo = [10, 5, 6, 1, 4];

const checkDogs = function(dogsJulia, dogsKate) {
  const dogsJuliaCopy = dogsJulia.slice();
  dogsJuliaCopy.splice(0,1);
  dogsJuliaCopy.splice(-2);

  const allDogs = dogsJuliaCopy.concat(dogsKate);
  console.log(allDogs);

  allDogs.forEach((dog, i) => {
    const str = dog >=3 ? `Dog number ${i+1} is an adult, and is ${dog} years old` : `Dog number ${i+1} is still a puppy 🐶`;
    console.log(str);
  });
}

checkDogs(juliaTestOne, kateTestOne);

/***** END OF CHALLENGE *****/

/***** CHALLENGE #2 *****/

// const calcAverageHumanAge = function(ages) {
//   const dogAgeInHuman = ages.map((ele) => {
//     if(ele <= 2) return 2*ele;
//     else return 16 + ele * 4;
//   });
  
//   const dogsBelow18 = dogAgeInHuman.filter(dogAge => dogAge >= 18);

//   const averageHumanAge = dogsBelow18.reduce((acc, cur) => acc + cur, 0)/dogsBelow18.length;

//   console.log(averageHumanAge);
// }

const calcAverageHumanAge = ages => ages
.map(ele => (ele > 2 ? 16 + ele * 4 : 2 * ele))
.filter(dogAge => dogAge >= 18)
.reduce((acc, cur, i, arr) => acc + cur/arr.length, 0);

const testCaseOne = [5, 2, 4, 1, 15, 8, 3];
const testCaseTwo = [16, 6, 10, 5, 6, 1, 4];

const avg1 = calcAverageHumanAge(testCaseOne);
const avg2 = calcAverageHumanAge(testCaseTwo);
console.log(avg1, avg2);

/***** END OF CHALLENGE *****/

/***** CHALLENGE #4 *****/

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

dogs.forEach(dog => dog.recFood = Math.trunc(dog.weight ** 0.75 * 28));
console.log(dogs);

const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(dogSarah.curFood > 1.1 * dogSarah.recFood ? "Sarah's dog is eating too much" : 
            dogSarah.curFood < 0.9 * dogSarah.recFood ? "Sarah's dog is eating too less" : "Sarah's dog is eating the right amount");

const {eatTooMuch, eatTooLittle} = dogs.reduce((obj, dog) => {
  if(dog.curFood > dog.recFood) {
    obj.eatTooMuch = obj.eatTooMuch.concat(dog.owners);
  } else if(dog.curFood < dog.recFood) {
    obj.eatTooLittle = obj.eatTooLittle.concat(dog.owners);
  }
  return obj;
}, {eatTooMuch : [], eatTooLittle : []});

console.log(eatTooMuch, eatTooLittle);

console.log(`${eatTooMuch.join(" and ")}'s dogs eat too much`);
console.log(`${eatTooLittle.join(" and ")}'s dogs eat too little`);

console.log(dogs.some(dog => (dog.curFood >= 0.9 * dog.recFood && dog.curFood <= 1.1 * dog.recFood)));

const sortedDogs = dogs.slice();
sortedDogs.sort((dog1, dog2) => {
  return dog1.recFood - dog2.recFood
});
console.log(sortedDogs);

/***** END OF CHALLENGE *****/

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// CALCULATING MAX USING REDUCE
const max = movements.reduce((acc, mov) => {
  if(acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(max);

const eurToUsd = 1.1;
const totalDepositsUsd = movements.filter(mov => mov > 0).map(mov => mov * eurToUsd).reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositsUsd);

const diceRolls = Array.from({length:100}, () => Math.floor(Math.random() * 6) + 1);
console.log(diceRolls);

labelBalance.addEventListener('click', function() {
  const movementsUI = Array.from(document.querySelectorAll('.movements__value'));
  console.log(movementsUI);
});

const sums = accounts.flatMap(acc => acc.movements).
  reduce((sum, cur) => {
    cur > 0 ? sum.deposits += cur : sum.withdrawals += cur;
    return sum;
  }, {deposits: 0, withdrawals: 0});

console.log(sums);

/////////////////////////////////////////////////
