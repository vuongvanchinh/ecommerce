from . import OrderStatus

def getOrderData(data, request):
    for i in range(len(data['items'])):
        img = data['items'][i]['image']
        if img:
            data['items'][i]['image'] = request.build_absolute_uri(img)
    return data

def cancel(order):
    if order and order.status in (OrderStatus.UNCONFIRMED, OrderStatus.SHIPPING):
        order.status = OrderStatus.CANCELED
        for item in order.items.all():
            v = item.variant
            v.quantity_in_stock = v.quantity_in_stock + item.quantity
            v.save()
        order.save()
        return True
    return False

def confirmed(order):
    if order.status in (OrderStatus.UNCONFIRMED, ):
        order.status = OrderStatus.SHIPPING
        order.save()
        return True
    return False

def unconfirmed(order):
    if order.status in (OrderStatus.SHIPPING, ):
        order.status = OrderStatus.UNCONFIRMED
        order.save()
        return True
    return False

def delivered(order):
    if order.status in (OrderStatus.SHIPPING, ):
        order.status = OrderStatus.DELIVERRED
        order.save()
        return True
    return False

def returned(order):
    if order.status in (OrderStatus.SHIPPING, OrderStatus.DELIVERRED ):
        order.status = OrderStatus.RETURNED
        order.save()
        return True
    return False
