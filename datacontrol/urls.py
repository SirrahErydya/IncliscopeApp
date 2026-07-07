from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import views
from datacontrol import views as dviews

urlpatterns = [
    path('', views.overview, name='index'),
    path('galaxy/<int:galaxy_id>/<int:traditional>', views.galaxy, name='galaxy')
]