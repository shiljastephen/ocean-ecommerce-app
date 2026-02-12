from rest_framework import serializers
from .models import Order, OrderItem


# =====================================
# ORDER ITEM STATUS (FOR TRACKING)
# =====================================
class OrderItemStatusSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product_name",
            "quantity",
            "vendor_status",
        ]

# =====================================
# ORDER ITEM (GENERAL)
# =====================================
class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source="product.name")
    product_price = serializers.ReadOnlyField(source="product.price")
    product_image = serializers.ImageField(
        source="product.image",
        read_only=True
    )

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_name",
            "product_image",
            "product_price",
            "quantity",
            "price",
        ]


# =====================================
# ORDER (CUSTOMER / ADMIN)
# =====================================
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "payment_method",
            "total_price",
            "status",
            "created_at",
            "items",
        ]
        read_only_fields = [
            "user",
            "total_price",
            "status",
            "created_at",
        ]


# =====================================
# VENDOR VIEW (ORDER ITEMS)
# =====================================
class VendorOrderItemSerializer(serializers.ModelSerializer):
    order_id = serializers.IntegerField(source="order.id", read_only=True)
    customer = serializers.CharField(
        source="order.user.username",
        read_only=True
    )
    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "order_id",
            "customer",
            "product_name",
            "quantity",
            "price",
            "vendor_status",
        ]
        read_only_fields = [
            "order_id",
            "customer",
            "product_name",
            "quantity",
            "price",
        ]


# =====================================
# ORDER TRACKING (CUSTOMER)
# =====================================
class OrderTrackingSerializer(serializers.ModelSerializer):
    items = OrderItemStatusSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Order
        fields = [
            "id",
            "status",
            "payment_method",
            "total_price",
            "created_at",
            "items",
        ]
