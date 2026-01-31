from rest_framework import generics, permissions ,status
from rest_framework.response import Response
from .models import Cart
from .serializers import CartSerializer
from django.shortcuts import get_object_or_404
from orders.models import Order
from orders.views import OrderItem

# View Cart
class CartListView(generics.ListAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

# Add to Cart
class AddToCartView(generics.CreateAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        product = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        cart_item, created = Cart.objects.get_or_create(
            user=request.user,
            product_id=product,
            defaults={'quantity': quantity}
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        serializer = CartSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# Remove from Cart
class RemoveFromCartView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

#Cart Quantity Update
class UpdateCartQuantityView(generics.UpdateAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(
            Cart,
            id=self.kwargs['pk'],
            user=self.request.user
        )

    def patch(self, request, *args, **kwargs):
        cart_item = self.get_object()
        quantity = request.data.get('quantity')

        if not quantity or int(quantity) < 1:
            return Response(
                {"error": "Quantity must be at least 1"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if 'is_selected' in request.data:
            cart_item.is_selected = request.data.get('is_selected')

        cart_item.quantity = int(quantity)
        cart_item.save()
        return Response(CartSerializer(cart_item).data)

class PlaceOrderFromCart(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        cart_items = Cart.objects.filter(user=user, is_selected=True)

        if not cart_items.exists():
            return Response({"error": "No selected items"}, status=400)

        order = Order.objects.create(user=user, payment_method="COD")

        total = 0

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )
            total += item.product.price * item.quantity

        order.total_price = total
        order.save()

        cart_items.delete()

        return Response({"message": "Order placed", "order_id": order.id})

    def get_serializer_context(self):
        return {"request": self.request}

class ToggleCartSelectionView(generics.UpdateAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)
