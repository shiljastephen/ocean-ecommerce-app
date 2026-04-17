from django.contrib import admin
from .models import VendorApplication
from django.db import transaction
from shops.models import Shop


@admin.register(VendorApplication)
class VendorApplicationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "shop_name",
        "status",
        "created_at",
    )

    list_filter = ("status",)
    search_fields = ("shop_name", "user__username")

    actions = ["approve_vendors", "reject_vendors"]

    @admin.action(description="Approve selected vendors")
    def approve_vendors(self, request, queryset):
        for application in queryset.filter(status="PENDING"):
            self._approve(application)

    @admin.action(description="Reject selected vendors")
    def reject_vendors(self, request, queryset):
        queryset.filter(status="PENDING").update(status="REJECTED")

    @transaction.atomic
    def _approve(self, application):
        # Create shop only if not exists
        Shop.objects.get_or_create(
            owner=application.user,
            defaults={
                "name": application.shop_name,
                "description": application.shop_description,
                #"business_email": application.business_email,
                "is_active": True,
            },
        )
        # Update user role
        application.user.role = "vendor"
        application.user.save(update_fields=["role"])
        application.status = "APPROVED"
        application.save(update_fields=["status"])
