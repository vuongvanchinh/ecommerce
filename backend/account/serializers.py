from rest_framework import serializers
from .models import User, Address
from drf_extra_fields.fields import Base64ImageField


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'
        extra_fields = {
            "postal__code": {"required": False},
            "user": {"required": False}
        }

class UserSerializer(serializers.ModelSerializer):
    address = AddressSerializer(many=True, required=False)
    avatar = Base64ImageField()
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name',
                'last_name', 'address', 'avatar', 'phone','is_active', 'is_staff', 'note',
                'last_login'
                ]
                
        read_only_fields = ['last_login', 'id']

    def update(self, instance, validated_data):
        address = validated_data.pop('address', None)
        instance = super().update(instance, validated_data)
        if address:
            address=address[0]
            # print(address)
            if Address.objects.filter(user=instance).exists():
                Address.objects.filter(user=instance).update(**address)
            else:
                # address.user = instance.id
                Address.objects.create(user=instance, **address)
        return instance
    
    def create(self, validated_data):
        address = validated_data.pop('address', None)
        instance = super().create(validated_data)
        if address:
            address=address[0]
            Address.objects.create(user=instance, **address)
        return instance

        
class UserLoginForm(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(max_length=255)
    
