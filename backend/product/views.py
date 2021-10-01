
from rest_framework import  status, viewsets, mixins
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.decorators import api_view

from .models import (Category, Product, ProductImage, ProductVariant,
                            ProductVariantCriterion, ProductVariantOption)

from .serializers import (CategorySerializer, ProductListSerializer, ProductReadOnlySerializer, ProductSerializer,
                          ProductVariantCriterionSerializer,
                          ProductVariantOptionSerializer,
                          ProductVariantSerializer,
                          ProductImageSerializer)
from django.core.cache import cache
from .constant import Constant
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from core.utils import deleteCache

from product import serializers


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUser]
    
    # @method_decorator(cache_page(120, key_prefix=Constant.CATEGORY_CACHE_PAGE_KEY))
    def list(self, request, *args, **kwargs):
        print('call category list')
        categories = cache.get(Constant.CATEGORY_CACHE_KEY)
        if not categories:
            categories = list(Category.objects.all())
            cache.set(Constant.CATEGORY_CACHE_KEY, categories)
        
        serializer = CategorySerializer(categories, many=True)
        data = serializer.data
        
        for i in range(len(data)):
            data[i]['background_image'] = request.build_absolute_uri(data[i]['background_image'])
        return Response(data=data)

    def create(self,  request):
        data = request.data
        bgimage = data.get('background_image', '')
        if not bgimage  or not bgimage.startswith('data:'):
            data.pop('background_image', None)
        
        serializer = CategorySerializer(data=data, partial=True)
        if (serializer.is_valid()):
            c = serializer.save()
            deleteCache(prefix=Constant.CATEGORY_CACHE_PAGE_KEY, key=Constant.CATEGORY_CACHE_KEY)
            data = serializer.data
            if c.background_image:
                data['background_image'] = request.build_absolute_uri(data['background_image'])
            return Response(data, status=status.HTTP_201_CREATED)

        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self,  request, pk):
        c = Category.objects.get(id=pk)
        data = request.data
        bgimage = data.get('background_image', '')
        if not bgimage  or not bgimage.startswith('data:'):
            data.pop('background_image', None)
        
        serializer = CategorySerializer(instance=c, data=data, partial=True)
        if (serializer.is_valid()):
            serializer.save()
            deleteCache(prefix=Constant.CATEGORY_CACHE_PAGE_KEY, key=Constant.CATEGORY_CACHE_KEY)
            data = serializer.data
            if c.background_image:
                data['background_image'] = request.build_absolute_uri(data['background_image'])
            return Response(data, status=status.HTTP_201_CREATED)

        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        deleteCache(prefix=Constant.CATEGORY_CACHE_PAGE_KEY, key=Constant.CATEGORY_CACHE_KEY)
        return self.delete(request, pk)

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            permission_classes = [AllowAny]
        else: 
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class ProductAdminViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]

    def list(self, request):
        products = cache.get(Constant.PRODUCT_CACHE_KEY)
        if not products:
            products = list(Product.objects.all())
            cache.set(Constant.PRODUCT_CACHE_KEY, products)
            print('miss')
        else: print('hit')
        serializer = ProductSerializer(products, many=True)
        # deleteCache(prefix=Constant.PRODUCT_CACHE_PAGE_KEY)
        
        data = serializer.data
        for i in range(len(data)):
            # print(data[i]['images'])
            for j in range(len(data[i]['images'])):
                data[i]['images'][j]['image'] = request.build_absolute_uri(data[i]['images'][j]['image'])
        return Response(data)

    def update(self, request, pk):
        product = Product.objects.get(id=pk)
        if not product:
            return Response(status=status.HTTP_404_NOT_FOUND)
        data = request.data
        images = data.pop('images', [])
        variants = data.pop('variants', [])
        criterions = data.pop('criterions', [])
        publication_date = data.pop('publication_date', None)
        
        change_image = data.pop('change_image', False)
        change_classify = data.pop('change_classify', False)
        change_variant = data.pop('change_variant', False)
        # print(change_image, change_classify, change_variant)
        serializer = ProductSerializer(instance=product, data=data, partial=True)
        if serializer.is_valid():
            if change_image:
                # print("change Image")
                update_images(product, images)

            if change_classify:
                update_classify(product, criterions)
            if(change_variant or change_classify): 
                old_variants = product.variants.all()
                delete_variants = {item.id:item for item in old_variants}
                for variant in variants:
                    id_v = variant.get('id', None)
                    if id_v is not None:
                        delete_variants.pop(id_v, None)
                        ProductVariant.objects.filter(id=id_v).update(**variant)
                    else:
                        ProductVariant.objects.create(product=product, **variant)
                for item in delete_variants.values():
                    item.delete()

            serializer.save()
            deleteCache(prefix=Constant.PRODUCT_CACHE_PAGE_KEY, key=Constant.PRODUCT_CACHE_KEY)
            
            data = serializer.data
            if (data.get('images', None)):# build url images
                for i in range(len(data['images'])):
                    data['images'][i]['image'] = request.build_absolute_uri(data['images'][i]['image'])
            return Response(data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        deleteCache(prefix=Constant.PRODUCT_CACHE_PAGE_KEY, key=Constant.PRODUCT_CACHE_KEY)
        return self.delete(request, pk)

    # def get_permissions(self):
    #     if self.action in ('list, retrieve'):
    #         permission_classes = [AllowAny]
    #     else:
    #         permission_classes = [IsAdminUser]

    #     return [permission() for permission in permission_classes]

class ProductAPIView(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = Product.objects.filter(is_published=True)
    list_serializer_class = ProductListSerializer
    permission_classes = [AllowAny]

    lookup_field = 'slug'
    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.ProductListSerializer
        if self.action == 'retrieve':
            return serializers.ProductReadOnlySerializer
        return serializers.Default # I dont' know what you want for create/destroy/update.                
    
    # def get(self, request):
    #     products = cache.get(Constant.PRODUCT_CACHE_KEY)
    #     if not products:
    #         products = list(Product.objects.all())
    #         cache.set(Constant.PRODUCT_CACHE_KEY, products)
    #         print('miss')
    #     else: print('hit')
    #     serializer = ProductReadOnlySerializer(products, many=True, context={'request': request})
    #     data = serializer.data
    #     return Response(data)
    

    


@api_view(http_method_names=['GET'])
def getRecommendProducts(request, slug):
    product = Product.objects.get(slug=slug)
    if not product:
        return Response(status=status.HTTP_404_NOT_FOUND)
    res = Product.objects.filter(is_published=True).exclude(slug=slug)
    data = ProductListSerializer(res, context={'request': request}, many=True).data
   
    return Response(data)

def update_images(product, images):
    old_images = product.images.all()
    delete_items = {item.id: item for item in old_images}
    new_len = len(images)
    for i in range(new_len):
        img_id = images[i].get('id', None)
        img = images[i].get('image', '')
        if (img_id is None):#create new
            images[i]['product'] = product.id
            s_image = ProductImageSerializer(data=images[i])
            if s_image.is_valid():
                s_image.save()
        else:#update exist images
            img_instance = delete_items.pop(img_id, None)
            # print(img_instance)
            if img_instance:
                if not img.startswith('data'):#old data
                    images[i].pop('image', None)
                s_image = ProductImageSerializer(instance=img_instance,
                                            data=images[i], partial=True)
                if s_image.is_valid():
                    s_image.save()
    for item in delete_items.values():
        item.delete()

def update_classify(product, criterions):
    old_criterions = product.criterions.all()
    delete_criterions = {item.id:item for item in old_criterions}
    for i in range(len(criterions)):
        c_id = criterions[i].get('id', None)
        new_options = criterions[i].pop('options', [])
        if c_id is None:#create new criterion
            criterions[i].pop('product', None)
            criterion = ProductVariantCriterion.objects.create(product=product, **criterions[i])
            for option in new_options:# create new options 
                ProductVariantOption.objects.create(criterion=criterion, **option)
        else:#update exist criterion
            cri_instance = delete_criterions.pop(c_id, None)
            cri_serializer = ProductVariantCriterionSerializer(instance=cri_instance, data=criterions[i], partial=True)
            if cri_serializer.is_valid():
                old_options = cri_instance.options.all()
                delete_options = {item.id: item for item in old_options}
                for option in new_options:
                    id_o = option.get('id', None)
                    if id_o is None: #create new option
                        ProductVariantOption.objects.create(criterion=cri_instance, **option)
                    else:#update exist option
                        ProductVariantOption.objects.filter(id=id_o).update(**option)
                        delete_options.pop(id_o, None)
                        
                for item in delete_options.values():
                    item.delete()
                cri_serializer.save()
    for item in delete_criterions.values():
        item.delete()
