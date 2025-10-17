# api/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
# ¡Importamos la vista de token directamente!
from rest_framework.authtoken import views
from .views import (
    UserViewSet, ClienteViewSet, CategoriaViewSet, ProductoViewSet, 
    VentaViewSet, ReportesViewSet, VoiceCommandAPIView, DashboardStatsAPIView
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'clientes', ClienteViewSet, basename='cliente')
router.register(r'categorias', CategoriaViewSet, basename='categoria')
router.register(r'productos', ProductoViewSet, basename='producto')
router.register(r'ventas', VentaViewSet, basename='venta')
router.register(r'reportes', ReportesViewSet, basename='reporte')

urlpatterns = [
    # Incluye todas las URLs del router (clientes, productos, etc.)
    path('', include(router.urls)),
    
    # Rutas manuales para las nuevas funcionalidades
    path('voice-command/', VoiceCommandAPIView.as_view(), name='voice-command'),
    path('dashboard-stats/', DashboardStatsAPIView.as_view(), name='dashboard-stats'),
    
    # === ESTA ES LA FORMA CORRECTA DE AÑADIR LA RUTA DE TOKEN ===
    path('token-auth/', views.obtain_auth_token, name='api_token_auth'),
]