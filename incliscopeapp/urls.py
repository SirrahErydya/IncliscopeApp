"""
URL configuration for incliscopeapp project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from demo import views as demoviews
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', demoviews.index, name='index'),
    path('survey/', demoviews.survey, name='survey'),
    path('submit_guess/<int:galaxy_id>', demoviews.submit_guess, name='submit_guess'),
    path('result/<int:galaxy_id>', demoviews.result, name='result')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
