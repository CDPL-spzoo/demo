import json
from time import sleep
import requests
import parsel
import re
unisex_url = 'https://www.motoin.de/search.php?fcat78%5B0%5D=710&language=ru'
child_url = 'https://www.motoin.de/search.php?language=ru&fcat78%5B%5D=5'
woman_url = 'https://www.motoin.de/search.php?language=ru&fcat78%5B%5D=4'
man_url = 'https://www.motoin.de/search.php?language=ru&fcat78%5B%5D=3'


def get_urls_by_filter(filter_url) -> list:
    res = requests.get(filter_url)
    selector = parsel.Selector(text=res.text)
    links = selector.css('.product-wrapper .picture>a::attr("href")').getall()
    number_of_pages = selector.css('.pageResults:last-child span::text').get()
    if number_of_pages:
        for page in range(2, int(number_of_pages)+1):
            url = filter_url+f'&page={page}'
            res = requests.get(url)
            selector = parsel.Selector(text=res.text)
            new_links = selector.css('.product-wrapper .picture>a::attr("href")').getall()
            links += new_links
            sleep(2)
    ru_links = list(map(lambda x: x + '&currency=RUB&language=ru&country=RU', links))
    return ru_links


def get_urls_by_gender() -> dict:
    unisex_urls = get_urls_by_filter(unisex_url)
    child_urls = get_urls_by_filter(child_url)
    woman_urls = get_urls_by_filter(woman_url)
    man_urls = get_urls_by_filter(man_url)
    urls = {'unisex_urls': unisex_urls, 'child_urls': child_urls, 'woman_urls': woman_urls, "man_urls": man_urls}
    with open('urls_by_sex.json', 'w', encoding='utf-8') as file:
        file.write(json.dumps(urls, sort_keys=False, indent=4, ensure_ascii=False, separators=(',', ': ')))
    return urls


def get_urls_by_sitemap(sitemap, LOCALE) -> list:
    sitemaps = []
    urls = []
    response = requests.get(sitemap)
    for el in re.findall(r'<loc>https://www.motoin.de/sitemap\d.xml</loc>', str(response.content)):
        product_link = el.replace('<loc>', '').replace('</loc>', '')
        sitemaps.append(product_link)
    for sitemap in sitemaps:
        response = requests.get(sitemap)

        for i in str(response.content).split('<loc>'):
            if f'language={LOCALE}' in i:
                urls += re.findall(f'https://www.motoin.de/\S*?[^:]::\d\S*?language={LOCALE}', i)
        print('sitemap parsing')
    ru_urls = list(map(lambda x: x + '&currency=RUB&country=RU', urls))
    return ru_urls


if __name__ == '__main__':
    get_urls_by_filter('https://www.motoin.de/Odezhda/Perchatki/Motoperchatki-Tonkie-motoperchat:::23_36_181.html?fcat78%5B%5D=4&shipping=dp_dp&language=de')
