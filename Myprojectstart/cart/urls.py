from django.urls import path
from .views import CartListView, AddToCartView, RemoveFromCartView, UpdateCartQuantityView, \
    PlaceOrderFromCart, ToggleCartSelectionView

urlpatterns = [
    path('', CartListView.as_view(), name='view-cart'),
    path('add/', AddToCartView.as_view(), name='add-to-cart'),
    path('remove/<int:pk>/', RemoveFromCartView.as_view(), name='remove-from-cart'),
    path('update/<int:pk>/', UpdateCartQuantityView.as_view(), name='update-cart'),
    path('place/cart/', PlaceOrderFromCart.as_view(), name='place-order'),
    path('select/<int:pk>/', ToggleCartSelectionView.as_view()),
]

