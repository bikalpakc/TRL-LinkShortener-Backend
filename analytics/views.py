from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from analytics.models import Click
from links.models import Link


class AnalyticsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, short_code):
        # 1. Get the link object based on the short_code
        try:
            link = Link.objects.get(short_code=short_code, user=request.user)
        except Link.DoesNotExist:
            return Response({'error': 'Link not found'}, status=status.HTTP_404_NOT_FOUND)
        
        from analytics.serializers import ClickSerializer

        # 2. Get all clicks for this link
        clicks = Click.objects.filter(link=link).order_by('-clicked_at')

        # 3. Serialize the click data
        serializer = ClickSerializer(clicks, many=True)

        # 4. Return the serialized data
        return Response(serializer.data)
    
    
class SummaryAnalyticsView(generics.GenericAPIView):
    """
    A view to get a quick summary of the particular short link (Total clicks, etc.)
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, short_code):
        print("SummaryAnalyticsView called for short_code:", short_code)
        link = get_object_or_404(Link, short_code=short_code, user=request.user)
        
        return Response({
            "short_code": link.short_code,
            "original_url": link.original_url,
            "total_clicks": link.clicks.count(),
            "created_at": link.created_at,
            "is_active": link.is_active
        })