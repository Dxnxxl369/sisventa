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

## CODIGO DE LA IA##
from django.http import HttpResponse
from django.db.models import Sum, Count, F, Value
from django.db.models.functions import Coalesce
from django.utils import timezone
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import re
import openpyxl
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from rest_framework.permissions import IsAuthenticated
##CODIGO DE LA IA

class UserViewSet(viewsets.ModelViewSet):
    '''API endpoint que permite ver o editar usuarios.'''
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

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

##DE LA IA
class VoiceCommandAPIView(APIView):
    """
    Procesa un comando de texto (originado por voz) y lo traduce
    a una consulta sobre la base de datos usando el ORM de Django.
    """
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        command = request.data.get('command', '').lower()
        if not command:
            return Response({"error": "No se recibió ningún comando."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # El "cerebro" que interpreta el comando y devuelve datos
            response_data = self.parse_command(command)
            if not response_data:
                 raise ValueError("Comando no reconocido o sin resultados.")
            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"No se pudo interpretar el comando: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    def parse_command(self, command):
        # 1. PRODUCTOS MÁS VENDIDOS
        if re.search(r"productos más vendidos", command):
            # Usamos tu 'related_name' que es 'detalles_venta'
            productos = Producto.objects.annotate(
                total_vendido=Coalesce(Sum('detalles_venta__cantidad'), 0)
            ).filter(total_vendido__gt=0).order_by('-total_vendido')[:10]
            
            # Reutilizamos tu ProductoSerializer
            serializer = ProductoSerializer(productos, many=True)
            return {
                "title": "Top 10 Productos Más Vendidos",
                "data_type": "product_list",
                "data": serializer.data
            }

        # 2. VENTAS DEL ÚLTIMO MES
        elif re.search(r"ventas del último mes|ventas de los últimos 30 días", command):
            un_mes_atras = timezone.now() - timedelta(days=30)
            ventas = Venta.objects.filter(fecha_venta__gte=un_mes_atras)
            # Reutilizamos tu VentaReadSerializer
            serializer = VentaReadSerializer(ventas, many=True)
            summary = ventas.aggregate(
                total_facturado=Coalesce(Sum('total'), 0.0),
                numero_ventas=Count('id')
            )
            return {
                "title": "Ventas de los Últimos 30 Días",
                "data_type": "sales_list",
                "data": serializer.data,
                "summary": summary
            }

        # 3. PRODUCTOS CON POCO STOCK
        elif re.search(r"poco stock|stock bajo", command):
            productos = Producto.objects.filter(stock__lte=10).order_by('stock')
            serializer = ProductoSerializer(productos, many=True)
            return {
                "title": "Productos con Stock Bajo (10 o menos unidades)",
                "data_type": "product_list",
                "data": serializer.data
            }
            
        # 4. MEJORES CLIENTES
        elif re.search(r"mejores clientes|clientes que más compran", command):
            clientes = Cliente.objects.annotate(
                total_comprado=Coalesce(Sum('compras__total'), 0.0),
                numero_compras=Coalesce(Count('compras'), 0)
            ).filter(numero_compras__gt=0).order_by('-total_comprado')[:10]
            serializer = ClienteSerializer(clientes, many=True)
            # Agregamos manualmente los campos anotados
            data = serializer.data
            for i, cliente in enumerate(clientes):
                data[i]['total_comprado'] = cliente.total_comprado
                data[i]['numero_compras'] = cliente.numero_compras

            return {
                "title": "Top 10 Mejores Clientes (por monto gastado)",
                "data_type": "client_list_summary",
                "data": data
            }

        return None # Si no se reconoce el comando


# =================================================================
# === NUEVA VISTA PARA ESTADÍSTICAS DEL DASHBOARD ===
# =================================================================
class DashboardStatsAPIView(APIView):
    """
    Devuelve un conjunto de estadísticas clave para mostrar en el Dashboard.
    """
    def get(self, request, *args, **kwargs):
        hoy = timezone.now().date()
        inicio_mes = hoy.replace(day=1)

        total_ventas_mes = Venta.objects.filter(fecha_venta__gte=inicio_mes).aggregate(total=Coalesce(Sum('total'), 0.0))['total']
        nuevos_clientes_mes = Cliente.objects.filter(fecha_creacion__gte=inicio_mes).count()
        productos_bajo_stock = Producto.objects.filter(stock__lte=10).count()
        total_productos = Producto.objects.count()

        # Ventas por categoría para un gráfico
        ventas_por_categoria = Categoria.objects.annotate(
            total_vendido=Coalesce(Sum('productos__detalles_venta__venta__total'), 0.0)
        ).filter(total_vendido__gt=0).values('nombre', 'total_vendido').order_by('-total_vendido')

        stats = {
            "total_ventas_mes": total_ventas_mes,
            "nuevos_clientes_mes": nuevos_clientes_mes,
            "productos_bajo_stock": productos_bajo_stock,
            "total_productos": total_productos,
            "ventas_por_categoria": list(ventas_por_categoria)
        }
        return Response(stats, status=status.HTTP_200_OK)
##DE LA IA