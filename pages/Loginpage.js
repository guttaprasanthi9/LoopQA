const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async login(email, password) {
    await this.page.goto('https://create-asana-like-pr-39y5.bolt.host/');
    // ADJUST if the field attributes differ
    await this.page
      .locator('input[type="email"], input[type="text"], input[name="email"]')
      .first()
      .fill(email);
    await this.page.locator('input[type="password"]').fill(password);
    await this.page.getByRole('button', { name: /sign in|log in|login/i }).click();
    await expect(this.page.locator('input[type="password"]')).toBeHidden();
  }
}

module.exports = { LoginPage };