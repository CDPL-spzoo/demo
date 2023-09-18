import { expect, test  } from '../../fixtures/base.fixture.js';
import { allure } from 'allure-playwright';

test.describe('Navigation menu mobile', () => {
    test.beforeEach(async ({}, workerInfo) => {
        allure.label('suite', workerInfo.project.name);
    });
    test('Check mobile tabs', async ({ testData, basePath, basePage: base, locale }) => {
        allure.id('166');
        await base.page.goto(basePath);
        for (const [link, url] of Object.entries(testData.nav[locale])) {
            await base.clickMobileMenuButton();
            await base.clickNavLinkByLabel(link);
            await base.page.waitForURL(basePath + url);
            await expect(base.page.url()).toEqual(basePath + url);
        }
    });
});
