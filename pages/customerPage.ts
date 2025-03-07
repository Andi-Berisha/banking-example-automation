import { expect, type Locator, type Page } from "@playwright/test";
import { DepositLocators } from "../utils/types/depositLocators";
import { TransactionsLocators } from "../utils/types/TransactionsLocators";

export default class CustomerPage {
    readonly page: Page;
    readonly userSelectDropdown: Locator;
    readonly loginButton: Locator;
    readonly balanceAmountText: Locator;
 
    readonly depositSection: DepositLocators;
    readonly transactionSection: TransactionsLocators;

    constructor(page: Page) {
        this.page = page;
        this.userSelectDropdown = page.locator('#userSelect');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.balanceAmountText = page.getByText(/Balance :/).locator('strong').nth(1),

        this.depositSection = {
            depositTab: page.getByRole('button', { name: 'Deposit' }).first(),
            amountField: page.getByPlaceholder('amount'),
            depositButton: page.getByRole('button', { name: 'Deposit' }).nth(1),
            depositMessage: page.locator('span.error'),
        }

        this.transactionSection = {
            transactionTab: page.getByRole('button', { name: 'Transactions' }),
            transactionTableRows: page.locator('tr[id^="anchor"]'),
        }
    }

    async selectUserAndLogin(user: string) {
        await this.userSelectDropdown.selectOption({ label: user }); 
        await expect(this.loginButton).toBeEnabled();
        await this.loginButton.click();
    }

    async selectDepositTab() {
        await this.depositSection.depositTab.click();
    }

    async enterDepositAmount(amount: string) {
        await this.depositSection.amountField.fill(amount);
    }

    async clickDepositButton() {
        await this.depositSection.depositButton.waitFor({state: 'attached'});
        await this.depositSection.depositButton.click();
    }

    async getDepositMessage() {
        return await this.depositSection.depositMessage.textContent();
    }

    async getBalanceAmount() {      
        return await this.balanceAmountText.textContent();
    }

    async selectTransactionTab() {
        await this.transactionSection.transactionTab.click();
        await this.transactionSection.transactionTableRows.last().waitFor({state: 'visible'});
    }

    async getLastTransactionData() {
        const lastRow = this.transactionSection.transactionTableRows.last();

        const amount = await lastRow.locator('td').nth(1).innerText(); 
        const transactionType = await lastRow.locator('td').nth(2).innerText(); 
    return {
        amount: amount.trim(),
        transactionType: transactionType.trim(),
    };
    }
}