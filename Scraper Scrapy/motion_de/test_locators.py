# coding: utf8
import parsel
import requests
import json
import re
from spiders.utils import get_urls_by_filter

def get_brand(response):
    script_text = response.xpath('//script[contains(., "item_brand")]/text()').get()
    brand = json.loads('{' + re.findall(r'"item_brand": "[^,]*"', script_text)[0] + '}').get('item_brand')
    return brand


def remove_element_attributes(el):
    if not el:
        return None
    result = str(el)
    for tag in re.findall(r'<\w+(?:\s+[\w-]+(?:\s*=\s*(?:"[^"]*"|\'[^\']*\'))?)*\s*>', result):
        to_remove = ' '.join([str(x) for x in tag.split(' ')[1:]])[0:-1]
        result = result.replace(to_remove, '')
    article_tag = re.findall(r'<p><strong>Article No.:</strong>[^<]*</p>', result)[0]
    return result.replace('\n', '')\
        .replace('\t', '')\
        .replace('\r', '')\
        .replace('<meta >', '')\
        .replace('  ', '')\
        .replace('<h4>Видео о продукте</h4>', '').replace(article_tag, '')


def main():
    PRODUCT_URL = '/Odezhda/Kurtki/Kozhanye-kurtki/Richa-Toulon-2-kozhanaya-kurtka::56169.html?language=ru&currency=RUB'
    res = requests.get(PRODUCT_URL)
    response = parsel.Selector(text=res.text)
    token = response.css('#cart_quantity [name="csrf_token"]::attr(value)').getall()[0]
    art = response.css('.artnr span::text').get()
    model_name = response.css('h1[itemprop="name"]::text').get().split(',')[0]
    brand = get_brand(response)
    categories = response.css('[itemprop="itemListElement"] span::text').getall()[1:-1]
    all_images = response.css('#productImageThumbView a::attr(href)').getall()
    navigation_links = response.css('a.headerNavigation::attr("href")').getall()
    description_element = response.css('.tab-content:not(.current)').get()
    description_element = remove_element_attributes(description_element)
    purchase_price = response.css('[itemprop="price"]').attrib["content"]
    asset_id = re.findall(r'::\d*\.', PRODUCT_URL)[0].replace('::', '').replace('.', '')
    opts = response.css(f'#opt_{asset_id}_0 option::attr(value)').getall()
    if not opts:
        opts = response.css('.jq-getModelData ::attr(value)').getall()
    colors = response.css(f'#opt_{asset_id}_0 option::text').getall()
    variant_type = 'color'
    if not colors:
        colors = response.css('.jq-getModelData option::text').getall()
        variant_type = 'size' if len(response.css('.size>.jq-getModelData option').getall()) else 'color'
    all_results = [token, art, model_name, brand, categories, all_images, navigation_links, description_element, purchase_price, asset_id, opts, colors, variant_type]
    urls = get_urls_by_filter('https://www.motoin.de/Odezhda/Kurtki/Kozhanye-kurtki:::23_33_61.html?language=ru&fcat78%5B%5D=4')
    print(urls)
    for result in all_results:
        print(result)
        assert len(result) > 0

    assert art == '11056169'
    assert model_name == 'Richa Toulon 2'
    assert brand == 'Richa'
    assert categories == ['Одежда', 'Куртки', 'Кожаные куртки']
    assert '<div ><div ><h2 >' in description_element
    assert float(purchase_price)
    assert int(asset_id)
    assert 'Оранжевый' in colors
    assert len(urls) > 68
    for url in urls:
        assert 'https://' in url


if __name__ == "__main__":
    main()
