from django.http import HttpResponse

def index(request):
    return HttpResponse("Oh hi there. Soon, there will be a lovely landing page that lets you navigate between the apps. But for now, let's just enter the links manually, shall we?")

