from django.db import models
from useraccount.models import User

class Shop(models.Model):
    owner = models.ForeignKey(
        "useraccount.User",
        on_delete=models.CASCADE,
        related_name='shops'   # ✅ plural (better practice)
    )
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
