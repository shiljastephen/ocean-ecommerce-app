from rest_framework import serializers
from .models import Cart

class CartSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    product_price = serializers.ReadOnlyField(source='product.price')
    product_image = serializers.ImageField(source="product.image", read_only=True)
    product_description = serializers.CharField(
    source="product.description",
    read_only=True)

    class Meta:
        model = Cart
        fields = [
            'id',
            'product',
            'product_name',
            'product_price',
            "product_image",
            'quantity',
            "is_selected",
            "product_description",
        ]
