from django.urls import path
from .views import (
    VendorDashboardView, VendorSalesChartView,
    AllShopsView
)

urlpatterns = [
    # DASHBOARD
    path('vendor/dashboard/', VendorDashboardView.as_view()),

    # ADMIN
    path("admin/shops/", AllShopsView.as_view(), name="all-shops"),

    #saleschart
    path("vendor/dashboard/sales-chart/", VendorSalesChartView.as_view()),
]

