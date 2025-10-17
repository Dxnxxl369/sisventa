'''
Definición de los Serializers para la API de SisVenta.

Estos serializers convierten los modelos de Django a tipos de datos que pueden ser
renderizados fácilmente en JSON, y viceversa. Se utilizan para manejar la
representación de los datos que se envían y reciben a través de la API.
'''
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Categoria, Cliente, Producto, Venta, DetalleVenta

# Serializer para el modelo User de Django
class UserSerializer(serializers.ModelSerializer):
    '''Serializer para los usuarios del sistema.'''
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

# Serializer para el modelo Cliente
class ClienteSerializer(serializers.ModelSerializer):
    '''Serializer para el modelo de Clientes.'''
    class Meta:
        model = Cliente
        fields = '__all__'

# Serializer para el modelo Categoria
class CategoriaSerializer(serializers.ModelSerializer):
    '''Serializer para el modelo de Categorías.'''
    class Meta:
        model = Categoria
        fields = '__all__'

# Serializer para el modelo Producto
class ProductoSerializer(serializers.ModelSerializer):
    '''Serializer para el modelo de Productos.'''
    # Muestra el nombre de la categoría en lugar de su ID.
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)

    class Meta:
        model = Producto
        fields = '__all__'
        # El campo 'categoria_nombre' es solo para lectura.
        read_only_fields = ['categoria_nombre']

# Serializer para los detalles de una venta (lectura)
class DetalleVentaReadSerializer(serializers.ModelSerializer):
    '''Serializer para leer los detalles de una venta con información del producto.'''
    producto = ProductoSerializer(read_only=True)

    class Meta:
        model = DetalleVenta
        fields = ['producto', 'cantidad', 'precio_unitario']

# Serializer para crear/actualizar detalles de una venta
class DetalleVentaWriteSerializer(serializers.ModelSerializer):
    '''Serializer para escribir (crear/actualizar) los detalles de una venta.'''
    class Meta:
        model = DetalleVenta
        fields = ['producto', 'cantidad', 'precio_unitario']

# Serializer para el modelo Venta (lectura)
class VentaReadSerializer(serializers.ModelSerializer):
    '''Serializer para leer la información de una Venta.'''
    vendedor = UserSerializer(read_only=True)
    cliente = ClienteSerializer(read_only=True)
    detalles = DetalleVentaReadSerializer(many=True, read_only=True)

    class Meta:
        model = Venta
        fields = ['id', 'fecha_venta', 'total', 'vendedor', 'cliente', 'detalles']

# Serializer para el modelo Venta (escritura)
class VentaWriteSerializer(serializers.ModelSerializer):
    '''Serializer para crear/actualizar una Venta.'''
    detalles = DetalleVentaWriteSerializer(many=True)

    class Meta:
        model = Venta
        fields = ['vendedor', 'cliente', 'total', 'detalles']

    def create(self, validated_data):
        '''
        Maneja la creación de una Venta y sus Detalles de Venta asociados.
        También actualiza el stock de los productos vendidos.
        '''
        detalles_data = validated_data.pop('detalles')
        venta = Venta.objects.create(**validated_data)
        for detalle_data in detalles_data:
            DetalleVenta.objects.create(venta=venta, **detalle_data)
            # Actualizar el stock del producto
            producto = detalle_data['producto']
            producto.stock -= detalle_data['cantidad']
            producto.save()
        return venta
