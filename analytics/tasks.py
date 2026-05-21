from celery import shared_task
from .models import Click
from links.models import Link
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from user_agents import parse

@shared_task
def record_click(link_id, ip_address, user_agent, referrer):
    try:
        link = Link.objects.get(id=link_id)
        # Here we can also add logic to detect country from IP. 

        # Parsing the raw user agent string
        ua = parse(user_agent)
        
        # 1. Getting the Browser (Chrome, Firefox, etc.)
        browser_name = ua.browser.family 
        print(f"Parsed Browser: {browser_name}")
        
        # 2. Getting the OS (Windows, iOS, Android)
        os_name = ua.os.family 
        print(f"Parsed OS: {os_name}")

        # 3. Getting the Hardware Model
        # For PC, this is usually "Other". For mobile, it's "iPhone" or "Pixel 6"
        device_model = ua.device.model if ua.device.model else ""
        device_brand = ua.device.brand if ua.device.brand else ""
        
        # Constructing a "Friendly" Device Name
        if ua.is_pc:
            full_device_name = f"{os_name} PC"
            print(f"Parsed User Agent: {full_device_name} using {browser_name}")
        else:
            # e.g., "iOS (Apple iPhone)" or "Android (Samsung SM-G998B)"
            full_device_name = f"{os_name} ({device_brand} {device_model})".strip()
            print(f"Parsed User Agent: {full_device_name} using {browser_name}")

        Click.objects.create(
            link=link,
            ip_address=ip_address,
            browser=browser_name,
            device_type=full_device_name,
            referrer=referrer
        )

        # --- BROADCAST TO WEBSOCKET ---
        channel_layer = get_channel_layer()
        user_group = f"user_{link.user.id}"
        total_clicks = link.clicks.count()

        async_to_sync(channel_layer.group_send)(
            user_group,
            {
                "type": "click_update", # This matches the method name in consumers.py
                "link_id": link.id,
                "total_clicks": total_clicks
            }
        )
        return f"Recorded and Broadcasted for link with id: {link_id}"
    except Link.DoesNotExist:
        return "Link not found"