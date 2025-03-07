import { type Locator, type Page, expect } from "@playwright/test";
import { AddCustomerLocators } from "../utils/types/addCustomerLocators";
import { ViewCustomersLocators } from "../utils/types/ViewCustomerLocators";
import { openAccountLocators } from "../utils/types/OpenAccountLocators";

export default class ManagerPage {
    readonly page: Page;
    readonly addCustomerSection: AddCustomerLocators;
    readonly viewCustomersSection: ViewCustomersLocators;
    readonly openAccountSection: openAccountLocators;

    constructor(page: Page) {
        this.page = page;
        this.addCustomerSection = {
            addCustomerTab : page.getByRole('button', { name: 'Add Customer' }),
            firstNameField : page.getByRole('textbox', { name: 'First Name' }),
            lastNameField : page.getByRole('textbox', { name: 'Last Name' }),
            postCodeField : page.getByRole('textbox', { name: 'Post Code' }),
            addCustomerButton : page.locator('[name="myForm"]').getByRole('button', { name: 'Add Customer' }), //specified to differentiate between tab and button
        }

        this.viewCustomersSection = {
            customerTab : page.getByRole('button', { name: 'Customers' }),
            customerTableRows: page.locator('table tr.ng-scope'),
            searchCustomerInput:  page.getByRole('textbox', { name: 'Search Customer' }),
        }

        this.openAccountSection = {
            openAccountTab: page.getByRole('button', { name: 'Open Account' }),
            userSelectDropdown: page.locator('#userSelect'),
            currencyDropdown: page.locator('#currency'),
            processAccountButton: page.getByRole('button', { name: 'Process' }),
        }
    }

    async selectAddCustomerTab() {
        await this.addCustomerSection.addCustomerTab.click();
    }

    async enterCustomerCredentials(name?: string, lastName?: string, postCode?: string) {
        name ? await this.addCustomerSection.firstNameField.fill(name) : null;
        lastName ? await this.addCustomerSection.lastNameField.fill(lastName) : null;
        postCode ? await this.addCustomerSection.postCodeField.fill(postCode) : null;

    }

    async clickAddCustomerButton() {
        await expect(this.addCustomerSection.addCustomerButton).toBeEnabled();
        await this.addCustomerSection.addCustomerButton.click();
    }

    async selectCustomerTab() {
        await this.viewCustomersSection.customerTab.click();
    }

    async searchForCustomer(name?: string, lastName?: string, postCode?: string, accountNumber?: string) {
        const searchQuery = `${name ?? ''} ${lastName ?? ''} ${postCode ?? ''} ${accountNumber ?? ''}`.trim();
        await this.viewCustomersSection.searchCustomerInput.fill(searchQuery);
    }

    async getQueriedTableData() {
        const rows = await this.viewCustomersSection.customerTableRows.elementHandles();
        const tableData: { name: string, lastName: string, postCode: string, accountNumber: string }[] = [];

        for (const row of rows) {
            const rowValues = (await row.innerText())
                .split(/\t|\n/) 
                .map(value => value.trim());

            if (rowValues.length >= 4) {
                const [name, lastName, postCode, accountNumber] = rowValues;
                tableData.push({
                    name,
                    lastName,
                    postCode,
                    accountNumber
                });
            }
        }

        return tableData;
    }

    async selectOpenAccountTab() { 
        await this.openAccountSection.openAccountTab.click();
     }

     async selectUser(user: string) {
        await this.openAccountSection.userSelectDropdown.selectOption({ label: user }); 
     }

     async selectCurrency(currency: string) {
        await this.openAccountSection.currencyDropdown.selectOption({ label: currency });
    }

    async grabAllCurrencies() {
        await this.openAccountSection.currencyDropdown.waitFor();
        const currencies = await this.openAccountSection.currencyDropdown.locator('option').evaluateAll(options => 
        options.map(option => option.textContent?.trim()).filter(text => text && text !== '---Currency---'));
        return currencies;
    }

    async clickProcessAccount() {
        await expect(this.openAccountSection.processAccountButton).toBeEnabled();
        await this.openAccountSection.processAccountButton.click();
    }

}