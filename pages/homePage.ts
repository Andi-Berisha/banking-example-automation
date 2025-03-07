import { type Locator, type Page } from "@playwright/test";

export default class HomePage {
    readonly page: Page;
    readonly bankManagerLoginButton: Locator;
    readonly customerLoginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.bankManagerLoginButton = this.page.getByRole('button', { name: 'Bank Manager Login' });
        this.customerLoginButton = this.page.getByRole('button', { name: 'Customer Login' });
    }

    async loginToCustomerPortal() {
        await this.customerLoginButton.waitFor({state: 'visible'});
        await this.customerLoginButton.click();
    }

    async loginToBankMangagerPortal() {
      await this.bankManagerLoginButton.waitFor({state: 'visible'});
      await this.bankManagerLoginButton.click();
    }
}