from django.urls import path
from .views import (VendorApplyView, ApproveVendorView,
 AdminVendorApplicationListView, ApproveVendorView, RejectVendorView)

urlpatterns = [
    path("apply/", VendorApplyView.as_view()),
    path("approve/<int:pk>/", ApproveVendorView.as_view()),
    path("admin/vendor-applications/", AdminVendorApplicationListView.as_view(), name="admin_vendor_applications",),
    path("approve/<int:pk>/", ApproveVendorView.as_view()),
    path("reject/<int:pk>/", RejectVendorView.as_view()),
]
