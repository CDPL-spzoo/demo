from .models import Entity
from .serializers import EntitySerializer
from rest_framework import viewsets, pagination, status
from egrn_info.permissions import IsAdminOrReadOnly
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_yasg.utils import swagger_auto_schema, no_body
from drf_yasg import openapi
from django.db.models import Q
import math

field_mapping = {
    'IntegerField': openapi.FORMAT_INT32,
    'CharField': openapi.TYPE_STRING,
    'DateTimeField': openapi.FORMAT_DATE
}


class YourModelPagination(pagination.PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 200

    def get_paginated_response(self, data):
        return Response({
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'total_results': self.page.paginator.count,
            'total_pages': math.ceil(self.page.paginator.count / self.page_size),
            'results': data
        })


class EntityViewSet(viewsets.ModelViewSet):
    queryset = Entity.objects.all()
    serializer_class = EntitySerializer
    pagination_class = YourModelPagination
    permission_classes = [IsAdminOrReadOnly]
    fields = EntitySerializer().get_fields()
    params = []
    for field_name, field_instance in fields.items():
        field_class_name = field_instance.__class__.__name__
        openapi_format = field_mapping.get(field_class_name, None)
        params.append(
            openapi.Parameter(field_name, openapi.IN_QUERY, description=f"filter by {field_name}", type=openapi_format))

    from_param = openapi.Parameter('from_date',
                                   openapi.IN_QUERY,
                                   description="filter start date",
                                   type=openapi.FORMAT_DATE)
    to_param = openapi.Parameter('to_date',
                                 openapi.IN_QUERY,
                                 description="filter end date",
                                 type=openapi.FORMAT_DATE)
    filtration_mapper = {
        "contains": "__icontains",
        "start_with": "__startswith",
        "full_match": ""
    }
    filter_by = openapi.Parameter('filtration', openapi.IN_QUERY,
                                  description="type by(contains, start from, full match)",
                                  type=openapi.TYPE_STRING,
                                  enum=list(filtration_mapper.keys()),
                                  default='contains')

    @swagger_auto_schema(manual_parameters=[from_param, to_param, filter_by, *params])
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        filters = []
        filtration = self.request.query_params.get('filtration')
        if not filtration or (not self.filtration_mapper.get(filtration) and filtration != "full_match"):
            print(filtration, self.filtration_mapper)
            filtration = list(self.filtration_mapper.keys())[0]
        for field_name, field_instance in self.fields.items():
            value = self.request.query_params.get(field_name)
            if value is not None:
                filters.append(Q(**{field_name + self.filtration_mapper.get(filtration): value}))
        for filter in filters:
            queryset = queryset.filter(filter)
        from_date = self.request.query_params.get('from_date')
        to_date = self.request.query_params.get('to_date')
        if from_date is not None:
            queryset = queryset.filter(registration_date__gte=from_date)
        if to_date is not None:
            queryset = queryset.filter(registration_date__lte=to_date)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = EntitySerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = EntitySerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        data = request.data
        many = isinstance(data, list)
        serializer = self.get_serializer(data=data, many=many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @swagger_auto_schema(
        method='POST',
        operation_description="Perform a POST request without a request body.",
        request_body=no_body,
        )
    @action(detail=False, methods=['POST'], url_path='pans')
    def get_pans(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        pan_attributes = [entity.pan for entity in queryset if entity.pan]
        return Response(pan_attributes)
