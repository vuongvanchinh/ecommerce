class OrderStatus:
    DRAFT = 'draft'  # fully editable, not finalized order created by staff users
    UNFULLFILL='unfullfill'
    UNCONFIRMED = (
        'unconfirmed'  # order created by customers when confirmation is required
    )
    CONFIRMED = 'confirmed'  # order has been admin confirm
    RETURNED = 'returned'  # order with all items marked as returned
    CANCELED = 'canceled'  # permanently canceled order
    SHIPPING = 'shipping'
    DELIVERRED = 'delivered'

    CHOICES = [
        (DRAFT, 'Draft'),
        (UNCONFIRMED, 'Unconfirmed'),
        (CONFIRMED, 'Comfirmed'),
        (RETURNED, 'Returned'),
        (SHIPPING, 'Shipping'),
        (DELIVERRED, 'Delivered'),
        (CANCELED, 'Canceled'),
        (UNFULLFILL, 'Unfullfill'),
    ]