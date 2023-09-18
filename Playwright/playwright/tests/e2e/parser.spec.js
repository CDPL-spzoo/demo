import { expect, test  } from '../../fixtures/base.fixture.js';
import fs from 'fs';
import links from '../../links.json';

let i = 0;
for (const link of links) {
    test(`qwer${link}${i}`, async ({ page }) => {
        console.log(`https://sbermarket.ru${link}`);
        await page.goto(`https://sbermarket.ru${link}`);
        const loading = await page.getByRole('heading', { name: 'Выполняется проверка вашего веб-браузера...' });
        await expect(loading).toHaveCount(0, { timeout: 30000 });
        const product_name = await page.locator('div[class*="ProductTitle_captionContainer"]').textContent();
        const root_price_el = await page.locator('[class*="product_popup_content"] [class*="Price_root"]>span:visible');
        let original_price, discount_price;
        if (await root_price_el.count() == 1) {
            original_price = await root_price_el.textContent();
            discount_price = '';
        } else if (await root_price_el.count() == 2) {
            original_price = await page.locator('[class*="product_popup_content"] [class*="Price_original"]>span:visible').textContent();
            discount_price = await page.locator('[class*="product_popup_content"] [class*="Price_discount"]>span:visible').textContent();
        } else {
            original_price = 'undefined';
            discount_price = 'undefined';
        }
        const product_properties_el = await page.locator('[class*="ProductPropertiesArea_content"]>div');
        let product_properties;
        let description;
        if (await product_properties_el.count() == 1) {
            product_properties = await product_properties_el.textContent();
            description = '';
        } else {
            product_properties = await product_properties_el.first().textContent();
            description = await product_properties_el.last().textContent();
        }
        const product_obj = {
            product_name,
            original_price: original_price.replace(' ', ''),
            discount_price: discount_price.replace(' ', ''),
            product_properties
        };
        const current_products = JSON.parse(fs.readFileSync('heinz_products.json', { encoding: 'utf-8' }));
        current_products.push(product_obj);
        fs.writeFileSync('heinz_products.json', JSON.stringify(current_products,  null, 4), { encoding: 'utf-8' });
    });
    i++;
}
