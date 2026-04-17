from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer
from .permissions import IsVendor, IsPlatformAdmin


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = Product.objects.all()

         # Role based filtering
        if user.is_authenticated:
            if user.role == "platform_admin":
                queryset = Product.objects.all()
            elif user.role == "vendor":
                queryset = Product.objects.filter(shop__owner=user)
            else:
                queryset = Product.objects.filter(is_approved=True, is_available=True)
        else:
            queryset = Product.objects.filter(is_approved=True, is_available=True)

        # 📂 Category filtering
        category = self.request.query_params.get("category")
        if category:
            queryset = queryset.filter(category_id=category)
        return queryset 

    def perform_create(self, serializer):
        shop = self.request.user.shops.first()
        if not shop:
            raise ValidationError("Active shop required to create products")
        serializer.save(shop=shop, is_approved=False)

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsVendor()]
        return [AllowAny()]


class ApproveProductView(APIView):
    permission_classes = [IsPlatformAdmin]

    def post(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
            product.is_approved = True
            product.save()
            return Response({"message": "Product approved"})
        except Product.DoesNotExist:
            return Response({"error": "Not found"}, status=404)
