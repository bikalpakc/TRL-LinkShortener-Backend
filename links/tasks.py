from celery import shared_task
from django.utils import timezone
from .models import Link

@shared_task
def deactivate_expired_links():
    now = timezone.now()
    # Find links that are active but have passed their expiry date
    expired_links = Link.objects.filter(is_active=True, expires_at__lt=now)
    
    count = expired_links.count()
    expired_links.update(is_active=False)
    
    return f"Deactivated {count} expired links."