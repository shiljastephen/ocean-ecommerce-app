from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User

    # ===== LIST PAGE (table view) =====
    list_display = (
        'username',
        'email',
        'role',
        'is_staff',
        'is_active',
        'date_joined',
    )

    list_filter = (
        'role',
        'is_staff',
        'is_active',
        'date_joined',
    )

    search_fields = ('username', 'email', 'phone')

    ordering = ('-date_joined',)

    # ===== USER DETAIL PAGE SECTIONS =====
    fieldsets = (
        ('🔑 Login Info', {
            'fields': ('username', 'password')
        }),

        ('👤 Personal Info', {
            'fields': ('first_name', 'last_name', 'email', 'phone')
        }),

        ('🛡 Permissions & Role', {
            'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),

        ('📅 Important Dates', {
            'fields': ('last_login', 'date_joined')
        }),
    )

    add_fieldsets = (
        ('Create New User', {
            'classes': ('wide',),
            'fields': ('username', 'email', 'phone', 'password1', 'password2', 'role'),
        }),
    )

    readonly_fields = ('last_login', 'date_joined')

    # ===== SECURITY CONTROL =====
    def get_readonly_fields(self, request, obj=None):
        # Only superuser can change role
        if not request.user.is_superuser:
            return self.readonly_fields + ('role', 'is_superuser')
        return self.readonly_fields

    # ===== AUTO STAFF FOR ADMIN ROLE =====
    def save_model(self, request, obj, form, change):
        if obj.role == 'admin':
            obj.is_staff = True
        super().save_model(request, obj, form, change)



