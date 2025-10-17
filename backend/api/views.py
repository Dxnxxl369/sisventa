'''
Definición de las Vistas para la API de SisVenta.

Estas vistas definen la lógica para manejar las peticiones HTTP. Se utilizan
ViewSets de Django Rest Framework para agrupar la lógica relacionada para un
modelo particular y proporcionar operaciones CRUD estándar de forma rápida.
'''
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
from django.db.models import Sum, Count

from .models import Categoria, Cliente, Producto, Venta
from .serializers import (
    UserSerializer, CategoriaSerializer, ClienteSerializer, ProductoSerializer, 
    VentaReadSerializer, VentaWriteSerializer
)

class UserViewSet(viewsets.ModelViewSet):
    '''API endpoint que permite ver o editar usuarios.'''
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

class ClienteViewSet(viewsets.ModelViewSet):
    '''API endpoint que permite ver o editar clientes.'''
    queryset = Cliente.objects.all().order_by('-fecha_creacion')
    serializer_class = ClienteSerializer

class CategoriaViewSet(viewsets.ModelViewSet):
    '''API endpoint que permite ver o editar categorías.'''
    queryset = Categoria.objects.all().order_by('nombre')
    serializer_class = CategoriaSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    '''API endpoint que permite ver o editar productos.'''
    queryset = Producto.objects.all().order_by('-fecha_creacion')
    serializer_class = ProductoSerializer

class VentaViewSet(viewsets.ModelViewSet):
    '''
    API endpoint para Ventas. Usa diferentes serializers para lectura y escritura.
    '''
    queryset = Venta.objects.all().order_by('-fecha_venta')

    def get_serializer_class(self):
        '''Determina qué serializer usar basado en la acción (lectura o escritura).'''
        if self.action in ['list', 'retrieve']:
            return VentaReadSerializer
        return VentaWriteSerializer

class ReportesViewSet(viewsets.ViewSet):
    '''API endpoint para generar reportes.'''

    @action(detail=False, methods=['get'])
    def productos_mas_vendidos(self, request):
        '''Devuelve los 10 productos más vendidos por cantidad.'''
        productos = Producto.objects.annotate(
            total_vendido=Sum('detalles_venta__cantidad')
        ).filter(total_vendido__gt=0).order_by('-total_vendido')[:10]
        
        serializer = ProductoSerializer(productos, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def productos_menos_vendidos(self, request):
        '''Devuelve los 10 productos menos vendidos por cantidad.'''
        productos = Producto.objects.annotate(
            total_vendido=Sum('detalles_venta__cantidad')
        ).filter(total_vendido__gt=0).order_by('total_vendido')[:10]
        
        serializer = ProductoSerializer(productos, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def ventas_por_vendedor(self, request):
        '''Devuelve el número de ventas por cada vendedor.'''
        data = User.objects.annotate(
            num_ventas=Count('ventas')
        ).filter(num_ventas__gt=0).values('username', 'num_ventas').order_by('-num_ventas')
        
        return Response(list(data))
