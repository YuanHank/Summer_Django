#from msilib import sequence
from django.shortcuts import render,redirect
from django.http import HttpResponse
from datetime import datetime
import pandas as pd
import numpy as np
import string
from .models import Hw1Improve,User,Wormbase285,WormbaseGenetranscriptW285,TranscriptWbidType,FinalResultWt1HrdeipWs285AllWithIdtype
import json
from .check_duplicate import check_duplicate
import re
from .wormbase import wormbase_crawler,wormbase_searching
from new_app import form
from django.db import connection
from django.http import JsonResponse
import os 
from operator import itemgetter

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
    exon = exon.sort_values(by='stop').reset_index(drop=True)
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
        exon = exon.sort_values(by='stop').reset_index(drop=True)
        #print(protein)
        exon = exon.to_json(orient ='records')
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
    if protein != '(-)':
        return render(request,'output.html',locals())
    if protein == '(-)':
        return render(request,'output2.html',locals())
    
'=====================================transcript_geneid_genename======================================================'
def transcript_geneid_genename(request):
    return render(request,'transcriptgene.html',locals())

def transcript_geneid_genename_ajax(request):
    input = request.POST['gene_id']
    input = input.replace(' ','') #將空格消去避免查找值時候因為空格而有影響
    wormbase = WormbaseGenetranscriptW285.objects.values()
    wormbase =pd.DataFrame(wormbase)
    #print(wormbase)
    Gene_ID = 'gene_id'
    input_type = 'input_type'
    try:
        gene = WormbaseGenetranscriptW285.objects.get(geneid = input)
        Gene_ID = gene.geneid
        input_type = "ID"
    except Exception as e:
        try:
            gene = WormbaseGenetranscriptW285.objects.get(sequence = input)
            duplicate_list = check_duplicate(input=wormbase,group_Key = 'sequence',group_value='geneid')
            if str(input) in duplicate_list:
                Gene_ID ='error'
            else:    
                Gene_ID = gene.geneid
                input_type = "ID"
        except Exception as e:
            try:
                gene = WormbaseGenetranscriptW285.objects.get(genename = input)
                duplicate_list = check_duplicate(input=wormbase,group_Key = 'genename',group_value='geneid')
                if str(input) in duplicate_list:
                    Gene_ID ='error'
                else:
                    Gene_ID = gene.geneid
                    input_type = "ID"
            except Exception as e:
                try:
                    gene = WormbaseGenetranscriptW285.objects.get(othername = input)
                    duplicate_list = check_duplicate(input=wormbase,group_Key = 'othername',group_value='geneid')
                    if str(input) in duplicate_list:
                        Gene_ID ='error'
                    else:
                        Gene_ID = gene.geneid
                        input_type = "ID"
                except Exception as e:
                    try:
                        gene_all = WormbaseGenetranscriptW285.objects.values('transcript') ## 讀取如果transcripts存在於gene_ID的分類內，則抓取該gene_ID欄位
                        for transcript in gene_all:
                            for value in transcript.values():
                                values = str(value).replace('[','').replace(']','').replace(' ','').replace("'",'').split(',')
                                for i in values:
                                    if input == i:
                                        gene = WormbaseGenetranscriptW285.objects.get(transcript = value)

                                '''
                                if input in value:
                                    gene = WormbaseGenetranscriptW285.objects.get(transcript = value)
                                '''
                            else:
                                continue #這個寫法可以直接跳出FOR loop,要記得   
                            break
                        Gene_ID = input
                        input_type = "transcript"
                    except Exception as e:
                        Gene_ID ='error'
                        #print(e)
    
    Wormbase_ID = gene.geneid
    Gene_Sequence_Name = gene.sequence
    Gene_Name = gene.genename
    Other_Name = gene.othername
    table_list=[{'Wormbase_ID':Wormbase_ID,'Gene_Sequence_Name':Gene_Sequence_Name,'Gene_Name':Gene_Name,'Other_Name':Other_Name}]
    transcript = gene.transcript
    transcript_type = gene.type
    transcript = transcript.replace('[','').replace(']','').replace("'",'').replace(' ','').split(',')
    transcript_type = transcript_type.replace('[','').replace(']','').replace("'",'').split(',')
    transcript_table=[]
    for i in range(len(transcript)):
        transcript_table.append({'transcript':transcript[i],'transcript_type':transcript_type[i]})
    #print(transcript_table)
    response={
            'Gene_ID':Gene_ID,
            'table_list':table_list,
            'transcript_table' :transcript_table,
            'input_type':input_type,
        }

    return JsonResponse(response)

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
'================================Check if multiple geneID====================================================='
def duplicate_check(request):

    return render(request,'duplicate.html',locals())

