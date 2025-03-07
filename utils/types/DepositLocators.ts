import { type Locator } from "@playwright/test";

export type DepositLocators = {
    depositTab: Locator,
    amountField: Locator,
    depositButton: Locator,
    depositMessage: Locator,
};