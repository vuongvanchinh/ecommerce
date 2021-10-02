# Generated by Django 3.2.2 on 2021-08-07 04:13

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0010_alter_category_background_image'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='productvariant',
            options={'ordering': ('price',)},
        ),
        migrations.RemoveField(
            model_name='productimage',
            name='product_option_value',
        ),
        migrations.RemoveField(
            model_name='productvariant',
            name='option_values',
        ),
        migrations.AddField(
            model_name='productvariantoption',
            name='image_indexs',
            field=models.CharField(default=0, max_length=100, validators=[django.core.validators.int_list_validator]),
            preserve_default=False,
        ),
    ]