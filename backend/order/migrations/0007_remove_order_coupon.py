# Generated by Django 3.2.2 on 2021-10-01 15:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0006_order_coupon'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='coupon',
        ),
    ]
