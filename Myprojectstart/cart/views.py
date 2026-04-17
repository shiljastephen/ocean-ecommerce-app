from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Cart
from .serializers import CartSerializer

# VIEW CART
class CartListView(generics.ListAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

#  ADD TO CART
class AddToCartView(generics.CreateAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))

        if quantity < 1:
            return Response(
                {"error": "Quantity must be at least 1"},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item, created = Cart.objects.get_or_create(
            user=request.user,
            product_id=product_id,
            defaults={"quantity": quantity}
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        serializer = CartSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

#  REMOVE FROM CART
class RemoveFromCartView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)


# UPDATE QUANTITY / SELECTION
class UpdateCartQuantityView(generics.UpdateAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(
            Cart,
            id=self.kwargs["pk"],
            user=self.request.user
        )

    def patch(self, request, *args, **kwargs):
        cart_item = self.get_object()

        if "quantity" in request.data:
            quantity = int(request.data.get("quantity"))
            if quantity < 1:
                return Response(
                    {"error": "Quantity must be at least 1"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            cart_item.quantity = quantity

        if "is_selected" in request.data:
            cart_item.is_selected = request.data.get("is_selected")

        cart_item.save()
        return Response(CartSerializer(cart_item).data)


#  TOGGLE SELECTION ONLY
class ToggleCartSelectionView(generics.UpdateAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)
