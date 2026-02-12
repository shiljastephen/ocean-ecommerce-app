from django.db import models
from useraccount.models import User


class VendorApplication(models.Model):

    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    )

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="vendor_application"
    )

    shop_name = models.CharField(max_length=150)
    shop_description = models.TextField(max_length=1000, default=True)
    business_email = models.EmailField()
    phone = models.CharField(max_length=15)
    address = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    notes = models.TextField(blank=True, null=True)  # admin notes (optional)

    def __str__(self):
        return f"{self.user.username} - {self.status}"
