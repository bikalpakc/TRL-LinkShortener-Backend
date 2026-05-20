from django.urls import path
from .views import AnalyticsView, SummaryAnalyticsView

urlpatterns = [
    path('<str:short_code>/summary/', SummaryAnalyticsView.as_view(), name='link-summary'),
    path('<str:short_code>/', AnalyticsView.as_view(), name='analytics'),
]