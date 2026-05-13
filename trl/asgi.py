import os
from django.core.asgi import get_asgi_application

# 1. Set the settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'trl.settings')

# 2. Initialize the Django ASGI application FIRST
# This triggers django.setup() internally and loads the app registry
django_asgi_app = get_asgi_application()

# 3. NOW it is safe to import your middleware and routing
from channels.routing import ProtocolTypeRouter, URLRouter
from users.middleware import JWTAuthMiddleware #Importing the custom JWT middleware instead of the default AuthMiddlewareStack.
import analytics.routing


application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JWTAuthMiddleware(
        URLRouter(
            analytics.routing.websocket_urlpatterns
        )
    ),
})