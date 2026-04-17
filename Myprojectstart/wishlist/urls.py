from django.urls import path
from .views import ToggleWishlist, WishlistList, RemoveWishlist, CheckWishlist

urlpatterns = [
    path('wishlist/', WishlistList.as_view()),
    path('wishlist/toggle/', ToggleWishlist.as_view()),
    path('wishlist/remove/<int:pk>/', RemoveWishlist.as_view()),
    path('wishlist/check/<int:product_id>/', CheckWishlist.as_view()),
]