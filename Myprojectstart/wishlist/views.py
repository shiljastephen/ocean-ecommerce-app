from rest_framework import generics, permissions, status
from .models import Wishlist
from .serializers import WishlistSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from products.models import Product

class ToggleWishlist(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product")

        if not product_id:
            return Response(
                {"error": "Product ID required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        wishlist_item = Wishlist.objects.filter(
            user=request.user,
            product=product
        ).first()

        # ❤️ REMOVE if exists
        if wishlist_item:
            wishlist_item.delete()
            return Response({
                "message": "Removed from wishlist",
                "in_wishlist": False
            })

        # 🤍 ADD if not exists
        Wishlist.objects.create(
            user=request.user,
            product=product
        )

        return Response({
            "message": "Added to wishlist",
            "in_wishlist": True
        })
        
class WishlistList(generics.ListAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

class RemoveWishlist(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

class CheckWishlist(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, product_id):
        exists = Wishlist.objects.filter(
            user=request.user,
            product_id=product_id
        ).exists()

        return Response({"in_wishlist": exists})

        