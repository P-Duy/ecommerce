from rest_framework import serializers
from .models import Product, Reviews


#  class CategorySerializer(serializers.ModelSerializer):
#      name = serializers.SerializerMethodField(read_only=True)

#     class Meta:
#         model = Category
#         fields = "__all__"


class ReviewSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField(source="user.avatar.url")
    user = serializers.SerializerMethodField(source="user.email")

    class Meta:
        model = Reviews
        fields = "__all__"

    def get_avatar(self, obj):
        return obj.user.avatar.url


class ProductSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = "__all__"

    def get_reviews(self, obj):
        reviews = obj.reviews_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data
