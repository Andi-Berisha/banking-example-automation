import { expect, test } from '../fixtures/fixtures.ts';
import { correctCredentials } from '../data/customerData.ts';
import { getValidationMessage } from '../utils/helpers/getValidationMessage.ts';
import { customerFieldValidationMessage } from '../data/customerFieldsValidation.ts';

test.describe('Jira 1: Create a customer', () => {
  const { name, lastName, postCode } = correctCredentials; //test customer credentials 

  test.beforeEach(async ({ home }) => {
    await home.loginToBankMangagerPortal();
  });

  test('Verify first name field is required.', async ({ manager, browserName }) => {
    await manager.selectAddCustomerTab();
    await manager.clickAddCustomerButton();
    const message = await getValidationMessage(manager.addCustomerSection.firstNameField);
    
    const expectedMessage = customerFieldValidationMessage[browserName];
    expect(message).toBe(expectedMessage);
  });

  test('Verify last name field is required.', async ({ manager, browserName }) => {
    await manager.selectAddCustomerTab();
    await manager.clickAddCustomerButton();
    await manager.enterCustomerCredentials(name);
    const message = await getValidationMessage(manager.addCustomerSection.lastNameField);
  
    const expectedMessage = customerFieldValidationMessage[browserName];
    expect(message).toBe(expectedMessage);
  });

  test('Verify postcode field is required.', async ({manager, browserName}) => {
    await manager.selectAddCustomerTab();
    await manager.clickAddCustomerButton();
    await manager.enterCustomerCredentials(name, lastName);
    const message = await getValidationMessage(manager.addCustomerSection.postCodeField);

    const expectedMessage = customerFieldValidationMessage[browserName];
    expect(message).toBe(expectedMessage);
  });

test('Verify manger can create a customer and new record is added to customer table.', async ({ page, manager }) => {
  //Create a new customer
  await manager.selectAddCustomerTab();
  await manager.enterCustomerCredentials(name, lastName, postCode);

  let dialogMessage: string = '';
  page.on('dialog', async dialog => {
    dialogMessage = dialog.message();
    await dialog.accept();
  });

  await manager.clickAddCustomerButton();
  expect(dialogMessage).toContain('Customer added successfully with customer id :6');

  //Verify the new customer is added to the table
  await manager.selectCustomerTab();
  await manager.searchForCustomer(name);
  const retrievedCustomerRecords = await manager.getQueriedTableData();
  expect(retrievedCustomerRecords).toContainEqual(correctCredentials);
});

test('Verify duplicate customer cannot be created.', async ({page, manager },testInfo) => {
  //Create a new customer
  await manager.selectAddCustomerTab();
  await manager.enterCustomerCredentials(name, lastName, postCode);
  page.on('dialog', async dialogSuccess => { await dialogSuccess.accept();});
  await manager.clickAddCustomerButton();

  await expect(manager.addCustomerSection.firstNameField).toHaveValue(''); //checks fields are cleared after dialog is accepted

  //Try to create a duplicate customer
  await manager.enterCustomerCredentials(name, lastName, postCode);
  let dialogMessage: string = '';
  page.on('dialog', async dialog => {
    dialogMessage = dialog.message();;
  });
  await manager.clickAddCustomerButton();

  expect(dialogMessage).toEqual('Please check the details. Customer may be duplicate.');
})
});

test.describe('Jira 2: Open an account', () => {
  test.beforeEach(async ({ home }) => {
    await home.loginToBankMangagerPortal();
  });

  test('Verify currencies available when opening an account.', async ({ manager }) => {
    await manager.selectOpenAccountTab();
    const currencies = await manager.grabAllCurrencies();
    expect(currencies).toEqual(['Dollar', 'Pound', 'Rupee']);
  });

  test('Verify succesful messaging upon opening an account.', async ({ page, manager }) => {
    await manager.selectOpenAccountTab();
    await manager.selectUser('Harry Potter');
    await manager.selectCurrency('Pound');

    let dialogMessage: string = '';
    page.on('dialog', async dialog => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });
    await manager.clickProcessAccount();

    expect(dialogMessage).toEqual('Account created successfully with account Number :1016');
  });

  test('Verify customer record has new account number.', async ({ page, manager }) => {
    await manager.selectOpenAccountTab();
    await manager.selectUser('Harry Potter');
    await manager.selectCurrency('Pound');

    let dialogMessage: string = '';
    page.on('dialog', async dialog => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });
    await manager.clickProcessAccount();

    const accountNumber = dialogMessage.match(/\d+/)?.[0];
 


    await manager.selectCustomerTab();
    await manager.searchForCustomer(accountNumber);
    const retrievedCustomerRecords = await manager.getQueriedTableData();
    expect(retrievedCustomerRecords).toContainEqual({ name: 'Harry', lastName: 'Potter', postCode: 'E725JB', accountNumber: `1004 1005 1006 ${accountNumber}` });  
  });
  
});
