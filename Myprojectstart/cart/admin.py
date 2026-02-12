from django.contrib import admin
from .models import Cart


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):

    # ===== TABLE VIEW =====
    list_display = (
        'user',
        'product',
        'quantity',
        'is_selected',
        'added_at',
        'product_price',
        'total_price',
    )

    list_filter = (
        'is_selected',
        'added_at',
    )

    search_fields = (
        'user__username',
        'product__name',
    )

    ordering = ('-added_at',)

    list_select_related = ('user', 'product')

    # ===== READ ONLY INFO =====
    readonly_fields = (
        'added_at',
        'product_price',
        'total_price',
    )

    # ===== CALCULATED FIELDS =====
    def product_price(self, obj):
        return obj.product.price
    product_price.short_description = "Product Price"

    def total_price(self, obj):
        return obj.product.price * obj.quantity
    total_price.short_description = "Total Price"

    # ===== EDIT PAGE ORGANIZATION =====
    fieldsets = (
        ('Cart Info', {
            'fields': ('user', 'product', 'quantity', 'is_selected')
        }),
        ('System Info', {
            'fields': ('added_at', 'product_price', 'total_price')
        }),
    )
    def user_total_cart_value(self, obj):
       carts = Cart.objects.filter(user=obj.user)
       return sum(item.product.price * item.quantity for item in carts)

    user_total_cart_value.short_description = "User Cart Total"
