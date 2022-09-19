#from msilib import sequence
from django.shortcuts import render,redirect
from django.http import HttpResponse
from datetime import datetime
import pandas as pd
import numpy as np
from .models import Hw1Improve,User
import json
import re
from .wormbase import wormbase_crawler,wormbase_searching
from new_app import form
from django.db import connection
from django.http import JsonResponse
# Create your views here.

def hello_world(request):
    time = datetime.now()
    return render(request,'hello_world.html',locals())# used locals()包成區域變數 傳入dicts
'=====================================output======================================================'
def crawler(request):
    '''
    sequence_fin for unspliced sequence 
    spliced_fin for spliced sequence 
    exon_intron for unspliced table 
    exon for spliced sequence 
    protein for protein sequence 
    title_spliced for spliced title(for arange)
    title for unspliced title(for arange) 
    protein_title for protein title(for arange)
    '''
    input = request.POST['transcript']
    spliced_fin,sequence_fin,exon_intron,exon,protein = wormbase_crawler(transcript= input)
    #print(sequence_fin)
    exon_intron_type = exon_intron['type'].to_json(orient='records')
    exon_intron_start = exon_intron['start'].to_json(orient='records')
    exon_intron_stop = exon_intron['stop'].to_json(orient='records')
    exon_type = exon['type'].to_json(orient='records')
    exon_start = exon['start'].to_json(orient='records')
    exon_stop = exon['stop'].to_json(orient='records')
    title_spliced =list(range(1,len(spliced_fin),50))
    title = list(range(1,len(sequence_fin),50))
    protein_title = list(range(1,len(protein),50))
    #print(protein_title)
    response = {
        'spliced_fin':spliced_fin,
        'title' : title,
        'sequence_fin' : sequence_fin,
        'exon_intron_type':exon_intron_type,
        'exon_intron_start':exon_intron_start,
        'exon_intron_stop':exon_intron_stop,
        'exon_type':exon_type,
        'exon_start':exon_start,
        'exon_stop':exon_stop,
        'title_spliced':title_spliced,
        'protein_title':protein_title,
        'protein':protein

    }
    return JsonResponse(response)
    
def web_data(request):

    return render(request,'web_data.html',locals())
def web_data_ajax(request):
    input = request.POST['gene_id']
    input = input.replace(' ','') #將空格消去避免查找值時候因為空格而有影響
    try:
        gene = Hw1Improve.objects.get(gene_id = input)
        transcript = gene.transcript_id
        numbers = gene.numbers
        Gene_ID = gene.gene_id
        '''
        transcript_ls = list(transcript.split(','))
        transcript_ls[0] = transcript_ls[0].replace('[','')
        transcript_ls[len(transcript_ls)-1] = transcript_ls[len(transcript_ls)-1].replace('[','')
        transcript_ls = list_to_queryset(transcript_ls)
        #print(transcript_ls)  
        '''
        message = 'Gene_ID:'+ Gene_ID
        #message = 'Transcript ID: ' + transcript + '<br>Numbers: ' + str(numbers)
        
    except Exception as e:
        try:
            gene_all = Hw1Improve.objects.values('transcript_id') ## 讀取如果transcripts存在於gene_ID的分類內，則抓取該gene_ID欄位
            for transcript in gene_all:
                for value in transcript.values():
                    if input in value:
                        gene = Hw1Improve.objects.get(transcript_id = value)
                        break
                else:
                    continue
                break
            transcript = gene.transcript_id
            numbers = gene.numbers
            Gene_ID = gene.gene_id
            #print(gene)
            message = 'Gene_ID:'+ Gene_ID
        except:
            message = 'Something wrong, please check again.'

    response = {
        'message': message,
        'Gene_ID':Gene_ID,
        'transcript':transcript,
        "numbers":numbers
    }
    return JsonResponse(response)

def output(request,pk):
    protein_lis = []
    
    try:
        id = pk
        spliced_fin,sequence_fin,exon_intron,exon,protein = wormbase_crawler(transcript= id)
        exon = exon.reset_index().to_json(orient ='records')
        exon_intron = exon_intron.reset_index().to_json(orient='records')
        data_exon = list(json.loads(exon))
        data_exon_intron = list(json.loads(exon_intron))
        if protein !='missing':
            for i in range(10,len(protein),10):
                if i ==10:
                    protein_lis.append(protein[0:i])
                else:
                    protein_lis.append(protein[i-10:i])
            if len(protein)%10 !=0:
                protein_lis.append(protein[(len(protein)-len(protein)%10):len(protein)])
        else:
            pass

        while len(protein_lis)%5 !=0:
            protein_lis.append('nan')  
        protein_arr = np.array(protein_lis)
        protein_arr = protein_arr.reshape((int(len(protein_arr)/5),5))
        protein_df = pd.DataFrame(columns=['1','2','3','4','5'],data = protein_arr)
        protein_df = protein_df.reset_index()
        protein_df = protein_df.replace('nan','')
        #print(protein_df) 
        for i in range(len(protein_df)):
            if i ==0:
                protein_df['index'][i] = 1
            else:
                protein_df['index'][i] = i*50+1
         
        protein_df = protein_df.to_json(orient='records')
        data_protein_df =list(json.loads(protein_df))

    except: 
        pass
    return render(request,'output.html',locals())

'''==========================================index/genelist=================================================='''
def index(request):
    genes = Hw1Improve.objects.all()
    return render(request, 'index.html', locals())
def gene_list(request):
    genes = Hw1Improve.objects.all()
    return render(request, 'gene_list.html', locals())
'''===================================searching==============================================================='''
def searching(request):

    return render(request,'searching.html',locals())

def searching_ajax(request):
    input = request.POST['gene_id']
    table_list = wormbase_searching(input)
    response={
        'table_list' : table_list
        }

    return JsonResponse(response)


'''==============================================user======================================================='''
# 將 SQL 指令回傳的 List 轉成 Dict
def dictfetchall(cursor):
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]

def user(request):
#SQL
    try:
        id = request.GET['user_id']
        password = request.GET['user_pass']
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM user WHERE user_id='{}' AND user_pass='{}'".format(id,password))
        user = dictfetchall(cursor)
        if user:
            message = user[0]['user_content']
        else:
            message = "ID or Password not found."   
    except Exception as e: # work on python 3.x
        pass
        #message = e

# ORM Test
    try:
        id2 = request.GET['user_id2']
        password2 = request.GET['user_pass2']
        user2 = User.objects.filter(user_id=id2, user_pass=password2)

        if user2:
            message2 = user2[0].user_content
        else:
            message2 = "ID or Password not found."
            
    except Exception as e: # work on python 3.x
        pass
        #message = e

# ModelForm
    if request.method == 'POST':
        user_form = form.UserForm(request.POST)
        if user_form.is_valid():
            user_form.save() #應該是用這個儲存到database
            message3 = 'Saved successfully.'
        else:
            message3 = 'Something wrong, please check again.'
    else:
        user_form = form.UserForm()
    
    return render(request, 'user.html', locals())

def ajax_data(request):
    
    gene_id = request.POST['gene_id']
    
    try:
        gene = Hw1Improve.objects.get(gene_id = gene_id )
        transcript = gene.transcript_id
        numbers = gene.numbers
        message = 'Transcript ID: ' + transcript + '<br>Numbers: ' + str(numbers)
        
    except Exception as e:
        message = 'Something wrong, please check again.'
    
    response = {
        'message': message
    }
    return JsonResponse(response)
    #這個function會回傳message(which is transcript ID + numbers)
    #new_app/ajax_data/