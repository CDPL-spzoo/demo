import time
import parsel
import scrapy
import re
import requests
import json
import random
import logging
import csv
import sys, math
from urllib.parse import urlparse
from utils import get_urls_by_gender, get_urls_by_filter
from pathlib import Path
from transliterate import translit

logger = logging.getLogger(__name__)
logger.setLevel('DEBUG')
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)  # Устанавливаем уровень обработчика
logger.addHandler(console_handler)

LOCALE = 'ru'
current_path = Path(__file__).resolve().parent
fieldnames = [
    'Тип строки',
    'Наименование',
    'Наименование артикула',
    'Код артикула',
    'Валюта',
    'Цена',
    'Доступен для заказа',
    'Зачеркнутая цена',
    'Закупочная цена',
    'В наличии',
    'Основной артикул',
    'В наличии @шоу-рум в Москве',
    'В наличии @склад в Москве',
    'В наличии @склад поставщика',
    'ID товара',
    'Краткое описание',
    'Описание',
    'Наклейка',
    'Статус',
    'Тип товаров',
    'Теги',
    'Заголовок',
    'META Keywords',
    'META Description',
    'Ссылка на витрину',
    'Производитель',
    'Пол',
    'Наличие',
    'Категория',
    'Размер',
    'Цвет',
    'Изображения товаров',
    'Изображения товаров',
    'Изображения товаров',
    'Изображения товаров',
    'Изображения товаров',
    'Изображения товаров'
]
product_number = 0


def get_external_ip(session=False):
    if not session:
       session = requests
    try:
        response = session.get('https://api64.ipify.org?format=json')
        if response.status_code == 200:
            data = response.json()
            return data['ip']
        else:
            return "Не удалось получить IP-адрес"
    except Exception as e:
        return f"Произошла ошибка: {str(e)}"


def remove_element_attributes(el):
    if not el:
        return None
    result = str(el)
    for tag in re.findall(r'<\w+(?:\s+[\w-]+(?:\s*=\s*(?:"[^"]*"|\'[^\']*\'))?)*\s*>', result):
        to_remove = ' '.join([str(x) for x in tag.split(' ')[1:]])[0:-1]
        result = result.replace(to_remove, '')
    article_tag = re.findall(r'<p><strong>Article No.:</strong>[^<]*</p>', result)[0]
    return result.replace('\n', '') \
        .replace('\t', '') \
        .replace('\r', '') \
        .replace('<meta >', '') \
        .replace('  ', '') \
        .replace('<h4>Видео о продукте</h4>', '').replace(article_tag, '')


def get_item_ids(urls: list) -> list:
    ids = list(map(lambda x: re.findall(r'\d+', x.split('::')[1])[0], urls))
    return ids


def get_gender(link):
    sex = 'унисекс'
    link = link.replace('&currency=RUB&country=RU', '')
    with open(f'{current_path}/urls_by_sex.json', 'r', encoding='utf-8') as file:
        content = json.loads(file.read())
        if link in content.get('unisex_urls'):
            sex = 'унисекс'
        elif link in content.get('woman_urls'):
            sex = 'женский'
        elif link in content.get('man_urls'):
            sex = 'мужской'
        elif link in content.get('child_urls'):
            sex = 'детский'
        else:
            sex = None
    return sex


def get_brand(response):
    script_text = response.xpath('//script[contains(., "item_brand")]/text()').get()
    brand = json.loads('{' + re.findall(r'"item_brand": "[^,]*"', script_text)[0] + '}').get('item_brand')
    return brand


def transliterate_text(text):
    transliterated_text = translit(text, 'ru', reversed=True)
    return transliterated_text.replace(' ', '-').replace('/', '-')


def get_random_user_agent():
    return random.choice(user_agents)


def get_random_proxy():
    return random.choice(proxies)


def write_rows(csv_rows: list):
    with open(f'{current_path}/../django_admin/motoin_parser/media/parser/parsed/{csv_file_name}',
              'a', encoding='utf-8', newline='') as csvfile:
        writer_object = csv.DictWriter(csvfile, fieldnames)
        list_writer = csv.writer(csvfile)
        for row in csv_rows:
            if isinstance(row, list):
                list_writer.writerow(row)
            elif isinstance(row, dict):
                writer_object.writerow(row)
            else:
                raise TypeError(f'row should be a list or object. this instance is {type(row)}')


with open(f'{current_path}/../../user_agents.json', 'r') as agents:
    user_agents = json.load(agents)
