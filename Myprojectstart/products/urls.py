from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet, ApproveProductView

router = DefaultRouter()
router.register("categories", CategoryViewSet)

urlpatterns = router.urls
router = DefaultRouter()

# Categories (shared)
router.register("categories", CategoryViewSet, basename="categories")

urlpatterns = [

    # 🏠 HOME (customers)
    path(
        "home/products/",
        ProductViewSet.as_view({"get": "list"}),
        name="home-products",
    ),

    # 🛒 VENDOR
    path(
        "vendor/products/",
        ProductViewSet.as_view({"get": "list"}),
        name="vendor-products",
    ),
    path(
        "vendor/products/add/",
        ProductViewSet.as_view({"post": "create"}),
        name="vendor-add-product",
    ),
    path(
        "vendor/products/<int:pk>/",
        ProductViewSet.as_view({
            "get": "retrieve",
            "put": "update",
            "patch": "partial_update",
            "delete": "destroy",
        }),
        name="vendor-product-detail",
    ),

    # 🛠 ADMIN
    path(
        "admin/products/",
        ProductViewSet.as_view({"get": "list"}),
        name="admin-products",
    ),
    path(
        "admin/products/<int:pk>/approve/",
        ApproveProductView.as_view(),
        name="approve-product",
    ),

] + router.urls