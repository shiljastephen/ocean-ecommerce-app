# from django.urls import path
# from .views import ProductViewSet
#
# product_list = ProductViewSet.as_view({'get': 'list'})
#
# urlpatterns = [
#     path('products/', product_list),
# ]

from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet

router = DefaultRouter()
router.register("products", ProductViewSet, basename="products")
router.register("categories", CategoryViewSet)

urlpatterns = router.urls
