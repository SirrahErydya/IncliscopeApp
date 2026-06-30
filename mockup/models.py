from django.db import models


# Create your models here.
class Galaxy(models.Model):
    name = models.CharField(max_length=32)
    image = models.ImageField(upload_to='demodata')
    i_mean = models.FloatField()
    i_std = models.FloatField()
    pred_mean = models.JSONField()
    pred_std = models.JSONField()
    pred_alpha = models.JSONField()
