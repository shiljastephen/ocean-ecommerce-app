from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from .models import Shop
from .serializers import ShopSerializer, ProductSerializer
from products.models import Product
from useraccount.permissions import IsPlatformAdmin

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from useraccount.permissions import IsVendor
from products.models import Product
from orders.models import OrderItem
from django.db.models import Sum, F
from datetime import timedelta
from django.utils import timezone

class AllShopsView(generics.ListAPIView):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]


class VendorDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsVendor]

    def get(self, request):
        user = request.user

        shop = Shop.objects.filter(owner=user, is_active=True).first()

        products = Product.objects.filter(
            shop__owner=user,
            shop__is_active=True
        )

        items = OrderItem.objects.filter(
            product__shop__owner=user
        )

        total_products = products.count()
        total_orders = items.count()
        pending_orders = items.filter(vendor_status="pending").count()
        delivered_orders = items.filter(vendor_status="delivered").count()

        revenue = items.filter(
            vendor_status="delivered"
        ).aggregate(
            total=Sum(F("price") * F("quantity"))
        )["total"] or 0

        return Response({
            "shop_name": shop.name if shop else None,
            "shop_active": bool(shop),

            "total_products": total_products,
            "total_orders": total_orders,
            "pending_orders": pending_orders,
            "delivered_orders": delivered_orders,
            "revenue": revenue,
        })

class VendorSalesChartView(APIView):
    permission_classes = [IsAuthenticated, IsVendor]

    def get(self, request):
        user = request.user

        today = timezone.now().date()
        last_7_days = [today - timedelta(days=i) for i in range(6, -1, -1)]

        data = []

        for day in last_7_days:
            total = OrderItem.objects.filter(
                product__shop__owner=user,
                vendor_status="delivered",
                order__created_at__date=day
            ).aggregate(
                total=Sum(F("price") * F("quantity"))
            )["total"] or 0

            data.append({
                "date": day.strftime("%d %b"),
                "sales": total
            })

        return Response(data)