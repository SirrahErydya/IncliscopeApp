from django.urls import path
from . import views as demoviews
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('', demoviews.index, name='index'),
    path('survey/', demoviews.survey, name='survey'),
    path('submit_guess/<int:galaxy_id>', demoviews.submit_guess, name='submit_guess'),
    path('result/<int:galaxy_id>', demoviews.result, name='result')
]