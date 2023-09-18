import { expect, test  } from '../../fixtures/base.fixture.js';
import { allure } from 'allure-playwright';

const logo = '#logo a#logo #logo-icon';
test.describe('design test examples', () => {
    test.beforeEach(async () => {
        allure.label('suite', 'snapshot comparing examples');
    });
    test('youtube logo example', async ({ page }) => {
        allure.id('133');
        await page.goto('https://youtube.com');
        // await page.locator(logo).first().evaluate((el) => el.style.width = '80px');
        expect(await page.locator(logo).first().screenshot()).toMatchSnapshot();
    });

    test('ftm search bar', async ({ vehiclePage: base, basePath }) => {
        allure.id('134');
        await base.page.goto(`${basePath}/vehicles?page=1`);
        await base.clickAdvancedSearchButton();
        // await base.getSearchBar().evaluate((el) => el.style['font-family'] = 'Serif,sans-serif');
        expect(await base.getSearchBar().screenshot()).toMatchSnapshot();
    });
    test('import page', async ({ vehiclePage: base, basePath }) => {
        allure.id('167');
        await base.page.goto(`${basePath}/import?type=fleet-drivers`);
        await base.waitForSpinner();
        // const headers = await base.page.locator('div h1');
        // await headers.evaluateAll((elements) =>
        //     elements.map((el) => el.style['font-family'] = 'Serif,sans-serif'));
        expect(await base.page.screenshot()).toMatchSnapshot();
    });


    for (let i = 0; i < 30; i++) {
        test.only(`playwright example ${i}`, async ({ page }) => {
            await page.goto('https://the-internet.herokuapp.com/login');
            for (let i = 0; i < 100; i++) {
                await page.fill('#username', 'tomsmith');
                await page.fill('#password', 'SuperSecretPassword!');
                await page.locator('#username').clear();
                await page.locator('#password').clear();
            }
        });
    }
});
