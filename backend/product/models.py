from django.db import models
from core.fields import OrderField
from django.core.validators import MaxLengthValidator, int_list_validator


# Create your models here.
class SeoModel(models.Model):
    seo_title = models.CharField(
        max_length=70, blank=True, null=True, validators=[MaxLengthValidator(70)]
    )
    seo_description = models.CharField(
        max_length=300, blank=True, null=True, validators=[MaxLengthValidator(300)]
    )
    class Meta:
        abstract = True


class Category(SeoModel):
    name = models.CharField(max_length=150, unique=True, null=False)
    description = models.TextField(blank=True, null=True)
    background_image = models.ImageField(upload_to='category_background',null=True, blank=True)
    parent = models.ForeignKey('self', related_name='childrens', on_delete=models.SET_NULL, null=True)
    slug = models.SlugField(max_length=255, unique=True, allow_unicode=True)
    class Meta:
        ordering = ('name', )
    
    def __str__(self):
        
        return self.name
    

    def products(self):
        products = Product.objects.filter(category=self)
        for i in self.childrens:
            pass
        return products

class Product(SeoModel):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=255, null=False)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    slug = models.SlugField(max_length=255, unique=True, allow_unicode=True)
    description = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    weight = models.IntegerField(default=1) # unit is gam
    rating = models.FloatField(null=True, blank=True, default=0)
    
    publication_date = models.DateTimeField(blank=True, null=True)
    is_published = models.BooleanField(default=False)
    # quantity_in_stock = models.PositiveIntegerField(default=0)
    class Meta:
        ordering = ('name',)
    
    def __str__(self):
        return self.name + " Id: " + str(self.id)

class ProductVariantCriterion(models.Model):
    product = models.ForeignKey(Product, related_name='criterions', on_delete=models.CASCADE)
    criterion_name = models.CharField(max_length=50)
    order = OrderField(blank=True, for_fields=['product'], null=True)
    def __str__(self):
        return f'{self.criterion_name} of {self.product.name}'

    class Meta:
        ordering = ('order',)
        
class ProductVariantOption(models.Model):
    criterion = models.ForeignKey(ProductVariantCriterion, related_name='options', on_delete=models.CASCADE)
    option_name = models.CharField(max_length=50)
    order = OrderField(blank=True, for_fields=['criterion'])
    image_indexs = models.CharField(validators=[int_list_validator], max_length=100, blank=True)

    def __str__(self):
        return f'{self.option_name} of {self.criterion.__str__()} id: {self.id}'
    class Meta:
        ordering = ('order',)

class ProductVariant(models.Model):
    product = models.ForeignKey(Product, related_name='variants', on_delete=models.CASCADE)
    sku = models.CharField(max_length=30)
    price = models.DecimalField(max_digits=10,decimal_places=2)
    quantity_in_stock = models.PositiveIntegerField(default=0)
    combind_string = models.CharField(max_length=80) #red-m, red-l, green-m, green-l ...
    order = OrderField(blank=True, for_fields=['product'])
    # option_values = models.ManyToManyField(ProductVariantOption, related_name='variants')
    class Meta:
        ordering = ('order',)
    def __str__(self):
        return f'{self.product.name}-{self.combind_string}'
        
class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images',
                            on_delete=models.CASCADE, null=True)
    image = models.ImageField(upload_to='product-images', blank=True, null=True)
    order = OrderField(blank=True, for_fields=['product'])
   
    def __str__(self):
        return self.image.url + str(self.id)
