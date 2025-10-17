from django.db import models
from django.contrib.auth.models import User

class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True, verbose_name='Nombre')
    descripcion = models.TextField(blank=True, null=True, verbose_name='Descripción')

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'

class Cliente(models.Model):
    nombre = models.CharField(max_length=100, verbose_name='Nombre')
    apellido = models.CharField(max_length=100, verbose_name='Apellido')
    email = models.EmailField(max_length=254, unique=True, blank=True, null=True, verbose_name='Email')
    telefono = models.CharField(max_length=20, blank=True, null=True, verbose_name='Teléfono')
    direccion = models.TextField(blank=True, null=True, verbose_name='Dirección')
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.nombre} {self.apellido}'

    class Meta:
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'

class Producto(models.Model):
    nombre = models.CharField(max_length=200, verbose_name='Nombre')
    sku = models.CharField(max_length=100, unique=True, blank=True, null=True, verbose_name='SKU')
    descripcion = models.TextField(blank=True, null=True, verbose_name='Descripción')
    precio = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Precio')
    stock = models.PositiveIntegerField(default=0, verbose_name='Stock')
    categoria = models.ForeignKey(Categoria, related_name='productos', on_delete=models.SET_NULL, null=True, blank=True, verbose_name='Categoría')
    imagen_url = models.URLField(max_length=2048, blank=True, null=True, verbose_name='URL de Imagen')
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.nombre} (${self.precio})'

    class Meta:
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'
        ordering = ['-fecha_creacion']

class Venta(models.Model):
    fecha_venta = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Venta')
    total = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Total')
    vendedor = models.ForeignKey(User, related_name='ventas', on_delete=models.SET_NULL, null=True, verbose_name='Vendedor')
    cliente = models.ForeignKey(Cliente, related_name='compras', on_delete=models.SET_NULL, null=True, verbose_name='Cliente')

    def __str__(self):
        return f'Venta #{self.id} - {self.fecha_venta.strftime("%Y-%m-%d %H:%M")}'

    class Meta:
        verbose_name = 'Venta'
        verbose_name_plural = 'Ventas'
        ordering = ['-fecha_venta']

class DetalleVenta(models.Model):
    venta = models.ForeignKey(Venta, related_name='detalles', on_delete=models.CASCADE, verbose_name='Venta')
    producto = models.ForeignKey(Producto, related_name='detalles_venta', on_delete=models.CASCADE, verbose_name='Producto')
    cantidad = models.PositiveIntegerField(verbose_name='Cantidad')
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Precio Unitario')

    def __str__(self):
        return f'{self.cantidad} x {self.producto.nombre} @ ${self.precio_unitario}'

    class Meta:
        verbose_name = 'Detalle de Venta'
        verbose_name_plural = 'Detalles de Venta'