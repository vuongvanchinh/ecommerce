class CouponType:
    FREESHIP = 'freeship'
    DIRECT_DEDUCTION = 'direct deduction'
    PERCENTAGE_DEDUCTION = 'percentage deduction'

    CHOICES = [
        (FREESHIP, 'freeship'),
        (DIRECT_DEDUCTION, 'direct deduction'),
        (PERCENTAGE_DEDUCTION, 'percentage deduction')
    ]
    
