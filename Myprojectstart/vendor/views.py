from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import VendorApplication
from .serializers import VendorApplySerializer, VendorApplicationAdminSerializer 
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .permissions import IsAdminUserOnly
from useraccount.permissions import IsPlatformAdmin
from useraccount.models import User
from shops.models import Shop
from rest_framework.exceptions import ValidationError
from django.db import transaction
from .services import create_vendor_shop
from .models import VendorApplication

class VendorApplyView(generics.CreateAPIView):
    serializer_class = VendorApplySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # ✅ Prevent Duplicate Apply
        if VendorApplication.objects.filter(user=self.request.user).exists():
            raise ValidationError("You already applied for vendor")

        # ✅ Prevent Vendor Applying Again
        if self.request.user.role == "vendor":
            raise ValidationError("You are already a vendor")

        serializer.save(user=self.request.user)

class AdminVendorApplicationListView(ListAPIView):
    serializer_class = VendorApplicationAdminSerializer
    permission_classes = [IsAuthenticated, IsAdminUserOnly]

    queryset = VendorApplication.objects.select_related("user").order_by("-created_at")

class ApproveVendorView(APIView):
    permission_classes = [IsAuthenticated, IsPlatformAdmin]

    @transaction.atomic
    def post(self, request, pk):

        try:
            application = VendorApplication.objects.select_for_update().get(pk=pk)
        except VendorApplication.DoesNotExist:
            raise ValidationError("Application not found")

        if application.status == "APPROVED":
            return Response({"message": "Already approved"})

        user = application.user

        # ✅ Update user role
        user.role = "vendor"
        user.save()

        # ✅ Update application
        application.status = "APPROVED"
        application.save()

        # ✅ Auto create shop
        shop, created = create_vendor_shop(
            user=user,
            business_name=application.business_name
        )

        return Response({
            "message": "Vendor approved successfully",
            "shop_created": created,
            "shop_name": shop.name
        })

class RejectVendorView(APIView):
    permission_classes = [IsAuthenticated, IsPlatformAdmin]

    def post(self, request, pk):

        try:
            application = VendorApplication.objects.get(pk=pk)
        except VendorApplication.DoesNotExist:
            raise ValidationError("Application not found")

        application.status = "REJECTED"
        application.save()

        return Response({"message": "Application rejected"})
