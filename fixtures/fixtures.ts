import { test as base } from "@playwright/test";
import HomePage from "../pages/homePage";
import ManagerPage from "../pages/managerPage";

type CustomFixtures = {
    home: HomePage,
    manager: ManagerPage,
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
    }
})

export { expect } from '@playwright/test';
