from django.urls import path
from .views import CreateReviewView, ProductReviewListView

urlpatterns = [
    path('reviews/', CreateReviewView.as_view()),
    path('reviews/<int:product_id>/', ProductReviewListView.as_view()),
]