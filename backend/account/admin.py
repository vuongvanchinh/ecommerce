from django.contrib import admin

# Register your models here.
from .models import Address, User

admin.site.register(Address)
admin.site.register(User)