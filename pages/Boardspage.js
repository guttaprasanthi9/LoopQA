const { expect } = require('@playwright/test');
module.exports = { BoardPage };
const ALL_COLUMNS = ['To Do', 'In Progress', 'Done'];

class BoardPage {
  constructor(page) {
    this.page = page;
  }

  async openProject(name) {
    await this.page.getByText(name, { exact: true }).first().click();
  }

  // Matches "To Do (2)", "To Do", "To Do 2"
  header(name) {
    return this.page.getByText(new RegExp(`^\\s*${name}\\s*\\(?\\d*\\)?\\s*$`));
  }

  // Outermost div with this header and no other column header = the column
  column(name) {
    const others = ALL_COLUMNS.filter((c) => c !== name).join('|');
    return this.page
      .locator('div')
      .filter({ has: this.header(name) })
      .filter({ hasNot: this.page.getByText(new RegExp(`^\\s*(${others})\\s*\\(?\\d*\\)?\\s*$`)) })
      .first();
  }

  async expectTaskInColumn(title, columnName) {
    const taskTitle = this.column(columnName).getByText(title, { exact: true });
   
    await expect(taskTitle, `"${title}" should be in "${columnName}"`).toBeVisible();
  }

  // Innermost div in the column that holds the title AND every tag = the card
  card(title, columnName, tags = []) {
    let card = this.column(columnName)
      .locator('div')
      .filter({ has: this.page.getByText(title, { exact: true }) });
    for (const tag of tags) {
      card = card.filter({ has: this.page.getByText(tag, { exact: true }) });
    }
    return card.last();
  }

  async expectTags(title, columnName, tags) {
    for (const tag of tags) {
      const card = this.card(title, columnName, [tag]);
      await expect(
        card.getByText(tag, { exact: true }),
        `tag "${tag}" on "${title}"`
      ).toBeVisible();
    }
    // all tags together in one card
    await expect(this.card(title, columnName, tags)).toBeVisible();
  }
}

