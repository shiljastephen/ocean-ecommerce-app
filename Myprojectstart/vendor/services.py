from shops.models import Shop


def create_vendor_shop(user, business_name):
    """
    Safe shop creation.
    Prevent duplicate shop creation.
    """

    shop, created = Shop.objects.get_or_create(
        owner=user,
        defaults={
            "name": business_name,
            "description": f"{business_name} official shop",
            "is_active": True,
        }
    )

    return shop, created
