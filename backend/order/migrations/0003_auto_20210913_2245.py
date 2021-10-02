# Generated by Django 3.2.2 on 2021-09-13 15:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0017_product_cost'),
        ('order', '0002_auto_20210811_1157'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderitem',
            name='product',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='items', to='product.product'),
        ),
        migrations.AlterField(
            model_name='order',
            name='city',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='order',
            name='commune',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='order',
            name='detail_address',
            field=models.CharField(blank=True, max_length=150, null=True),
        ),
        migrations.AlterField(
            model_name='order',
            name='district',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='order',
            name='name',
            field=models.CharField(blank=True, max_length=150, null=True),
        ),
        migrations.AlterField(
            model_name='order',
            name='phone',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(choices=[('draft', 'Draft'), ('unconfirmed', 'Unconfirmed'), ('confirmed', 'Comfirmed'), ('returned', 'Returned'), ('shipping', 'Shipping'), ('delivered', 'Delivered'), ('canceled', 'Canceled'), ('unfullfill', 'Unfullfill')], default='draft', max_length=50),
        ),
    ]