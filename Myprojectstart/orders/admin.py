from django.contrib import admin
from .models import Order, OrderItem


# =============== ORDER ITEMS INLINE ===============
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'quantity', 'price', 'item_total')
    can_delete = False
    
    def item_total(self, obj):
        if obj.price is None or obj.quantity is None:
            return 0
        return obj.price * obj.quantity


# =============== ORDER ADMIN ===============
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'user',
        'total_price',
        'payment_method',
        'status',
        'created_at',
        'item_count',
    )

    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('user__username', 'id')
    ordering = ('-created_at',)
    list_select_related = ('user',)

    readonly_fields = ('created_at', 'total_price')
    inlines = [OrderItemInline]

    def item_count(self, obj):
        return obj.items.count()
    item_count.short_description = "Items"

    fieldsets = (
        ('Order Info', {
            'fields': ('user', 'status', 'payment_method', 'total_price')
        }),
        ('System Info', {
            'fields': ('created_at',)
        }),
    )
