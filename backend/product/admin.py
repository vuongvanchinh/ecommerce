from django.contrib import admin
from .models import Product, ProductImage, ProductVariant, ProductVariantOption, ProductVariantCriterion

# Register your models here.
class ProductImageInline(admin.TabularInline):
    model = ProductImage

class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
   

class ProductVariantOptionAdmin(admin.StackedInline):
    model = ProductVariantOption

class ProductVariantCriterionAdmin(admin.TabularInline):
    model = ProductVariantCriterion
    inlines = [ProductVariantOptionAdmin]

class ProductAdmin(admin.ModelAdmin):
    # list_display = '__all__'
    inlines = [ProductImageInline,ProductVariantCriterionAdmin, ProductVariantInline]



admin.site.register(Product, ProductAdmin)
admin.site.register(ProductVariantOption)
admin.site.register(ProductImage)