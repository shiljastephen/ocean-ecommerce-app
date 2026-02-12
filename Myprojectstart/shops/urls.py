from django.urls import path
from .views import (
    VendorDashboardView,
    AllShopsView
)

urlpatterns = [
    # DASHBOARD
    path('vendor/dashboard/', VendorDashboardView.as_view()),

    # ADMIN
    path("admin/shops/", AllShopsView.as_view(), name="all-shops"),
]

