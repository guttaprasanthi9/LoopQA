const { test } = require('@playwright/test');
const data = require('../data/Task.json');
const { LoginPage } = require('../pages/Loginpage');
const { BoardPage } = require('../pages/Boardspage');

for (const tc of data.testCases) {
  test(`TC${tc.id}: "${tc.task}" is in "${tc.column}" (${tc.project}) with tags [${tc.tags.join(', ')}]`, async ({ page }) => {
    const board = new BoardPage(page);

    await new LoginPage(page).login(data.credentials.email, data.credentials.password);
    await board.openProject(tc.project);

    await board.expectTaskInColumn(tc.task, tc.column);
    await board.expectTags(tc.task, tc.column, tc.tags);
  });
}