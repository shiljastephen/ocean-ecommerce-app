from rest_framework import permissions
from rest_framework.permissions import BasePermission

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and(
            request.user.is_staff or request.user.role == 'admin')

class IsCustomer(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "customer"

class IsPlatformAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role == 'platform_admin'
        )
class IsVendor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "vendor"