import { type Locator } from "@playwright/test";

export type ViewCustomersLocators = {
    customerTab: Locator,
    customerTableRows: Locator,
    searchCustomerInput: Locator,
};