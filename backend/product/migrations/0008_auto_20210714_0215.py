# Generated by Django 3.2.2 on 2021-07-14 02:15

import core.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0007_auto_20210713_1023'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='productvariantcriterion',
            options={'ordering': ('order',)},
        ),
        migrations.AlterModelOptions(
            name='productvariantoption',
            options={'ordering': ('order',)},
        ),
        migrations.AddField(
            model_name='productimage',
            name='order',
            field=core.fields.OrderField(blank=True, default=0),
            preserve_default=False,
        ),
    ]