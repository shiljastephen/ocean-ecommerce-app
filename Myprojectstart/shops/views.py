from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from .models import Shop
from .serializers import ShopSerializer, ProductSerializer
from products.models import Product

from .permissions import IsVendor
from useraccount.permissions import IsPlatformAdmin


class AllShopsView(generics.ListAPIView):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]


class VendorDashboardView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, IsVendor]

    def get(self, request):

        shop = Shop.objects.filter(
            owner=request.user,
            is_active=True
        ).first()

        product_count = Product.objects.filter(
            shop__owner=request.user,
            shop__is_active=True
        ).count()

        return Response({
            "shop_name": shop.name if shop else None,
            "total_products": product_count,
            "shop_active": bool(shop)
        })
