# Generated by Django 3.2.2 on 2021-06-04 15:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0004_auto_20210604_0648'),
    ]

    operations = [
        migrations.RenameField(
            model_name='productvariant',
            old_name='combind_sring',
            new_name='combind_string',
        ),
    ]
