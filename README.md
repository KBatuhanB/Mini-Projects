# Mini Projects - Test Suites

This repository contains a collection of **mini projects** focusing on software testing with **Playwright**, **Jest**, **Node.js**, and **MongoDB**.  
The projects are organized into two main categories: **end-to-end tests** and **unit/integration tests**.

---

## 📂 Project Structure

### PlaywrightTests/
- **hw6SocialMedia.spec.js: Tests the authentication and messaging workflow on X (Twitter). Covers login with email/username/password, accessing the DM section, starting a new conversation, and verifying that the message count increases.  
- **hw7ShoppingCart.spec.js: End-to-end shopping cart test on Trendyol. Includes navigating categories, applying price filters, adding/removing products to/from the cart, verifying product prices, shipping costs, and quantity adjustments.

### Unit&IntegrationTests/
- **hw1-islemler.js** & **hw1-islemler.test.js**: Basic operations and their unit tests.  
- **hw2-textanalayzer.js** & **hw2-textanalayzer.test.js**: Text analysis functions and related tests.  
- **hw3-library.js** & **hw3-library.test.js**: Library management functions and tests.  
- **hw4-db.js**, **hw4-main.js**, **hw4-mongodb.test.js**, **hw4-movies.js**, **hw4-review.js**: Database operations, main application logic, MongoDB integration, and related tests.  
- **hw5-cart.js** & **hw5-cart.test.js**: Shopping cart functions and tests.  

---

## 🛠️ Technologies & Tools

- **Playwright**: Used for **end-to-end (E2E) testing** of web applications.  
  → Tests are located in the `PlaywrightTests/` folder.  

- **Jest** (or similar test framework): Used for **unit and integration testing**.  
  → Tests are located in the `Unit&IntegrationTests/` folder.  

- **Node.js**: All test scripts and application files are designed to run in a Node.js environment.  

- **MongoDB**: Used in some integration tests for database-related operations.  

   git clone <repo-url>
   cd <repo-folder>
