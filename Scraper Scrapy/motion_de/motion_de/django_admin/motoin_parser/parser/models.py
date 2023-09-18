from django.db import models


class Category(models.Model):
    parsed_csv = models.FileField(upload_to='parser/parsed', blank=True, verbose_name='Готовый csv')
    name = models.CharField(verbose_name="Наименование", max_length=100)
    category_url = models.URLField(verbose_name="Ссылка на категорию")
    gender = models.CharField(verbose_name="Пол", max_length=15, blank=True)
    availability = models.CharField(verbose_name="Наличие", max_length=100)
    margin = models.PositiveIntegerField(verbose_name="Наценка(%)")
    delivery = models.DecimalField(verbose_name="Доставка(РУБ)", max_digits=10, default=0, decimal_places=2)
    category_name = models.CharField(verbose_name="Название категории", max_length=100)
    product_type = models.CharField(verbose_name="Тип товаров", max_length=100)
    name_pattern = models.CharField(verbose_name="Шаблон наименования товаров", max_length=100)
    badge = models.TextField(verbose_name="наклейка")
    tags = models.CharField(verbose_name="Теги", max_length=100)
    title = models.CharField(verbose_name="Заголовок", max_length=100)
    meta_description = models.TextField(verbose_name="META description", max_length=100)
    meta_keywords = models.CharField(verbose_name="META Keywords", max_length=100)
    short_description = models.CharField(verbose_name="Краткое описание", max_length=100, blank=True)
    status = models.CharField(verbose_name='Статус',
                              choices=[
                                  ('status1', 'Not started'),
                                  ('status2', 'Finished'),
                                  ('status3', 'Finished with error'),
                                  ('status4', 'In Progress')
                              ],
                              default='status1',
                              max_length=15)

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'


class Subcategory(models.Model):
    category_name = models.CharField(verbose_name="Наименование", max_length=100)
    title = models.CharField(verbose_name="Заголовок", max_length=100)
    meta_keywords = models.CharField(verbose_name='META keywords', max_length=100)
    meta_description = models.TextField(verbose_name="META description")
    showcase_link = models.CharField(verbose_name='Ссылка на витрину', max_length=100)
    webasyst_category_id = models.PositiveIntegerField(verbose_name="ID категории в webasyst")
    category_description = models.TextField(verbose_name="Описание", blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'
