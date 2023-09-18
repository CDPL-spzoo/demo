from django.db import models


class Entity(models.Model):
    full_name = models.CharField(verbose_name="Наименование юр. лица", max_length=500)
    fio = models.CharField(verbose_name="ФИО", max_length=500, blank=True, null=True)
    pan = models.PositiveIntegerField(verbose_name="Регистрационный номер", unique=True)
    email = models.CharField(verbose_name="Электронный адрес", blank=True, null=True, max_length=100)
    phone_number = models.CharField(verbose_name="Телефон", blank=True, null=True)
    state = models.CharField(verbose_name="Статус", max_length=500)
    registration_authority = models.CharField(verbose_name="Регистрирующий орган", max_length=500)
    registration_place = models.CharField(verbose_name="Место регистрации", max_length=500)
    registration_date = models.DateTimeField(verbose_name="Дата регистрации")
    last_event_date = models.DateTimeField(verbose_name="Дата последней записи в ЕГР", null=True)
    short_name = models.CharField(verbose_name="Краткое наименование", max_length=500, null=True)
    full_name_bel = models.CharField(verbose_name="Наименование юр. лица (бел)", max_length=500, blank=True, null=True)
    short_name_bel = models.CharField(verbose_name="Краткое наименование (бел)", max_length=500, blank=True, null=True)
    activity_name = models.CharField(verbose_name="вид деятельности", max_length=500, blank=True, null=True)
    activity_code = models.PositiveIntegerField(verbose_name="Код вида деятельности", blank=True, null=True)

    class Meta:
        verbose_name = 'Организация'
        verbose_name_plural = 'Организации'
        db_table = 'entity'

