from django.db import transaction
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, UpdateAPIView
from rest_framework.exceptions import PermissionDenied
from orders.models import Order, OrderItem
from .serializers import OrderTrackingSerializer
from rest_framework.permissions import IsAuthenticated
from orders.utils import auto_complete_order
from cart.models import Cart
from .serializers import (
    OrderSerializer,
    VendorOrderItemSerializer,
)
from useraccount.permissions import (
    IsCustomer,
    IsVendor,
    IsPlatformAdmin,
)
# ===============================
# 🛒 CUSTOMER PLACES ORDER
# ===============================
class PlaceOrderFromCart(APIView):
    permission_classes = [IsCustomer]

    @transaction.atomic
    def post(self, request):
        user = request.user
        cart_items = Cart.objects.filter(user=user, is_selected=True)

        if not cart_items.exists():
            return Response(
                {"error": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST
            )

        order = Order.objects.create(
            user=user,
            payment_method=request.data.get("payment_method", "cod")
        )

        total_price = 0

        for item in cart_items:
            product = item.product

            if item.quantity > product.stock:
                raise PermissionDenied(
                    f"Not enough stock for {product.name}"
                )

            OrderItem.objects.create(
                order=order,
                product=product,
                shop=product.shop,
                quantity=item.quantity,
                price=product.final_price
            )

            product.stock -= item.quantity
            product.save()

            total_price += product.final_price * item.quantity

        order.total_price = total_price
        order.save()

        cart_items.delete()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# ===============================
# 👤 CUSTOMER VIEWS OWN ORDERS
# ===============================
class MyOrdersView(ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsCustomer]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

# ===============================
# 🏪 VENDOR SEES THEIR SALES
# ===============================
class VendorOrderListView(ListAPIView):
    serializer_class = VendorOrderItemSerializer
    permission_classes = [IsVendor]

    def get_queryset(self):
        return OrderItem.objects.filter(
            product__shop__owner=self.request.user
        ).select_related("order", "product")

# ===============================
# 🏪 VENDOR UPDATES ORDER ITEM
# ===============================
class VendorOrderUpdateView(UpdateAPIView):
    serializer_class = VendorOrderItemSerializer
    permission_classes = [IsVendor]

    def get_queryset(self):
        return OrderItem.objects.filter(
            product__shop__owner=self.request.user
        )

    def perform_update(self, serializer):
        order_item = serializer.instance
        if order_item.product.shop.owner != self.request.user:
            raise PermissionDenied("Not your order")
        serializer.save()
        auto_complete_order(order_item.order)
# ===============================
# 👑 PLATFORM ADMIN → ALL ORDERS
# ===============================
class AllOrdersView(ListAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsPlatformAdmin]

class OrderTrackingView(generics.RetrieveAPIView):
    serializer_class = OrderTrackingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

class CancelOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            order = Order.objects.get(id=pk, user=request.user)
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if order.status != "pending":
            raise PermissionDenied(
                "Order cannot be cancelled at this stage"
            )

        order.status = "CANCELLED"
        order.save()

        # restore stock
        for item in order.items.all():
            product = item.product
            product.stock += item.quantity
            product.save()

        return Response(
            {"message": "Order cancelled successfully"}
        )  