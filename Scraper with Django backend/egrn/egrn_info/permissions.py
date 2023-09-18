from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # Разрешаем доступ к методам GET для всех пользователей
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_active

        # Разрешаем доступ только для администраторов
        return request.user and request.user.is_superuser
