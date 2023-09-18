import fs from 'fs';
import { test  } from '../../fixtures/base.fixture.js';


test.describe('qwer', () => {
    // for (let i=0; i<6; i++) {
    //     test(`qwer1${i}`, async ({ page }) => {
    //         await page.goto('https://2ip.ru/');
    //         await page.getByRole('link', { name: 'Разрешаю' }).click();
    //         const ip = await page.locator('.ip span').textContent();
    //         const loc = await page.locator('#ip-info-city').textContent();
    //         console.log(ip, loc);
    //     });
    // }
    // test('motoin', async ({page}) => {
    //     await page.goto('https://www.motoin.de/Odezhda/Bryuki/Dzhinsy/John-Doe-Defender-Mono-bryuki-kargo::68024.html?language=ru')
    //     const selector = await page.locator('#opt_68024_0')
    //     const size_selector = await page.locator('#opt_68024_1')
    //     const options = await selector.locator('option').all()
    //     for (const opt of options){
    //         const value = await opt.evaluate(el => el.value)
    //         await selector.selectOption(value)
    //         const size_options = await size_selector.locator('option').all()
    //         for (const size of size_options){
    //             const size_value = await size.evaluate(el => el.value)
    //             await size_selector.selectOption(size_value)
    //         }
    //     }
    //     await page.waitForTimeout(5000)
    // })
    for (let i = 0; i < 1; i++) {
        test(`qwer${i}`, async ({ page, userAgent }) => {
            console.log(userAgent);
            await page.goto('https://sbermarket.ru/auchan/c/sousi-spetsii-maslo/ketchup');
            await page.waitForTimeout(10000);
            await page.getByRole('button', { name: 'Показать всё' }).click();
            await page.waitForTimeout(2000);
            await page.getByLabel('Heinz').click();
            await page.waitForTimeout(10000);
            const links = await page.locator('[class *= "ProductCardLink" ]').evaluateAll((els) => {
                const links = [];
                els.forEach((el) => {
                    links.push(el.getAttribute('href'));
                });
                return links;
            });
            fs.writeFileSync('links.json', JSON.stringify(links));

            // for (const link of links) {
            //     const allLinks = await link.evaluate((el) => el.getAttribute('href'));
            //     fs.writeFileSync('links.json', JSON.stringify(allLinks));
            // }
        });
    }
});
