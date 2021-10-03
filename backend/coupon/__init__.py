


class CouponType:
    FREESHIP = 'freeship'
    DIRECT_DEDUCTION = 'direct deduction'
    PERCENTAGE_DEDUCTION = 'percentage deduction'
    PROMOTION_PAYMENT_METHOD = 'promotion payment method'
    
    CHOICES = [
        (FREESHIP, 'freeship'),
        (DIRECT_DEDUCTION, 'direct deduction'),
        (PERCENTAGE_DEDUCTION, 'percentage deduction'),
        (PROMOTION_PAYMENT_METHOD, 'promotion payment method')
    ]
    
