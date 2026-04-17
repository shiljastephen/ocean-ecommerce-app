from django.db import models
from django.contrib.auth.models import User
from django.db.models import Avg
from django.conf import settings
from products.models import Product

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def average_rating(self):
        return self.reviews.aggregate(avg=Avg('rating'))['avg']

    class Meta:
        unique_together = ('product', 'user')  # one review per user per product

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"
