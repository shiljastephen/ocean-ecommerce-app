from rest_framework import serializers
from .models import VendorApplication


class VendorApplySerializer(serializers.ModelSerializer):

    class Meta:
        model = VendorApplication
        fields = [
            "id",
            "shop_name",
            "business_email",
            "phone",
            "address",
            "status",
            "created_at"
        ]

        read_only_fields = [
            "status",
            "created_at"
        ]


class VendorApplicationAdminSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source="user.email", read_only=True)
    user_name = serializers.CharField(source="user.name", read_only=True)

    class Meta:
        model = VendorApplication
        fields = [
            "id",
            "user",
            "user_email",
            "user_name",
            "business_name",
            "status",
            "created_at",
        ]
