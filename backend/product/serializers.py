from rest_framework import serializers
from drf_extra_fields.fields import Base64ImageField
from .models import (Category, Product, ProductImage, ProductVariant, ProductVariantCriterion,
                     ProductVariantOption)
from django.core.cache import cache
from .constant import Constant
from core.utils import standard_string


class CategorySerializer(serializers.ModelSerializer):
    
    background_image = Base64ImageField()

    class Meta:
        model = Category
        fields = '__all__'
        # lookup_fields = 'slug'
        extra_kwargs = {
           "backfround_image": {"required": False}
        }
    # def update(self, instance, validated_data):
    #     print(validated_data)
    #     return super(CategorySerializer, self).update(instance, validated_data)

class ProductImageSerializer(serializers.ModelSerializer):
    image = Base64ImageField()
    class Meta:
        model = ProductImage
        fields = ['id','image', 'product', 'order']
        extra_kwargs = {
            'product': {'write_only': True, 'required': False},
            'order': {"required": False},
            'image': {"required": False},
        }

class ProductVariantOptionSerializer(serializers.ModelSerializer):
    # images = ProductImageSerializer(many=True, required=False)
    class Meta:
        model = ProductVariantOption
        fields = ['id','option_name', 'order', 'criterion', 'image_indexs']
        extra_kwargs = {'criterion': {'required': False, 'write_only':True}}

class ProductVariantCriterionSerializer(serializers.ModelSerializer):
    options = ProductVariantOptionSerializer(many=True)
    class Meta:
        model = ProductVariantCriterion
        fields = ['id', 'criterion_name', 
            'order', 'product', 'options']
        read_only_fields = ['product']
        extra_kwargs = {'product': {'required': False}}

    def create(self, validated_data):
        options = validated_data.pop('options', [])
        criterion = ProductVariantCriterion.objects.create(**validated_data)
        for option in options:
            ProductVariantOption.objects.create(criterion=criterion, **option)
        
        return criterion
        # extra_kwargs = {'id': {'read_only': False, 'required': False}}
    

class ProductVariantSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductVariant
        fields = ['id', 'combind_string' ,'product', 'sku', 'price', 'quantity_in_stock', 'order']
        read_only_fields = ['product']

        
class ProductSerializer(serializers.ModelSerializer):
    criterions = ProductVariantCriterionSerializer(many=True, required=False)
    variants = ProductVariantSerializer(many=True, required=False)
    images = ProductImageSerializer(many=True, required=False)
    publication_date = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S", required=False)
    class Meta:
        model = Product
        fields = ['id','name','description','slug',
                'seo_title', 'seo_description',
                'price','cost','weight', 'rating',
                'category','criterions', 'variants', 'images',
                'publication_date', 'is_published'
        ]
        read_only_fields=['updated_at']
        
    def create(self, validated_data):
        # print("Create function:", validated_data)
        criterions = validated_data.pop('criterions', [])
        images = validated_data.pop('images', [])
        variants = validated_data.pop('variants', [])

        product = Product.objects.create(**validated_data)
        cache.delete(Constant.PRODUCT_CACHE_KEY)

        for criterion in criterions:
            options = criterion.pop('options',[])
            product_criterion = ProductVariantCriterion.objects.create(product_id=product.id, **criterion)
            for option in options:
                ProductVariantOption.objects.create(criterion = product_criterion, **option)
        for i in range(len(images)):
            # images[i].product = 3
            # print(images[i])
            ProductImage.objects.create(product=product, **images[i])

        for v in variants:
           ProductVariant.objects.create(product=product, **v)

        return product
    
    # def update(self, instance, validated_data):
    #     print(validated_data)
    #     return instance

    


#read only serializer (client side)
class CriterionSeializer(serializers.ModelSerializer):
    options = serializers.SerializerMethodField()

    class Meta:
        model = ProductVariantCriterion
        fields = ['criterion_name', 'options']

    def get_options(self, instance):
        options = []
        for o in instance.options.all():
            indexs = o.image_indexs
            print(indexs)
            try:
                indexs = list(map(int, standard_string(indexs).split(' ')))
            except:
                indexs = []
            t = {"option_name": o.option_name, "images": indexs}
            options.append(t)
        return options


        
class ProductReadOnlySerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    criterions = CriterionSeializer(many=True)
    variants = ProductVariantSerializer(many=True)
    category = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id','name','description','slug',
                'seo_title', 'seo_description',
                'price','weight', 'rating',
                'category','criterions', 'variants', 'images',
                'publication_date', 'is_published'
        ]

    def get_images(self, instance):
        request = self.context.get('request')
        print(self.context)
        images = []
        for img in instance.images.all():
            images.append(request.build_absolute_uri(img.image.url))
        return images
    def get_category(self, instance):
        category = instance.category

        return {"name": category.name, "slug": category.slug}

class ProductCartSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    criterions = CriterionSeializer(many=True)
    variants = ProductVariantSerializer(many=True)
    class Meta:
        model = Product
        fields = ['id','name','slug',
                'criterions', 'variants', 'images',
        ]

    def get_images(self, instance):
        request = self.context.get('request')
        images = []
        for img in instance.images.all():
            images.append(request.build_absolute_uri(img.image.url))
        return images

class ProductListSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = ['id','name','slug', 
                'price', 'rating',
                'images','category'
        ]

    def get_images(self, instance):
        request = self.context.get('request')
      
        images = []
        for img in instance.images.all():
            images.append(request.build_absolute_uri(img.image.url))
        return images
    
    def get_category(self, instance):
        category = instance.category

        return {"name": category.name, "slug": category.slug}