from django.urls import path
from .views import (
    PlaceOrderFromCart,
    MyOrdersView,
    VendorOrderListView,
    VendorOrderUpdateView,
    AllOrdersView,
    OrderTrackingView,
    CancelOrderView,
)

urlpatterns = [
    # 🛒 CUSTOMER
    path("place/order/", PlaceOrderFromCart.as_view(), name="place-order"),
    path("my-orders/", MyOrdersView.as_view(), name="my-orders"),

    # 🏪 VENDOR
    path("vendor/orders/", VendorOrderListView.as_view(), name="vendor-orders"),
    path("vendor/order-item/<int:pk>/update/",VendorOrderUpdateView.as_view(),name="vendor-order-update"),
    path("track/<int:pk>/",OrderTrackingView.as_view(),name="order-tracking"),
    # 👑 PLATFORM ADMIN
    path("admin/orders/", AllOrdersView.as_view(), name="all-orders"),
    path("cancel/<int:pk>/", CancelOrderView.as_view(), name="cancel-order"),
    # Track single order
    path(
        "track/<int:pk>/",
        OrderTrackingView.as_view(),
        name="order-tracking"
    ),
]
