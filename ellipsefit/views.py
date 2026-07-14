from django.shortcuts import render
from explorer.models import Galaxy

# Create your views here.
def ellipsefit(request, galaxy_id):
    galaxy = Galaxy.objects.get(id=galaxy_id)
