# Generated by Django 3.2.2 on 2021-08-07 04:19

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0012_productvariant_order'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productvariantoption',
            name='image_indexs',
            field=models.CharField(blank=True, max_length=100, validators=[django.core.validators.int_list_validator]),
        ),
    ]
