from rest_framework import serializers
from .models import Shop
from products.models import Product


class ShopSerializer(serializers.ModelSerializer):

    class Meta:
        model = Shop
        fields = "__all__"
        read_only_fields = ("owner", "created_at")


class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = "__all__"
        read_only_fields = ("shop", "is_approved")
