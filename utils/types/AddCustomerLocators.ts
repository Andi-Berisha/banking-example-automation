import { type Locator } from "@playwright/test";

export type AddCustomerLocators = {
    addCustomerTab: Locator,
    firstNameField: Locator,
    lastNameField: Locator,
    postCodeField: Locator,
    addCustomerButton: Locator,
};