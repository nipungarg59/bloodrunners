from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.http import HttpResponseRedirect, HttpResponse
from login.models import *
from geopy.distance import vincenty
from urllib2 import urlopen
import json

