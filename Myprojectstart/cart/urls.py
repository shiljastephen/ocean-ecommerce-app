from django.urls import path
from .views import CartListView, AddToCartView, UpdateCartQuantityView, \
    ToggleCartSelectionView

urlpatterns = [
    path('', CartListView.as_view(), name='view-cart'),
    path('add/', AddToCartView.as_view(), name='add-to-cart'),
    path('update/<int:pk>/', UpdateCartQuantityView.as_view(), name='update-cart'),
    path('select/<int:pk>/', ToggleCartSelectionView.as_view()),
    
]

