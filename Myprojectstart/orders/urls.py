from django.urls import path
from .views import BuyNowOrder, OrderHistoryView, AdminOrderListView, UpdateOrderStatusView

urlpatterns = [
    path('buy-now/', BuyNowOrder.as_view()),
    path('history/', OrderHistoryView.as_view(), name='order-history'),
    #Admin
    path('admin/orders/', AdminOrderListView.as_view(), name='admin-orders'),
    path('admin/orders/<int:pk>/status/', UpdateOrderStatusView.as_view(), name='update-order-status'),
]

