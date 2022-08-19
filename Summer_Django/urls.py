"""Summer_Django URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
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
from new_app import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('hello/',views.hello_world),
    path('', views.index),
    path('user/',views.user),
    path('user/ajax_data/', views.ajax_data), #這個url 會導向ajax_data這個function
    path('web_data/',views.web_data),
    path('web_data/ajax/',views.web_data_ajax),
    path('gene_list/',views.gene_list),
    path('web_data/crawler/',views.crawler),
    path('web_data/output/',views.output)
]

