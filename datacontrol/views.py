from django.shortcuts import render
from django.template import loader
from django.http import HttpResponse
from .models import Galaxy
import random

# Create your views here.
def overview(request):
    # Get 9 random galaxies from the database
    # or all of them, if there are less than 9
    if len(Galaxy.objects.all()) < 9:
        galaxies = list(Galaxy.objects.all())
    else:
        all_galaxies = list(Galaxy.objects.all())
        galaxies = random.sample(all_galaxies, 9)
    template = loader.get_template('datacontrol/landing_page.html')
    context = {'galaxies': galaxies}
    return HttpResponse(template.render(context, request))