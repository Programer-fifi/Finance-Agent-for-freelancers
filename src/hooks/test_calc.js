
const incomeList = [
  { amount: 194700, amountPKR: 194700, currency: 'PKR' }
];
const expenses = [];

const totalIncome = incomeList.reduce((acc, curr) => acc + (curr.amountPKR || curr.amount || 0), 0);
const totalExpenses = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
const walletBalance = totalIncome - totalExpenses;
const savings = walletBalance;
const isZakatDue = savings >= 120000;
const zakatAmount = isZakatDue ? savings * 0.025 : 0;

console.log('Total Income:', totalIncome);
console.log('Wallet Balance:', walletBalance);
console.log('Savings:', savings);
console.log('Is Zakat Due:', isZakatDue);
console.log('Zakat Amount:', zakatAmount);

const totalForeignIncome = incomeList
    .filter(i => i.currency !== 'PKR')
    .reduce((acc, curr) => acc + (curr.amountPKR || 0), 0);
const estimatedTax = totalForeignIncome * 0.01;
console.log('Total Foreign Income:', totalForeignIncome);
console.log('Estimated Tax:', estimatedTax);
