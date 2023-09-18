from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from motoin_spider import MarketSpider


if __name__ == '__main__':
    process = CrawlerProcess(get_project_settings())
    process.crawl(MarketSpider)
    process.start()