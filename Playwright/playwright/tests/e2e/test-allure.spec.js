import { expect, test } from '../../fixtures/base.fixture';
import { allure } from 'allure-playwright';

const setMetaData = ({ id, tags = [], labels = {}, feature } = {}) => {
    allure.id(id);
    tags.forEach((tag) => allure.tag(tag));
    Object.entries(labels).forEach(([key, value]) => allure.label(key, value));
    allure.feature(feature);
};

test('some test', async ({ basePath, vehiclePage: base, page }) => {
    await setMetaData({
        id: 18,
        tags:['test_tag'],
        labels:{ 'suite': 'test_suite', 'owner': 'admin' },
        feature: 'testAllureFeature'
    });
    await test.step('go to home page', async () => {
        await page.goto('https://youtube.com');
        await base.page.goto(`${basePath}/vehicles?page=1`);
    });
    await test.step('click something', async () => {
        await base.clickNextPageButton();
    });
    await test.step('check something', async () => {
        await base.page.waitForURL(`${basePath}/vehicles?page=2`);
        await expect(base.page.url()).toEqual(`${basePath}/vehicles?page=2`);
    });
    await test.step('finish', async () => {
        await base.page.waitForTimeout(3000);
    });
});

test('manual_case', async () => {
    allure.id('67');
    allure.description('about it');
    allure.tag('test_tag');
    allure.tag('test_tag_2');
    allure.label('suite', 'test_suite');
    allure.label('owner', 'admin');

    await test.step('step 1', async () => {
        expect(1).toEqual(1);
    });

    await test.step('step 2', async () => {
        expect(1).toEqual(1);
    });

    await test.step('step 3', async () => {
        expect(1).toEqual(2);
    });
});