with open(f'{current_path}/../../proxy_servers.json') as proxies:
    proxies = json.load(proxies)

all_assets = []
csv_file_name = sys.argv[1]
urls = get_urls_by_filter(sys.argv[2])
urls.sort()
# get_urls_by_gender()
with open(f'{current_path}/../django_admin/motoin_parser/media/parser/parsed/{csv_file_name}', 'w', newline='',
          encoding='utf-8') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()

print('urls count to parse = ', len(urls))

first_time = True


def parse(response, session):
    def get_csv_rows(session):
        dom = parsel.Selector(text=response.text)
        csv_rows = []
        global product_number
        path_segments = urlparse(response.url).path.split("/")[1:]
        product_in_url = path_segments[-1].split('::')[0]
        global count, all_assets, fieldnames, first_time
        if response.status_code in [500, 501, 502, 503, 504, 401, 402, 403]:
            print(response.text)
        cookie = response.request.headers.get('cookie')
        if not cookie:
            cookie = response.request.headers.get('Cookie')
        token = dom.css('#cart_quantity [name="csrf_token"]::attr(value)').getall()[0]
        link = response.url
        asset_id = re.findall(r'::\d*\.', response.url)[0].replace('::', '').replace('.', '')
        art = dom.css('.artnr span::text').get()
        model_name = dom.css('h1[itemprop="name"]::text').get().split(',')[0]
        brand = get_brand(dom)
        all_images = dom.css('#productImageThumbView a::attr(href)').getall()
        description_element = dom.css('.tab-content:not(.current)').get()
        description_element = remove_element_attributes(description_element)
        purchase_price = math.floor(float(dom.css('[itemprop="price"]').attrib["content"]))
        # generated params
        variables = sys.argv[2:]
        for i in range(len(variables)):
            if "{model_name}" in variables[i]:
                variables[i] = variables[i].replace("{model_name}", model_name)
            if "{brand}" in variables[i]:
                variables[i] = variables[i].replace("{brand}", brand)
        variables_number = len(variables)
        if variables_number == 28:
            variables = variables + ['', '', '', '', '', '', '']
        elif variables_number == 21:
            variables = variables + ['', '', '', '', '', '', '', '', '', '', '', '', '', '']
        elif variables_number < 35:
            variables = variables + [""] * (35 - variables_number)
        category_url, gender, availability, margin, delivery, category_name, product_type, name_template, badge, tags, title, meta_desc, meta_keywords, short_description, cat1_name, cat1_title, cat1_meta_keywords, cat1_meta_desc, cat1_link, cat1_id, cat1_description, cat2_name, cat2_title, cat2_meta_keywords, cat2_meta_desc, cat2_link, cat2_id, cat2_description, cat3_name, cat3_title, cat3_meta_keywords, cat3_meta_desc, cat3_link, cat3_id, cat3_description = variables
        sex = gender if gender else get_gender(link)
        try:
            float(margin)
        except:
            margin = 0
        try:
            float(delivery)
        except:
            delivery = 0
        price = math.floor(int(purchase_price) + int(purchase_price) * int(margin) / 100 + float(delivery))
        meta_description = meta_desc if meta_desc \
            else f'Купить {model_name} {cat1_name} {cat2_name}  в наличии, в москве, в россии, в магазине buykers.ru ✔ Доступная низкая цена на распродаже, аксессуары для мотоциклиста, бесплатная доставка ☎ +74953749470'
        short_description = short_description if short_description else 'Купить ' + name_template
        opts = dom.css(f'#opt_{asset_id}_0 option::attr(value)').getall()
        if not opts:
            opts = dom.css('.jq-getModelData ::attr(value)').getall()
        colors = dom.css(f'#opt_{asset_id}_0 option::text').getall()
        variant_type = 'color'
        if not colors:
            colors = dom.css('.jq-getModelData option::text').getall()
            variant_type = 'size' if len(dom.css('.size>.jq-getModelData option').getall()) else 'color'
        color_types = []
        i = 0
        img = None
        if first_time:
            csv_rows.append({"Тип строки": 'category', 'Наименование': f"{cat1_name}",
                             "ID товара": f"{cat1_id}", 'Статус': '1', 'Заголовок': cat1_title,
                             'META Keywords': cat1_meta_keywords, 'META Description': cat1_meta_desc,
                             'Ссылка на витрину': cat1_link
                             })
            if cat2_id and cat2_name:
                csv_rows.append({"Тип строки": 'category', 'Наименование': f"{cat2_name}",
                                 "ID товара": f"{cat2_id}", 'Статус': '1', 'Заголовок': cat2_title,
                                 'META Keywords': cat2_meta_keywords, 'META Description': cat2_meta_desc,
                                 'Ссылка на витрину': cat2_link
                                 })

            if cat3_id and cat3_name:
                csv_rows.append({"Тип строки": 'category', 'Наименование': f"{cat3_name}",
                                 "ID товара": f"{cat3_id}", 'Статус': '1', 'Заголовок': cat3_title,
                                 'META Keywords': cat3_meta_keywords, 'META Description': cat3_meta_desc,
                                 'Ссылка на витрину': cat3_link
                                 })
        first_time = False
        first_image = all_images[0]
        second_image = all_images[1] if len(all_images) > 1 else ''
        third_image = all_images[2] if len(all_images) > 2 else ''
        forth_image = all_images[3] if len(all_images) > 3 else ''
        fifth_image = all_images[4] if len(all_images) > 4 else ''
        sixth_image = all_images[5] if len(all_images) > 6 else ''
        first_available = False
        x = 0
        for opt in opts:
            url = 'https://www.motoin.de/ajax_responser.php'
            headers = {
                'accept-language': 'ru,en-GB;q=0.9,en;q=0.8,fr-FR;q=0.7,fr;q=0.6,ru-RU;q=0.5,en-US;q=0.4,de;q=0.3',
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'cookie': cookie,
                'origin': 'https://www.motoin.de',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                'x-requested-with': 'XMLHttpRequest'
            }
            data = {
                'part': 'prod_info',
                'changed': f'opt_{asset_id}_0',
                'csrf_token': token,
                f'opt_{asset_id}_0': opt,
                'products_id': asset_id
            }
            res = session.post(url, headers=headers, data=data, timeout=10)
            logger.debug(res.status_code)
            body = res.json()
            try:
                img = re.findall(r'https://img.motoin.de/product_images/popup_images/\S*.jpg|https://img.motoin.de/product_images/popup_images/\S*.png',
                                 body.get(f'motoin_productImage_{asset_id}'))[0]
            except:
                res = session.post(url, headers=headers, data=data, timeout=10)
                logger.debug(res.status_code)
                body = res.json()
                img = body.get(f'motoin_productImage_{asset_id}')
            sizes = body.get(f'opt_{asset_id}_1')
            color_types.append({colors[i]: {
                'Изображение': img
            }})
            if sizes:
                first_available = False
                if not img:
                    img = first_image
                row_list = ['product', name_template, '', '', 'RUB', price, '', '', purchase_price, '', '', '', '',
                            '', '', short_description, description_element, badge, '1', product_type, tags, title,
                            meta_keywords, meta_description, f'{product_in_url}-{transliterate_text(colors[i])}',
                            brand, sex, availability,
                            category_name, '<{}>', '<{}>', img, second_image, third_image, forth_image,
                            fifth_image, sixth_image]
                csv_rows.append(row_list)
                if not x:
                    product_number += 1
                x += 1
                logger.debug(f"product number = {product_number}")
                for size in sizes:
                    available = 0 if size.get('class') else 1
                    main_art = 1 if available and not first_available else ''
                    csv_rows.append({
                        'Тип строки': 'variant',
                        'Наименование': name_template,
                        'Наименование артикула': f"{size.get('text')}, {colors[i]}",
                        'Код артикула': art,
                        'Валюта': 'RUB',
                        'Цена': price,
                        'Доступен для заказа': f"{available}",
                        'Зачеркнутая цена': '0',
                        'Закупочная цена': purchase_price,
                        'В наличии': f"{available * 10}",
                        'Основной артикул': main_art,
                        'В наличии @шоу-рум в Москве': 0,
                        'В наличии @склад в Москве': 0,
                        'В наличии @склад поставщика': f"{available * 10}",
                        'Наклейка': badge,
                        'Статус': '1',
                        'Тип товаров': product_type,
                        'Ссылка на витрину': f'{product_in_url}-{transliterate_text(colors[i])}',
                        'Размер': f'<{{{size.get("text")}}}>',
                        'Цвет': f'{{{colors[i]}}}',
                        'Изображения товаров': img,
                    })
                    if available:
                        first_available = True
            else:
                if variant_type == 'size':
                    color = ''
                    size = colors[i]
                else:
                    color = colors[i]
                    size = ''
                url_postfix = f"-{transliterate_text(color)}" if len(opts) > 1 else ''
                row_list = ['product', name_template, '', '', 'RUB', price, '', '', purchase_price, '', '', '', '',
                            '', '', short_description, description_element, badge, '1', product_type, tags, title,
                            meta_keywords, meta_description, f'{product_in_url}{url_postfix}',
                            brand, sex, availability,
                            category_name, '<{}>', '<{}>', first_image, second_image, third_image, forth_image,
                            fifth_image, sixth_image]
                csv_rows.append(row_list)
                available = 0 if body.get("disable_cart_button") else 1
                main_art = 1 if available and not first_available else ''
                csv_rows.append({
                    'Тип строки': 'variant',
                    'Наименование': name_template,
                    'Наименование артикула': f"{size}{color}",
                    'Код артикула': art,
                    'Валюта': 'RUB',
                    'Цена': price,
                    'Доступен для заказа': f"{available}",
                    'Зачеркнутая цена': '0',
                    'Закупочная цена': purchase_price,
                    'В наличии': f"{available * 10}",
                    'Основной артикул': main_art,
                    'В наличии @шоу-рум в Москве': 0,
                    'В наличии @склад в Москве': 0,
                    'В наличии @склад поставщика': f"{available * 10}",
                    'Наклейка': badge,
                    'Статус': '1',
                    'Тип товаров': product_type,
                    'Ссылка на витрину': f'{product_in_url}{url_postfix}',
                    'Размер': f'<{{{size}}}>',
                    'Цвет': f'<{{{color}}}>',
                    'Изображения товаров': img,
                })
                if available:
                    first_available = True
            i += 1
        count -= 1
        logging.debug(f'{count} urls left')
        return csv_rows

    try:
        csv_rows = get_csv_rows(session)
        write_rows(csv_rows)
    except Exception as er:
        logger.debug(er)
        raise Exception(f'parse error - {er}')

