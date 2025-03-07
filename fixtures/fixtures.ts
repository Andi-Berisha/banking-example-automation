import { test as base } from "@playwright/test";
import HomePage from "../pages/homePage";
import ManagerPage from "../pages/managerPage";
import CustomerPage from "../pages/customerPage";

type CustomFixtures = {
    home: HomePage,
    manager: ManagerPage,
    customer: CustomerPage,
}

export const test = base.extend<CustomFixtures>({
    page: [
        async ({ context, baseURL }, use,) => {
            //Setup
            const page = await context.newPage();
            await page.goto(baseURL ?? '/'); // Uses baseURL which is defined in playwright.config.ts
            await page.waitForLoadState("load");
            //Use 
            await use(page);
            //Teardown
            await page.waitForLoadState("load");
        }
        , { scope: 'test' },
    ],


    home: async ({ page }, use) => {
        use(new HomePage(page));
    },

    manager: async ({ page }, use) => {
        use(new ManagerPage(page));
    },

    customer: async ({ page }, use) => {
        use(new CustomerPage(page));
    },

})

export { expect } from '@playwright/test';
