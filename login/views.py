from django.shortcuts import render
from models import Users,Hospitals
from django.http import JsonResponse


# Create your views here.
from django.http import HttpResponseRedirect, HttpResponse
import datetime
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def addUser(request):
	# print ("SEE THIS :-",str(request.POST.get('username')),"GOt NOTHING")
	if request.method=='GET':
		if(request.POST.get('type')=='donor'):
			print "Got the post req"
			print(request.POST.get('bday'))
			x=str(request.POST.get('bday'))
			x=x.split("-")
			print(x[2],x[0],x[2])
			x=datetime.date(int(x[2]),int(x[1]),int(x[0]))

			user = Users(
				username=str(request.POST.get('username')),
				password=str(request.POST.get('password')),
				first_name=str(request.POST.get('first_name')),
				last_name=str(request.POST.get('last_name')),
				email=str(request.POST.get('email')),
				address=str(request.POST.get('address')),
				city=str(request.POST.get('city')),
				state=str(request.POST.get('state')),
				country=str(request.POST.get('country')),
				dob=x,
				gender=str(request.POST.get('gender')),
				bg=str(request.POST.get('bg')),
				contact=str(request.POST.get('contact')))
			user.save()
		elif(request.POST.get('type')=='hospital'):
			user = Hospitals(
				username=str(request.POST.get('username')),
				password=str(request.POST.get('password')),
				cp1First_name=str(request.POST.get('cp1First_name')),
				cp1Last_name=str(request.POST.get('cp1Last_name')),
				cp1Contact=str(request.POST.get('cp1Contact'))
				)
			user.save()
		return HttpResponse("got")
	else :
		return HttpResponse("Not ")

@csrf_exempt
def login(request):
	print(request.POST.get('username'))
	username=str(request.POST.get('username'))
	password=str(request.POST.get('password'))
	
	if(Users.objects.filter(password=password, username=username).exists()):
		request.session['username'] = username
		name=request.session['username']
		return render(request, 'loggedin.html', {"username" : name})
	else:
		return HttpResponse("incorrect data")	

@csrf_exempt
def logout(request):
   try:
      del request.session['username']
   except:
      pass
   return render(request, 'home.html')


#@csrf_exempt
def req(request):
	return JsonResponse({'foo':'bar'})



		

# def login1(request):
#    username = 'not logged in'
   
#    if request.method == 'POST':
#       MyLoginForm = LoginForm(request.POST)
      
#       if MyLoginForm.is_valid():
#          username = MyLoginForm.cleaned_data['username']
#          request.session['username'] = username
#       else:
#          MyLoginForm = LoginForm()
			
#    return render(request, 'loggedin.html', {"username" : username})

# def formView(request):
#    if request.session.has_key('username'):
#       username = request.session['username']
#       return render(request, 'loggedin.html', {"username" : username})
#    else:
#       return render(request, 'login.html', {}) 
      
# def logout(request):
#    try:
#       del request.session['username']
#    except:
#       pass
#    return HttpResponse("<strong>You are logged out.</strong>")        	


