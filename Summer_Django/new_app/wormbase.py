import urllib.request as request
import bs4
import json
import pandas as pd
#transcript = 'Y44E3A.2.1'
def wormbase_crawler(transcript):
    url = 'https://wormbase.org/rest/widget/transcript/'+transcript+'/sequences'

    req = request.Request(url,headers ={"User-Agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"})
    with request.urlopen(req) as response:
        sequence = response.read().decode("utf-8")
    sequence  = json.loads(sequence)
    #print (sequence)
    #print('strand:',sequence['fields']['unspliced_sequence_context']['data']['strand'])#['positive_strand']['sequence'])
    try:
        strand = sequence['fields']['unspliced_sequence_context']['data']['strand']
    except:
        strand = sequence['fields']['unspliced_sequence_context']['data']['strand']
    #print(sequence)
    if strand =='+':
        try:
            spliced_fin = sequence['fields']['spliced_sequence_context']['data']['positive_strand']['sequence']
            sequence_fin= sequence['fields']['unspliced_sequence_context']['data']['positive_strand']['sequence']
            exon_intron = pd.DataFrame(sequence['fields']['unspliced_sequence_context']['data']['positive_strand']['features'])
            exon_intron = exon_intron[['type','start','stop']]
        except:
            spliced_fin = sequence['fields']['spliced_sequence_context']['data']['positive_strand']['sequence']
            sequence_fin= sequence['fields']['unspliced_sequence_context_with_padding']['data']['positive_strand']['sequence']
            exon_intron = pd.DataFrame(sequence['fields']['unspliced_sequence_context_with_padding']['data']['positive_strand']['features'])
            exon_intron = exon_intron[['type','start','stop']]
        exon = pd.DataFrame(sequence['fields']['spliced_sequence_context']['data']['positive_strand']['features'])
        exon = exon.sort_values(by="start").reset_index(drop=True) #排序start值（以降冪方式）
        exon = exon[['type','start','stop']] # 重新排序column
        try:
            protein = sequence['fields']['protein_sequence']['data']['sequence']
        except:
            protein = '(-)'
    elif strand =='-':
        spliced_fin = sequence['fields']['spliced_sequence_context']['data']['negative_strand']['sequence']
        sequence_fin = sequence['fields']['unspliced_sequence_context']['data']['negative_strand']['sequence']
        exon_intron = pd.DataFrame(sequence['fields']['unspliced_sequence_context']['data']['negative_strand']['features'])
        exon_intron = exon_intron[['type','start','stop']]
        exon = pd.DataFrame(sequence['fields']['spliced_sequence_context']['data']['negative_strand']['features'])
        exon = exon.sort_values(by="start").reset_index(drop=True) #排序start值（以降冪方式）
        exon = exon[['type','start','stop']] # 重新排序column
        try:
            protein = sequence['fields']['protein_sequence']['data']['sequence']
        except:
            protein = '(-)'
    #print(exon)
    return(spliced_fin,sequence_fin,exon_intron,exon,protein)
#print(exon)
#print(protein)
#Y44E3A.2.1 UTR -> intron ,not UTR -> EXON
# background color #FFFFA3 ->Exon

def wormbase_searching(gene_id):
    url = 'https://wormbase.org/rest/widget/gene/'+gene_id+'/sequences'
    req = request.Request(url,headers ={"User-Agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"})
    with request.urlopen(req) as response:
        sequence = response.read().decode("utf-8")
    sequence  = json.loads(sequence)
    print(sequence)
    table = sequence['fields']['gene_models']['data']['table']
    table_list =[]
    for gene in table:
        try:
            #print(gene['model']['id'],',',gene['type'],',',gene['length_unspliced'])
            table_list.append({'id':gene['model']['id'],'gene_type':gene['type'],'length':gene['length_unspliced'],'cds_length':gene['length_spliced'],'protein_length':'-'})
        except:
            for list in gene['model']:
                #print(list['id'],',',gene['type'][0],',',gene['length_unspliced'][0])
                table_list.append({'id':list['id'],'gene_type':gene['type'][0],'length':gene['length_unspliced'][0],'cds_length':gene['length_spliced'],'protein_length':gene['length_protein']})

#print(table_list) 
    return (table_list)
if __name__ =='__main__':
    transcript = 'F07C3.7.1' ##non coding RNA
    #transcript = 'C04A11.4a.1' #mRNA
    #gene_id='WBGene00306126'
    #gene_id = 'WBGene00019562'
    #table_list = wormbase_searching(gene_id)
    
    wormbase_crawler(transcript)
