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
from django.urls import path,re_path
from new_app import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('hello/',views.hello_world),
    path('', views.index),
    #gene list
    path('gene_list/',views.gene_list),
    #user
    path('user/',views.user),
    path('user/ajax_data/', views.ajax_data), #這個url 會導向ajax_data這個function
    #web_data with only geneid <-> transcript
    path('web_data/',views.web_data),
    path('web_data/ajax/',views.web_data_ajax),
    path('web_data/output/crawler/',views.crawler),
    #searching
    path('searching/ajax/',views.searching_ajax),      
    path('searching/',views.searching),
    #duplicate
    path('duplicate/',views.duplicate_check),
    path('duplicate/duplicate_check_ajax/',views.duplicate_ajax),
    #pirscan
    path('pirscan/pirscan_ajax/',views.pirscan_ajax), #call pirscan_auto js when clicking button from transcript geneid genename
    #transcript geneid genename
    path('transcriptgene/',views.transcript_geneid_genename),
    path('transcriptgene/transcriptgene__ajax/',views.transcript_geneid_genename_ajax),
    # browser
    path('browser/',views.browser),
    path('browser/browser_ajax/',views.browser_ajax),
    #dinamic
        #for any clicking link that will lead to web_data/output/transcriptname website
    re_path(r'web_data/output/(?P<pk>.+)',views.output),
    re_path(r'searching/output/(?P<pk>.+)',views.output),
         #for button in transcript geneid genename website
    re_path(r'pirscan/(?P<pk>.+)',views.pirscan_output),

    
]
