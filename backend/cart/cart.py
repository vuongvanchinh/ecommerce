from django.conf import settings
from product.models import Product
from decimal import Decimal

class Cart(object):

    def __init__(self, request):
        self.session = request.session
        print(self.session)
        cart = self.session.get(settings.CART_SESSION_ID)
        if not cart:
            cart = self.session[settings.CART_SESSION_ID] = {}
            print('not cart')
        self.cart = cart
        
    def add(self, product, variant, quantity=1, override_quantity=False):
        product_id = str(product.id)
        if product_id not in self.cart:
            self.cart[product_id] = {
                'quantity': 0,
                'variant': variant.id,
                'price': str(variant.price),
                'product_name': product.name,
                'variant_name': variant.combind_string
            }
            override_quantity = True
        if override_quantity:
            self.cart[product_id]['quantity'] = quantity
        else:
            self.cart[product_id]['quantity'] += quantity
        
        self.save()
    def save(self):
        self.session.modified = True
    
    def remove(self, product):
        product_id = str(product.id)
        if product_id in self.card:
            del self.card[product_id]
            self.save()
    def __iter__(self):

        product_ids = self.card.keys()
        products = Product.objects.filter(id__in=product_ids)
        cart = self.cart.copy()
        for p in products:
            cart[str(p.id)]['product'] = p
        for item in cart.values():
            item['price'] = Decimal(item['price'])
            yield  item

    def clear(self):
        del self.session[settings.CART_SESSION_ID]
        self.save()



