import graphene
from graphene_django import DjangoObjectType
from egrn_info.models import Entity
from django.db.models import Q


class EntityType(DjangoObjectType):
    class Meta:
        model = Entity
        fields = "__all__"


class Query(graphene.ObjectType):
    fields = {**EntityType._meta.fields,
              **{
                  "registration_date__gt": graphene.types.DateTime,
                  "registration_date__lt": graphene.types.DateTime,
                  "registration_date__gte": graphene.types.DateTime,
                  "registration_date__lte": graphene.types.DateTime,
              },
              }
    list_entities = graphene.List(EntityType,
                                  **{field: graphene.Argument(graphene.String) for field in fields},
                                  )

    def resolve_list_entities(root, info, **kwargs):
        queryset = Entity.objects.all()

        # Применяем динамические фильтры
        filters = []
        for field, value in kwargs.items():
            if field in EntityType._meta.fields:
                filters.append(Q(**{field + '__icontains': value}))

        for filter in filters:
            queryset = queryset.filter(filter)
        for field, value in kwargs.items():
            if field == "registration_date__gt":
                queryset = queryset.filter(registration_date__gt=value)
            if field == "registration_date__lt":
                queryset = queryset.filter(registration_date__lt=value)
            if field == "registration_date__gte":
                queryset = queryset.filter(registration_date__gte=value)
            if field == "registration_date__lte":
                queryset = queryset.filter(registration_date__lte=value)
        return queryset


schema = graphene.Schema(query=Query)
