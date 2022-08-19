import urllib.request as request
import bs4
import json
import pandas as pd
transcript = 'Y44E3A.2.1'
url = 'https://wormbase.org/rest/widget/transcript/'+transcript+'/sequences'

req = request.Request(url,headers ={"User-Agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"})
with request.urlopen(req) as response:
    sequence = response.read().decode("utf-8")
sequence  = json.loads(sequence)
#print (sequence)
#print('strand:',sequence['fields']['unspliced_sequence_context']['data']['strand'])#['positive_strand']['sequence'])
strand = sequence['fields']['unspliced_sequence_context']['data']['strand']
if strand =='+':
    sequence_fin= sequence['fields']['unspliced_sequence_context']['data']['positive_strand']['sequence']
    exon_intron = pd.DataFrame(sequence['fields']['unspliced_sequence_context']['data']['positive_strand']['features'])
    exon_intron = exon_intron[['type','start','stop']]
    exon = pd.DataFrame(sequence['fields']['spliced_sequence_context']['data']['positive_strand']['features'])
    exon = exon[['type','start','stop']]
    try:
        protein = sequence['fields']['protein_sequence']['data']['sequence']
    except:
        pass
elif strand =='-':
    sequence_fin = sequence['fields']['unspliced_sequence_context']['data']['negative_strand']['sequence']
    exon_intron = pd.DataFrame(sequence['fields']['unspliced_sequence_context']['data']['negative_strand']['features'])
    exon_intron = exon_intron[['type','start','stop']]
    exon = pd.DataFrame(sequence['fields']['spliced_sequence_context']['data']['negative_strand']['features'])
    exon = exon[['type','start','stop']]
    try:
        protein = sequence['fields']['protein_sequence']['data']['sequence']
    except:
        pass
print(exon)
print(protein)
#Y44E3A.2.1 UTR -> intron ,not UTR -> EXON
# background color #FFFFA3 ->Exon