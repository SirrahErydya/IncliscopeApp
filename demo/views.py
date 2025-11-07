from django.shortcuts import redirect
from django.http import HttpResponse
from django.template import loader
from demo.models import Galaxy
import random
import demo.incliscope_business as ib
import numpy as np
import json

# Create your views here.
def index(request):
    return redirect('survey')


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
    try:
        request.session['guess'] = float(inc_guess)
    except ValueError:
        return redirect('survey')
    return redirect('result', galaxy_id=galaxy_id)


def result(request, galaxy_id):
    galaxy = Galaxy.objects.get(id=galaxy_id)
    guess = request.session['guess']

    alphas = np.array(galaxy.pred_alpha)
    mus = np.array(galaxy.pred_mean)
    sigmas = np.array(galaxy.pred_std)
    pred_mean, var = ib.md_params(mus, sigmas, alphas)
    guess_diff = np.abs(galaxy.i_mean - guess)
    pred_diff = np.abs(galaxy.i_mean - pred_mean)
    beat_incliscope = guess_diff < pred_diff
    guess_pred_diff = np.abs(guess_diff - pred_diff)

    x = np.linspace(-5, 95, 400)
    n_pred = ib.mdg(x, mus, sigmas, alphas)
    n_gt = ib.pdf(x, galaxy.i_mean, galaxy.i_std)
    guess_idx = 0
    while True:
        if x[guess_idx] > guess:
            break
        guess_idx +=1
    max_y = np.max(n_pred)


    context = {
        'galaxy': galaxy,
        'guess': guess,
        'predicted_mean': pred_mean,
        'beat_incliscope': beat_incliscope,
        'guess_pred_diff': guess_pred_diff,
        'x_values': json.dumps(list(x)),
        'n_pred': json.dumps(list(n_pred)),
        'n_gt': json.dumps(list(n_gt)),
        'guess_idx': guess_idx,
        'max_y': max_y + 0.1

    }
    template = loader.get_template('demo/result.html')
    return HttpResponse(template.render(context, request))
