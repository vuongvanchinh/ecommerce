from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Coupon',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=100)),
                ('type', models.CharField(choices=[('freeship', 'freeship'), ('direct deduction', 'direct deduction'), ('percentage deduction', 'percentage deduction')], default='direct deduction', max_length=50)),
                ('description', models.CharField(max_length=255)),
                ('valid_from', models.DateTimeField()),
                ('valid_to', models.DateTimeField()),
                ('active', models.BooleanField(default=False)),
                ('discount', models.DecimalField(decimal_places=1, max_digits=8)),
                ('min_order_value', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
            ],
        ),
    ]