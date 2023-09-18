import { expect, test  } from '../../fixtures/base.fixture.js';
import { allure } from 'allure-playwright';

test.describe('Navigation menu bar', () => {
    test.beforeEach(async ({}, workerInfo) => {
        allure.label('suite', workerInfo.project.name);
    });
    test('Check tabs', async ({ testData, basePath, basePage: base, locale }) => {
        allure.id('10');
        await base.page.goto(basePath);
        for (const [link, url] of Object.entries(testData.nav[locale])) {
            await base.clickNavLinkByLabel(link);
            await base.page.waitForURL(basePath + url);
            await expect(base.page.url()).toEqual(basePath + url);
        }
    });
});

test.describe('Vehicle', () => {
    test.beforeEach(async ({}, workerInfo) => {
        allure.label('suite', workerInfo.project.name);
    });
    test('Search a vehicle by  VIN number', async ({ vehiclePage: base, basePath, locale }) => {
        allure.id('5');
        const vin = '1C6RRENT4NN100004';
        const path = locale === 'fr-FR' ? '/vehicules?page=1' : '/vehicles?page=1';
        await base.page.goto(basePath + path);
        await base.typeInSearchField(vin);
        await base.waitForSpinner();
        const rowsNumber = await base.getListOfResultRows().count();
        for (let i = 1; i < rowsNumber; i++) {
            await expect(await base.getValueByRowIndex('VIN', i)).toHaveText(vin);
        }
    });

    test('Search a vehicle by non-existing  VIN / License plate number',
        async ({ vehiclePage: base, basePath, locale, testData }) => {
            allure.id('2');
            const vin = 'TESTRENT4NN100005';
            const path = locale === 'fr-FR' ? '/vehicules?page=1' : '/vehicles?page=1';
            await base.page.goto(basePath + path);
            await base.typeInSearchField(vin);
            await base.waitForSpinner();
            const rowsNumber = await base.getListOfResultRows().count();
            await expect(rowsNumber).toEqual(0);
            const noResultsContainer = await base.getNoResultsContainer();
            await expect(noResultsContainer).toBeVisible();
            expect (await noResultsContainer.innerText()).toEqual(testData.noResultsMessage[locale]);
        });

    test('Search a vehicle by Fleet', async ({ vehiclePage: base, basePath, locale }) => {
        allure.id('12');
        const fleetName = 'EXVE-TEST';
        const path = locale === 'fr-FR' ? '/vehicules?page=1' : '/vehicles?page=1';
        await base.page.goto(basePath + path);
        await base.clickAdvancedSearchButton();
        await expect(base.getBasicSearchButton()).toBeVisible();
        await base.typeInSearchInputByPlaceholder('Fleet', fleetName);
        await base.waitForSpinner();
        await base.clickOptionByText(fleetName);
        await base.clickThreeDotButton();
        await base.checkColumnFilterByText('Fleet');
        await base.clickThreeDotButton();
        await base.waitForSpinner();
        for(let i = 0; !await base.getDisabledNextButton().count(); i++) {
            if (i) {
                await base.clickNextPageButton();
                await base.waitForSpinner();
            }
            const rowsNumber = await base.getListOfResultRows().count();
            for (let i = 0; i < rowsNumber; i++) {
                const name = await base.getValueByRowIndex('Fleet', i);
                await expect([fleetName, 'DEFAULT FLEET']).toContain(await name.innerText());
            }
        }
    });
});
