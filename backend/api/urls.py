
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, ClienteViewSet, CategoriaViewSet, ProductoViewSet, 
    VentaViewSet, ReportesViewSet
)

# Crea una instancia del router
router = DefaultRouter()

# Registra los ViewSets en el router
router.register(r'users', UserViewSet, basename='user')
router.register(r'clientes', ClienteViewSet, basename='cliente')
router.register(r'categorias', CategoriaViewSet, basename='categoria')
router.register(r'productos', ProductoViewSet, basename='producto')
router.register(r'ventas', VentaViewSet, basename='venta')
router.register(r'reportes', ReportesViewSet, basename='reporte')

# Las URLs de la API son determinadas automáticamente por el router.
urlpatterns = [
    path('', include(router.urls)),
]
