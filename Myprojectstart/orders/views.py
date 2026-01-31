from rest_framework.response import Response
from rest_framework import generics, permissions
from .models import Order , OrderItem
from .serializers import OrderSerializer
from products.models import Product
from useraccount.permissions import IsAdmin
from django.shortcuts import get_object_or_404

class BuyNowOrder(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))

        product = get_object_or_404(Product, id=product_id)

        order = Order.objects.create(user=request.user, payment_method="COD")

        OrderItem.objects.create(
            order=order,
            product=product,
            quantity=quantity,
            price=product.price
        )

        order.total_price = product.price * quantity
        order.save()

        return Response({"message": "Buy Now order created", "order_id": order.id})
# Order History
class OrderHistoryView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')
    
    def get_serializer_context(self):
        return {"request": self.request}

# View All Orders (Admin)
class AdminOrderListView(generics.ListAPIView):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [IsAdmin]

class UpdateOrderStatusView(generics.UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAdmin]
    lookup_field = 'pk'
