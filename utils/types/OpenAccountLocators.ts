import { type Locator } from "@playwright/test";

export type openAccountLocators = {
    userSelectDropdown: Locator,
    currencyDropdown: Locator,
    openAccountTab: Locator,
    processAccountButton: Locator,
};