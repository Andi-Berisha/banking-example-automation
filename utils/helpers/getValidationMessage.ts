import { Locator } from "@playwright/test";

export async function getValidationMessage(inputLocator: Locator): Promise<string> {
    return await inputLocator.evaluate((input) => (input as HTMLInputElement).validationMessage);
  }