
from django.contrib import admin
from new_app import models

from new_app.models import Hw1Improve,Wormbase285,WormbaseGenetranscriptW285,TranscriptWbidType
from .models import User
# Register your models here.
    

class GeneAdmin(admin.ModelAdmin): #設定Gene介面的外觀
    list_display = ('gene_id','transcript_id','numbers')



class UserAdmin(admin.ModelAdmin):
    list_display = ('user_id','user_pass','user_content')


class GeneAdmin_wormbase285(admin.ModelAdmin): #設定Gene介面的外觀
    list_display = ('geneid','status','sequence','genename','othername')

class GeneAdmin_WormbaseGenetranscriptW285(admin.ModelAdmin): #設定Gene介面的外觀
    list_display = ('geneid','status','sequence','genename','othername','transcript','type','transcript_count')

class TranscriptWbidType_wb(admin.ModelAdmin):
    list_display = ('field1','transcript','wormbase_id','type')

admin.site.register(User, UserAdmin)
admin.site.register(Hw1Improve, GeneAdmin) #註冊Gene model
admin.site.register(Wormbase285, GeneAdmin_wormbase285) #註冊Gene model
admin.site.register(WormbaseGenetranscriptW285,GeneAdmin_WormbaseGenetranscriptW285)
admin.site.register(TranscriptWbidType,TranscriptWbidType_wb)