def duplicate_ajax(request):
    input = request.POST['gene_id']
    input = input.replace(' ','') #將空格消去避免查找值時候因為空格而有影響
    wormbase = Wormbase285.objects.values()
    wormbase =pd.DataFrame(wormbase)
    #print(wormbase)
   
    try:
        gene = Wormbase285.objects.get(geneid = input)
        Gene_ID = gene.geneid
    except Exception as e:
        try:
            gene = Wormbase285.objects.get(sequence = input)
            duplicate_list = check_duplicate(input=wormbase,group_Key = 'sequence',group_value='geneid')
            if str(input) in duplicate_list:
                Gene_ID ='error'
            else:
                Gene_ID = gene.geneid
        except Exception as e:
            try:
                gene = Wormbase285.objects.get(genename = input)
                duplicate_list = check_duplicate(input=wormbase,group_Key = 'genename',group_value='geneid')

                if str(input) in duplicate_list:
                    Gene_ID ='error'
                else:
                    Gene_ID = gene.geneid
            except Exception as e:
                try:
                    gene = Wormbase285.objects.get(othername = input)
                    duplicate_list = check_duplicate(input=wormbase,group_Key = 'othername',group_value='geneid')
                    if str(input) in duplicate_list:
                        Gene_ID ='error'
                    else:
                        Gene_ID = gene.geneid
                except Exception as e:
                    print(e)
                    Gene_ID ='error'
                    #print('Gene_ID:',Gene_ID)
                    #print(input)
                    pass
    if Gene_ID !='error':
        table_list = wormbase_searching(Gene_ID)
    else:
        table_list = {}
    print(Gene_ID)
    response={
            'Gene_ID':Gene_ID,
            'table_list':table_list,
        }

    return JsonResponse(response)
