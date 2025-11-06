from django.shortcuts import redirect
from django.http import HttpResponse
from django.template import loader
from demo.models import Galaxy
import random

# Create your views here.
def index(request):
    return HttpResponse("Hello. There was no time for a landing page. Please use the URLs directly like a boss.")


def survey(request):
    galaxies = list(Galaxy.objects.all())
    random_galaxy = random.choice(galaxies)
    context = {
        'galaxy': random_galaxy
    }
    template = loader.get_template('demo/survey.html')
    return HttpResponse(template.render(context, request))


def submit_guess(request, galaxy_id):
    data = request.POST
    inc_guess = data['guess']
    request.session['guess'] = float(inc_guess)
    return redirect('result', galaxy_id=galaxy_id)

def result(request, galaxy_id):
    galaxy = Galaxy.objects.get(id=galaxy_id)
    guess = request.session['guess']
    context = {
        'galaxy': galaxy,
        'guess': guess
    }
    template = loader.get_template('demo/result.html')
    return HttpResponse(template.render(context, request))
