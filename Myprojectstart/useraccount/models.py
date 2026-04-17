from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('vendor', 'Vendor'),
        ('customer', 'Customer'),
        ('platform_admin', 'Platform Admin'),

    )
    phone = models.CharField(max_length=15, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    
    def __str__(self):
        return f"{self.username} ({self.role})"