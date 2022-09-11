from django.contrib import admin
from new_app import models
from new_app.models import Hw1Improve
from .models import User
# Register your models here.
    

class GeneAdmin(admin.ModelAdmin): #設定Gene介面的外觀
    list_display = ('gene_id','transcript_id','numbers')



class UserAdmin(admin.ModelAdmin):
    list_display = ('user_id','user_pass','user_content')
    
admin.site.register(User, UserAdmin)
admin.site.register(Hw1Improve, GeneAdmin) #註冊Gene model