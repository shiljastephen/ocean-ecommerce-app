from django.contrib import admin
from django.utils.html import mark_safe, format_html
from .models import Category, Product


# =========================
# 🗂 CATEGORY ADMIN
# =========================
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


# =========================
# 📦 PRODUCT ADMIN
# =========================
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):

    list_display = (
        'image_preview',
        'id',
        'name',
        'shop',
        'category',
        'price',
        'discount',
        'final_price_display',
        'stock',
        'stock_status',
        'is_available',
        'is_approved',
        'created_at',
    )

    readonly_fields = ('image_preview', 'final_price_display')

    list_filter = ('category', 'shop', 'is_available', 'is_approved', 'created_at')
    search_fields = ('name', 'description', 'category__name', 'shop__name')
    list_editable = ('price', 'discount', 'stock', 'is_available', 'is_approved')
    ordering = ('-created_at',)

    # 🖼 Image preview
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="60" style="border-radius:6px;" />', obj.image.url)
        return "No Image"
    image_preview.short_description = "Image"

    # 💰 Final price
    def final_price_display(self, obj):
        if obj is None:
            return "-"
        return format_html("₹ {}", obj.final_price)
    # 📉 Stock status
    from django.utils.safestring import mark_safe

    def stock_status(self, obj):
        if obj.stock < 5:
            return mark_safe('<span style="color:red; font-weight:bold;">Low Stock</span>')
        return mark_safe('<span style="color:green;">OK</span>')
    stock_status.short_description = "Stock Status"

    # 🧩 Form layout
    fieldsets = (
        ('🏪 Shop Info', {'fields': ('shop', 'category')}),
        ('📦 Product Info', {'fields': ('name', 'description')}),
        ('💰 Pricing', {'fields': ('price', 'discount', 'final_price_display')}),
        ('📊 Inventory', {'fields': ('stock', 'is_available', 'is_approved')}),
        ('🖼 Media', {'fields': ('image', 'image_preview')}),
    )

    # ✅ Bulk approve action
    actions = ['approve_products']

    def approve_products(self, request, queryset):
        queryset.update(is_approved=True)
    approve_products.short_description = "Approve selected products"

    # 🔒 Vendors cannot approve products
    def get_readonly_fields(self, request, obj=None):
        if not request.user.is_superuser:
            return ('is_approved', 'image_preview', 'final_price_display')
        return self.readonly_fields

    # 🏪 Auto assign vendor shop
    def save_model(self, request, obj, form, change):
        if not request.user.is_superuser and hasattr(request.user, 'shop'):
            obj.shop = request.user.shop
        super().save_model(request, obj, form, change)
