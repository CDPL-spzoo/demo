import { expect, test  } from '../../fixtures/base.fixture.js';
import { allure } from 'allure-playwright';

test.describe('Navigation menu', () => {
    test.beforeEach(async ({}, workerInfo) => {
        allure.label('suite', workerInfo.project.name);
    });
    test('Check tabs', async ({ testData, basePath, basePage: base, locale }) => {
        allure.id('15');
        await base.page.goto(basePath);
        for (const [link, url] of Object.entries(testData.nav[locale])) {
            await base.clickNavLinkByLabel(link);
            await base.page.waitForURL(basePath + url);
            await expect(base.page.url()).toEqual(basePath + url);
        }
    });
});

test.describe('Vehicle', () => {
    test.beforeEach(async ({ basePath, locale, basePage: base }, workerInfo) => {
        const path = locale === 'fr-FR' ? '/vehicules?page=1' : '/vehicles?page=1';
        await base.page.goto(basePath + path);
        allure.label('suite', workerInfo.project.name);
    });

    test('Search a vehicle by  VIN number', async ({ vehiclePage: base }) => {
        allure.id('13');
        const vin = '1C6RRENT4NN100004';
        await base.typeInSearchField(vin);
        await base.waitForSpinner();
        const rowsNumber = await base.getListOfResultRows().count();
        for (let i = 1; i < rowsNumber; i++) {
            await expect(await base.getValueByRowIndex('VIN', i)).toHaveText(vin);
        }
    });

    test('Search a vehicle by non-existing  VIN / License plate number',
        async ({ vehiclePage: base, locale, testData }) => {
            allure.id('8');
            const vin = 'TESTRENT4NN100005';
            await base.typeInSearchField(vin);
            await base.waitForSpinner();
            const rowsNumber = await base.getListOfResultRows().count();
            await expect(rowsNumber).toEqual(0);
            const noResultsContainer = await base.getNoResultsContainer();
            await expect(noResultsContainer).toBeVisible();
            expect (await noResultsContainer.innerText()).toEqual(testData.noResultsMessage[locale]);
        });

    test('(Failed test example) Search a vehicle by non-existing  VIN ',
        async ({ vehiclePage: base, locale, testData }) => {
            allure.id('100');
            const vin = '1C6RRENT4NN100004';
            await base.typeInSearchField(vin);
            await base.waitForSpinner();
            const noResultsContainer = await base.getNoResultsContainer();
            await expect(noResultsContainer).toBeVisible();
            expect (await noResultsContainer.innerText()).toEqual(testData.noResultsMessage[locale]);
        });

    test('Search a vehicle by Fleet', async ({ vehiclePage: base }) => {
        allure.id('11');
        const fleetName = 'EXVE-TEST';
        await base.clickAdvancedSearchButton();
        await expect(base.getBasicSearchButton()).toBeVisible();
        await base.typeInSearchInputByPlaceholder('Fleet', fleetName);
        await base.waitForSpinner();
        await base.clickOptionByText(fleetName);
        await base.clickThreeDotButton();
        await base.checkColumnFilterByText('Fleet');
        await base.clickThreeDotButton();
        await base.waitForSpinner();
        await base.useForAllPages(async () => {
            const rowsNumber = await base.getListOfResultRows().count();
            for (let i = 1; i < rowsNumber; i++) {
                const name = await base.getValueByRowIndex('Fleet', i);
                await expect([fleetName, 'DEFAULT FLEET']).toContain(await name.innerText());
            }
        });
    });

    test('Search a vehicle by Company', async ({ vehiclePage: base }) => {
        allure.id('4');
        const companyName = 'HERMAN_COMPANY_INTERNAL';
        await base.clickAdvancedSearchButton();
        await expect(base.getBasicSearchButton()).toBeVisible();
        await base.typeInSearchInputByPlaceholder('Company', companyName);
        await base.waitForSpinner();
        await base.clickOptionByText(companyName);
        await base.clickThreeDotButton();
        await base.checkColumnFilterByText('Company');
        await base.clickThreeDotButton();
        await base.useForAllPages(async () => {
            const rowsNumber = await base.getListOfResultRows().count();
            for (let i = 0; i < rowsNumber; i++) {
                const name = await base.getValueByRowIndex('Company', i);
                expect(await name.innerText()).toEqual(companyName);
            }
        });
    });

    test('"Activated" filter in Status dropdown', async ({ vehiclePage: base }) => {
        allure.id('3');
        const filter = 'Status';
        const status = 'Activated';
        await base.clickAdvancedSearchButton();
        const currentFilter = await base.getFilterDropdownByPlaceholder(filter);
        expect(await currentFilter.innerText()).toEqual(`${filter}\nAll`);
        await base.clickFilterDropdownByPlaceholder(filter);
        await base.clickOptionByText('Activated');
        await base.waitForSpinner();
        await base.useForAllPages(async () => {
            for (const raw of await base.getListOfResultRows().all()) {
                const value = await base.getValueInRowByColumn(await raw, 'Status');
                expect(await value.innerText()).toEqual(status);
            }
        });
    });

    test('Selected items in Energy dropdown menu', async ({ vehiclePage: base }) => {
        allure.id('7');
        const filter = 'Energy';
        const types = ['Diesel', 'Gasoline', 'Gas'];
        await base.clickAdvancedSearchButton();
        const currentFilter = await base.getFilterDropdownByPlaceholder(filter);
        expect(await currentFilter.innerText()).toEqual(`${filter}\nAll`);
        await base.clickFilterDropdownByPlaceholder(filter);
        let backendResponse;
        base.page.route('**/connected-fleet/nimda/api/contracts*stream=true', async (route) => {
            const body = await route.fetch().then((response) => response.json());
            backendResponse = await body;
            await route.continue();
        });
        for (const type of types) {
            await base.clickOptionByText(type);
        }
        expect(await currentFilter.innerText()).toEqual(`${filter}\n${types.join(', ')}`);
        await base.useForAllPages(async () => {
            await base.waitForSpinner();
            for (const header of await base.getAllColumnResults('VIN')) {
                const vin = await header.innerText();
                const carInfo = backendResponse.find((res) => res.car.vin === vin);
                expect.soft(types.map((p) => p.toLowerCase()), `car have no fuel type: ${ carInfo.car.vin}`)
                    .toContain(carInfo.car.fuel);
            }
        });
    });

    test('Provider dropdown', async ({ vehiclePage: base }) => {
        allure.id('6');
        const filter = 'Provider';
        const provider = 'fca-ada-na';
        await base.clickAdvancedSearchButton();
        const currentFilter = await base.getFilterDropdownByPlaceholder(filter);
        expect(await currentFilter.innerText()).toEqual(`${filter}\nAll`);
        await base.clickFilterDropdownByPlaceholder(filter);
        await base.clickOptionByText(provider);
        expect(await currentFilter.innerText()).toEqual(`${filter}\n${provider}`);
        await base.useForAllPages(async () => {
            for (const raw of await base.getListOfResultRows().all()) {
                const value = await base.getValueInRowByColumn(await raw, filter);
                expect(await value.innerText()).toEqual(provider);
            }
        });
    });

    test('Pack dropdown', async ({ vehiclePage: base }) => {
        allure.id('1');
        const filter = 'Pack';
        const pack = 'pack-5';
        await base.clickAdvancedSearchButton();
        const currentFilter = await base.getFilterDropdownByPlaceholder(filter);
        expect(await currentFilter.innerText()).toEqual(`${filter}\nAll`);
        await base.clickFilterDropdownByPlaceholder(filter);
        await base.clickOptionByText(pack);
        expect(await currentFilter.innerText()).toEqual(`${filter}\n${pack}`);
        await base.clickThreeDotButton();
        await base.checkColumnFilterByText(filter);
        await base.clickThreeDotButton();
        await base.useForAllPages(async () => {
            for (const raw of await base.getListOfResultRows().all()) {
                const value = await base.getValueInRowByColumn(await raw, filter);
                expect(await value.innerText()).toEqual(pack);
            }
        });
    });

    test('Filter combinations',  async ({ vehiclePage: base }) => {
        allure.id('9');
        const filter = {
            Company: 'HERMAN_COMPANY_INTERNAL',
            Fleet: 'EXVE-TEST',
            Status: 'Cancelled',
            Provider: 'psa-datastream',
            Pack: 'pack-3'
        };
        await base.clickAdvancedSearchButton();
        for (const [filterType, value] of Object.entries(filter)) {
            if (['Company', 'Fleet'].includes(filterType)) {
                await base.typeInSearchInputByPlaceholder(filterType, value);
                await base.waitForSpinner();
                await base.clickOptionByText(value);
            } else {
                const currentFilter = await base.getFilterDropdownByPlaceholder(filterType);
                expect(await currentFilter.innerText()).toEqual(`${filterType}\nAll`);
                await base.clickFilterDropdownByPlaceholder(filterType);
                await base.clickOptionByText(value);
                expect(await currentFilter.innerText()).toEqual(`${filterType}\n${value}`);
            }
            if(['Company', 'Fleet', 'Pack'].includes(filterType)) {
                await base.clickThreeDotButton();
                await base.checkColumnFilterByText(filterType);
                await base.clickThreeDotButton();
            }
        }
        await base.useForAllPages(async () => {
            for (const raw of await base.getListOfResultRows().all()) {
                for (const [filterType, value] of Object.entries(filter)) {
                    const actualValue = await base.getValueInRowByColumn(await raw, filterType);
                    expect(await actualValue.innerText()).toEqual(value);
                }
            }
        });
    });

    test('Customize columns', async ({ vehiclePage: base }) => {
        allure.id('14');
        const defaultColumns = ['Vehicles', 'VIN', 'Status', 'License plate', 'Services', 'Provider'];
        const notCheckedColumns = ['Pack', 'Fleet', 'Company', 'Start date', 'End date'];
        const allColumns = [
            'Vehicles', 'VIN', 'Status', 'License plate',  'Pack',
            'Services', 'Company', 'Fleet', 'Start date', 'End date', 'Provider'
        ];
        await base.clickAdvancedSearchButton();
        defaultColumns.map(async (column, index) => {
            if (index) {
                await expect(base.getAllHeaders().nth(index)).toHaveText(column);
            }   else  expect(base.getAllHeaders().nth(index)).toContainText(column);
        });
        await base.clickThreeDotButton();
        for (const column of notCheckedColumns) {
            await base.checkColumnFilterByText(column);
        }
        await base.clickThreeDotButton();
        await base.waitForSpinner();
        allColumns.map(async (column, index) => {
            if (index) {
                await expect(base.getAllHeaders().nth(index)).toHaveText(column);
            }   else  expect(base.getAllHeaders().nth(index)).toContainText(column);
        });
    });
});
