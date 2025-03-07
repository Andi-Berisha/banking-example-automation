import { Console } from 'console';
import { expect, test } from '../fixtures/fixtures.ts';
import { getValidationMessage } from '../utils/helpers/getValidationMessage.ts';
import { depositValidationMessage } from '../data/depositFieldValidation.ts';

test.describe('Jira 3: Make a deposit', () => {
  test.beforeEach(async ({ home }) => {
    await home.loginToCustomerPortal();
  });

  test('Verify succesful deposit messaging and account balance update.', async ({customer }) => {
    const depositAmount = '1000';
    await customer.selectUserAndLogin('Albus Dumbledore');
    await customer.selectDepositTab();
    await customer.enterDepositAmount(depositAmount);    
    await customer.clickDepositButton();
    const depositMessage = await customer.getDepositMessage();
    expect(depositMessage).toBe('Deposit Successful');

    const balance = await customer.getBalanceAmount();
    expect(balance).toBe(depositAmount);
  });

  test('Verify new record is added to transactions table.', async ({page, customer }) => {
    const transactionValues = {
      amount: '1000',
      transactionType: 'Credit'
  };
    await customer.selectUserAndLogin('Albus Dumbledore');
    await customer.selectDepositTab();
    await customer.enterDepositAmount(transactionValues.amount);    
    await customer.clickDepositButton();
    await page.waitForTimeout(5000); //would normally wait for the specific api request connected to deposit to resolve
    await customer.selectTransactionTab();
    
    const lastTransaction = await customer.getLastTransactionData();
    expect(lastTransaction).toEqual(transactionValues);

  });

  test('Verify error message when an empty deposit amount is submitted', async ({customer, browserName }) => {
    await customer.selectUserAndLogin('Albus Dumbledore');
    await customer.selectDepositTab();  
    await customer.clickDepositButton();
    const message = await getValidationMessage(customer.depositSection.amountField);

    const expectedMessage = depositValidationMessage[browserName];
    expect(message).toBe(expectedMessage);
  });
});
