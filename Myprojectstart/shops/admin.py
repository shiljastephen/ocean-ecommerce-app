from django.contrib import admin
from .models import Shop


@admin.register(Shop)
class ShopAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'name',
        'owner',
        'is_active',
        'created_at',
    )

    search_fields = ('name', 'owner__username')

    list_filter = ('is_active', 'created_at')

    readonly_fields = ('created_at',)

    fieldsets = (
        ('🏪 Shop Info', {
            'fields': ('name', 'owner', 'description')
        }),
        ('⚙ Status', {
            'fields': ('is_active',)
        }),
        ('📅 Dates', {
            'fields': ('created_at',)
        }),
    )
