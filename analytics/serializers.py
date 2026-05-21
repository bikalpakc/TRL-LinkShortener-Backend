from analytics.models import Click
from rest_framework import serializers


class ClickSerializer(serializers.ModelSerializer):
    class Meta:
        model = Click
        fields = ['id', 'link', 'clicked_at', 'ip_address', 'browser', 'device_type', 'referrer']