class MarketSpider(scrapy.Spider):
    name = 'motoin'
    start_urls = urls
    global count
    count = len(start_urls)

    def start_requests(self):

        time.sleep(3)
        for i, url in enumerate(urls):
            yield scrapy.Request(url=url, callback=self.parse,
                                 headers={"User-Agent": user_agents[random.randint(0, len(user_agents) - 1)]},
                                 )

    def parse(self, response):

        def get_csv_rows():
            csv_rows = []
            global product_number
            path_segments = urlparse(response.url).path.split("/")[1:]
            product_in_url = path_segments[-1].split('::')[0]
            global count, all_assets, fieldnames, first_time
            if response.status in [500, 501, 502, 503, 504, 401, 402, 403]:
                print(response.body)
            cookie = response.headers.get('Set-Cookie')
            if not cookie:
                cookie = response.request.headers.get('Cookie')
            token = response.css('#cart_quantity [name="csrf_token"]::attr(value)').getall()[0]
            link = response.url
            asset_id = re.findall(r'::\d*\.', response.url)[0].replace('::', '').replace('.', '')
            art = response.css('.artnr span::text').get()
            model_name = response.css('h1[itemprop="name"]::text').get().split(',')[0]
            brand = get_brand(response)
            all_images = response.css('#productImageThumbView a::attr(href)').getall()
            description_element = response.css('.tab-content:not(.current)').get()
            description_element = remove_element_attributes(description_element)
            purchase_price = math.floor(float(response.css('[itemprop="price"]').attrib["content"]))
            # generated params
            variables = sys.argv[2:]
            for i in range(len(variables)):
                if "{model_name}" in variables[i]:
                    variables[i] = variables[i].replace("{model_name}", model_name)
                if "{brand}" in variables[i]:
                    variables[i] = variables[i].replace("{brand}", brand)
            variables_number = len(variables)
            if variables_number == 28:
                variables = variables + ['', '', '', '', '', '', '']
            elif variables_number == 21:
                variables = variables + ['', '', '', '', '', '', '', '', '', '', '', '', '', '']
            elif variables_number < 35:
                variables = variables + [""] * (35 - variables_number)
            category_url, gender, availability, margin, delivery, category_name, product_type, name_template, badge, tags, title, meta_desc, meta_keywords, short_description, cat1_name, cat1_title, cat1_meta_keywords, cat1_meta_desc, cat1_link, cat1_id, cat1_description, cat2_name, cat2_title, cat2_meta_keywords, cat2_meta_desc, cat2_link, cat2_id, cat2_description, cat3_name, cat3_title, cat3_meta_keywords, cat3_meta_desc, cat3_link, cat3_id, cat3_description = variables
            sex = gender if gender else get_gender(link)
            try:
                float(margin)
            except:
                margin = 0
            try:
                float(delivery)
            except:
                delivery = 0
            price = math.floor(int(purchase_price) + int(purchase_price) * int(margin) / 100 + float(delivery))
            meta_description = meta_desc if meta_desc \
                else f'Купить {model_name} {cat1_name} {cat2_name}  в наличии, в москве, в россии, в магазине buykers.ru ✔ Доступная низкая цена на распродаже, аксессуары для мотоциклиста, бесплатная доставка ☎ +74953749470'
            short_description = short_description if short_description else 'Купить ' + name_template
            opts = response.css(f'#opt_{asset_id}_0 option::attr(value)').getall()
            if not opts:
                opts = response.css('.jq-getModelData ::attr(value)').getall()
            colors = response.css(f'#opt_{asset_id}_0 option::text').getall()
            variant_type = 'color'
            if not colors:
                colors = response.css('.jq-getModelData option::text').getall()
                variant_type = 'size' if len(response.css('.size>.jq-getModelData option').getall()) else 'color'
            color_types = []
            i = 0
            img = None
            if first_time:
                csv_rows.append({"Тип строки": 'category', 'Наименование': f"{cat1_name}",
                                 "ID товара": f"{cat1_id}", 'Статус': '1', 'Заголовок': cat1_title,
                                 'META Keywords': cat1_meta_keywords, 'META Description': cat1_meta_desc,
                                 'Ссылка на витрину': cat1_link
                                 })
                if cat2_id and cat2_name:
                    csv_rows.append({"Тип строки": 'category', 'Наименование': f"{cat2_name}",
                                     "ID товара": f"{cat2_id}", 'Статус': '1', 'Заголовок': cat2_title,
                                     'META Keywords': cat2_meta_keywords, 'META Description': cat2_meta_desc,
                                     'Ссылка на витрину': cat2_link
                                     })

                if cat3_id and cat3_name:
                    csv_rows.append({"Тип строки": 'category', 'Наименование': f"{cat3_name}",
                                     "ID товара": f"{cat3_id}", 'Статус': '1', 'Заголовок': cat3_title,
                                     'META Keywords': cat3_meta_keywords, 'META Description': cat3_meta_desc,
                                     'Ссылка на витрину': cat3_link
                                     })
            first_time = False
            first_image = all_images[0]
            second_image = all_images[1] if len(all_images) > 1 else ''
            third_image = all_images[2] if len(all_images) > 2 else ''
            forth_image = all_images[3] if len(all_images) > 3 else ''
            fifth_image = all_images[4] if len(all_images) > 4 else ''
            sixth_image = all_images[5] if len(all_images) > 6 else ''
            first_available = False
            x = 0
            for opt in opts:
                url = 'https://www.motoin.de/ajax_responser.php'
                headers = {
                    'accept-language': 'ru,en-GB;q=0.9,en;q=0.8,fr-FR;q=0.7,fr;q=0.6,ru-RU;q=0.5,en-US;q=0.4,de;q=0.3',
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'cookie': cookie,
                    'origin': 'https://www.motoin.de',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                    'x-requested-with': 'XMLHttpRequest'
                }
                data = {
                    'part': 'prod_info',
                    'changed': f'opt_{asset_id}_0',
                    'csrf_token': token,
                    f'opt_{asset_id}_0': opt,
                    'products_id': asset_id
                }
                req = requests.post(url, headers=headers, data=data)
                logger.debug(req.status_code)
                res = req.json()
                try:
                    img = re.findall(r'https://img.motoin.de/product_images/popup_images/\S*.jpg',
                                     res.get(f'motoin_productImage_{asset_id}'))[0]
                except:
                    req = requests.post(url, headers=headers, data=data, timeout=10)
                    res = req.json()
                    img = res.get(f'motoin_productImage_{asset_id}')
                sizes = res.get(f'opt_{asset_id}_1')
                color_types.append({colors[i]: {
                    'Изображение': img
                }})
                if sizes:
                    first_available = False
                    if not img:
                        img = first_image
                    row_list = ['product', name_template, '', '', 'RUB', price, '', '', purchase_price, '', '', '', '',
                                '', '', short_description, description_element, badge, '1', product_type, tags, title,
                                meta_keywords, meta_description, f'{product_in_url}-{transliterate_text(colors[i])}',
                                brand, sex, availability,
                                category_name, '<{}>', '<{}>', img, second_image, third_image, forth_image,
                                fifth_image, sixth_image]
                    csv_rows.append(row_list)
                    if not x:
                        product_number += 1
                    x += 1
                    logger.debug(f"product number = {product_number}")
                    for size in sizes:
                        available = 0 if size.get('class') else 1
                        main_art = 1 if available and not first_available else ''
                        csv_rows.append({
                            'Тип строки': 'variant',
                            'Наименование': name_template,
                            'Наименование артикула': f"{size.get('text')}, {colors[i]}",
                            'Код артикула': art,
                            'Валюта': 'RUB',
                            'Цена': price,
                            'Доступен для заказа': f"{available}",
                            'Зачеркнутая цена': '0',
                            'Закупочная цена': purchase_price,
                            'В наличии': f"{available * 10}",
                            'Основной артикул': main_art,
                            'В наличии @шоу-рум в Москве': 0,
                            'В наличии @склад в Москве': 0,
                            'В наличии @склад поставщика': f"{available * 10}",
                            'Наклейка': badge,
                            'Статус': '1',
                            'Тип товаров': product_type,
                            'Ссылка на витрину': f'{product_in_url}-{transliterate_text(colors[i])}',
                            'Размер': f'<{{{size.get("text")}}}>',
                            'Цвет': f'{{{colors[i]}}}',
                            'Изображения товаров': img,
                        })
                        if available:
                            first_available = True
                else:
                    if variant_type == 'size':
                        color = ''
                        size = colors[i]
                    else:
                        color = colors[i]
                        size = ''
                    url_postfix = f"-{transliterate_text(color)}" if len(opts) > 1 else ''
                    row_list = ['product', name_template, '', '', 'RUB', price, '', '', purchase_price, '', '', '', '',
                                '', '', short_description, description_element, badge, '1', product_type, tags, title,
                                meta_keywords, meta_description, f'{product_in_url}{url_postfix}',
                                brand, sex, availability,
                                category_name, '<{}>', '<{}>', first_image, second_image, third_image, forth_image,
                                fifth_image, sixth_image]
                    csv_rows.append(row_list)
                    available = 0 if res.get("disable_cart_button") else 1
                    main_art = 1 if available and not first_available else ''
                    csv_rows.append({
                        'Тип строки': 'variant',
                        'Наименование': name_template,
                        'Наименование артикула': f"{size}{color}",
                        'Код артикула': art,
                        'Валюта': 'RUB',
                        'Цена': price,
                        'Доступен для заказа': f"{available}",
                        'Зачеркнутая цена': '0',
                        'Закупочная цена': purchase_price,
                        'В наличии': f"{available * 10}",
                        'Основной артикул': main_art,
                        'В наличии @шоу-рум в Москве': 0,
                        'В наличии @склад в Москве': 0,
                        'В наличии @склад поставщика': f"{available * 10}",
                        'Наклейка': badge,
                        'Статус': '1',
                        'Тип товаров': product_type,
                        'Ссылка на витрину': f'{product_in_url}{url_postfix}',
                        'Размер': f'<{{{size}}}>',
                        'Цвет': f'<{{{color}}}>',
                        'Изображения товаров': img,
                    })
                    if available:
                        first_available = True
                i += 1
            count -= 1
            logging.debug(f'{count} urls left')
            return csv_rows
        try:
            csv_rows = get_csv_rows()
            write_rows(csv_rows)
        except Exception as er:
            logger.debug(er)


if __name__ == "__main__":
    parsed_urls = []
    for url in urls:
        proxy = proxies[3]
        logger.debug(proxy['http'])
        success = False
        attempt = 0
        while not success and success < 30:
            try:
                session = requests.Session()
                session.proxies = get_random_proxy()
                session.headers = {'user-agent': get_random_user_agent()}
                res = session.get(url, timeout=10)
                if res.status_code != 200:
                    logger.debug('connection error retry', url)
                    logger.debug(res.status_code)
                    logger.debug(res.text)
                    continue
                else:
                    logger.debug(f"{url}, using proxy {session.proxies['http']}")
                    logger.debug(res.status_code)
                    try:
                        parse(res, session)
                        success = True
                        parsed_urls.append(url)
                    except Exception as exc:
                        logger.debug(exc)
                        logger.debug(f'parsing error url: {url}')
                        time.sleep(3)
            except Exception as exc:
                logger.debug("conneciton error: retry")
                logger.debug(url)
                time.sleep(3)
                logger.debug(exc)
            finally:
                session.close()
            attempt += 1
    print(f"urls parsed = {len(parsed_urls)}")
