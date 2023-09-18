from rest_framework import routers
from .api import EntityViewSet


router = routers.DefaultRouter()
router.register('api/entity', EntityViewSet, 'entity')

urlpatterns = router.urls


