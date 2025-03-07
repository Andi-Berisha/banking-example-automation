## Banking Example Automation Demo

This repository contains automated tests for the a banking application using Playwright. The tests cover various customer and manager operations such as creating customers, making deposits, verifying transactions, and handling validation messages.

### Tests Overview

The tests are organized into different scenarios to ensure the functionality of the customer and manager portals:

1. **Customer Operations**:
   - **Make a Deposit**:
     - Verify successful deposit messaging and account balance update.
     - Verify a new record is added to the transactions table.
     - Verify error message when an empty deposit amount is submitted.

2. **Manager Operations**:
   - **Create a Customer**:
     - Verify first name, last name, and postcode fields are required.
     - Verify a manager can create a customer and a new record is added to the customer table.
     - Verify duplicate customers cannot be created.
   - **Open an Account**:
     - Verify available currencies when opening an account.
     - Verify successful messaging upon opening an account.
     - Verify customer record has a new account number.

### Installation

To run the tests, you need to have Node.js installed on your machine. Follow the steps below to set up the project:

1. **Clone the repository**:
   ```sh
   git clone https://github.com/your-username/natwest-automation-demo.git
   cd natwest-automation-demo
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Install Playwright browsers**:
   ```sh
   npx playwright install
   ```

### Running the Tests

To run the tests, use the following command:

```sh
npx playwright test
```

This will execute all the tests defined in the repository. You can also run specific tests or test files by providing the path to the test file:

```sh
npx playwright test tests/bankCustomerOperations.spec.ts
npx playwright test tests/bankManagerOperations.spec.ts
```