'''===========================================pirscan======================================================='''
#this function is used for ouput the dataframe in pirscan_output.html(ajax)
def pirscan_ajax(request):
    transcript = request.POST['gene_id']
    #with open ('sequence.fa','w') as f:
    #    f.write('>\n{}'.format(sequence))
    #os.system('python3 piTarPrediction.py sequence.fa ce whole [0,2,2,3,6]')
    current_address = os.getcwd()
    os.chdir('D:/CODE/pirScan/output')
    try:
        with open ('D:\CODE\pirScan\output/piRNA_targeting_sites.json','r') as jsondata:
            data = json.load(jsondata)
        with open('D:/CODE/pirScan/inputSeq.fa','r') as f:
            length = f.readlines()
        os.remove('piRNA_targeting_sites.json')
        os.chdir(current_address)
        #print (data)        
        newout = data['newout']
        total_json_list = []
        for item in newout:
            index = item[10].find("5'")
            start_end =item[1].split('-')
            #print(index)
            modify_string_2 = item[10].replace('mark',"span class='y'")
            dict1 = {'piRNA name':item[0],
                    'piRNA target score':item[14],
                    'target region':item[1],
                    '# mismatches':item[2],
                    'position in piRNA':item[3],
                    '# non-GU mismatches in seed region':item[5],
                    '# GU mismatches in seed region':item[6],
                    '# non-GU mismatches in non seed region':item[7],
                    '# Gu mismatches in non seed region':item[8],
                    #'pairing (top:Input sequence, bottom:piRNA)':"<div class='parent'>"+'<div class = "child">'+item[9]+'</div>'+'<br>'+"<div class='child'>"+"<span>"+item[10]+"</span>"+"</div>"+"</div>  "
                    'pairing (top:Input sequence, bottom:piRNA)':item[9]+'<br>'+modify_string_2,
                    'start':int(start_end[0]),
                    'end':int(start_end[1]),
                    'y':0
                    }
            total_json_list.append(dict1)


        total_json_list = sorted(total_json_list, key=itemgetter('start')) 
        '''
        for i in range(len(total_json_list)):
            print(total_json_list[i]['start'])
            print('==================================')
        '''
        cover  = 1
        count = 0
        y = 0
        first = 1
        while cover != 0:
            cover = 0
            start = 0
            end = 0
            first = 1
            for i in range(0,len(total_json_list)):
                #print('first',first)
                if total_json_list[i]['y'] == y:
                    if first == 1:
                        start = total_json_list[i]['start']
                        end = total_json_list[i]['end']
                        #print('start',start,'end',end)
                        first = 0
                    elif first != 1 :
                        #print('bigger than start in i:',total_json_list[i]['start'] > start,'small than end in i:',total_json_list[i]['start'] < end)
                        if (total_json_list[i]['start'] > start) and (total_json_list[i]['start'] < end):
                            total_json_list[i]['y'] = y+2.1
                            start = total_json_list[i]['start']
                            end = total_json_list[i]['end']                            
                            cover = 1
                        else: 
                            start = total_json_list[i]['start']
                            end = total_json_list[i]['end']   
                            pass
            #print('========================================')
            y += 2.1
        y+=2.1
        
        #print(total_json_list)
        try:
            '''
            讀入22G的資料表，依造request得到的transcript搜尋相對應的資料(應該會有多筆資料，每筆的欄位會有開始點、結束點跟權重)
            回傳json檔案，單個元素裡面包含該22G的:開始點，結束點，權重，並將這份json檔案回傳，回傳後依造權重給予高度，開始結束點繪出結合位置，
            '''
            g22 = list(FinalResultWt1HrdeipWs285AllWithIdtype.objects.filter(ref_id=transcript).values())
            g22 = sorted(g22, key=itemgetter('evenly_rc'),reverse=True)
            max_evenly_rc = float(g22[0]['evenly_rc']) 
        except:
            g22 = [{'input_id':0,'ref_id':0,'wormbase_id':0,'type':0,'init_pos':0,'end_pos':0,'read_count':0,'field_ofanswers':0,'evenly_rc':0}]
            max_evenly_rc = 0

        response ={
            'total_json_list':total_json_list,
            'length':len(length[1]),
            'y':y,
            'g22':g22,
            'max_evenly_rc' : max_evenly_rc
        }
    except Exception as e:
        print(e)
        response ={ 
            'total_json_list':'none',

        }
    return JsonResponse(response)

#this function is used to work with transcript_gene site,
def pirscan_output(request,pk): 
    try:
        id = pk
        spliced_fin,sequence_fin,exon_intron,exon,protein = wormbase_crawler(transcript= id)
        current_address = os.getcwd()
        os.chdir('D:/CODE/pirScan')
        with open ('inputSeq.fa','w') as f:
            f.write('>{}\n'.format(pk)+spliced_fin)
        os.system('python3 piTarPrediction.py inputSeq.fa ce none [0,2,2,3,6]')
        os.chdir(current_address)

    except Exception as e:
        print(e)
    return render(request,'pirscan_output.html',locals())
'''==============================================browser======================================================='''
def browser(request):

    return render(request,'browser.html',locals())

def browser_ajax(request):
    res = dict(request.POST)['type']
    #print(res)
    data = TranscriptWbidType.objects.values()
    data = pd.DataFrame(data)
    data = data.drop(['field1'],axis=1)    
    data_out = data.loc[data['type'].isin(res)]
    data_out = data_out.to_json(orient = 'records')
    response = {'data_out':data_out}
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