
import pandas as pd
import numpy as np


def check_duplicate_output(input,group_Key,group_value,output_path):
    '''
    group_key : the value that we want to sort 
    group_value : the value that we get after sorting group key
    '''
    out_put_1 = input.groupby(str(group_Key))[str(group_value)].apply(list)
    out_put_1 = pd.DataFrame(out_put_1).reset_index()
    out_put_2 = input.groupby(str(group_Key))[str(group_value)].count()
    out_put_2 = pd.DataFrame(out_put_2).reset_index()

    #print(out_put_2)
    #print(out_put_1.loc['2RSSE.1'])
    duplicate_num =0
    #print(list(out_put_2['GeneID']))
    k=0
    for i in out_put_2[str(group_value)]:
        if i!=1:
            print(out_put_2.iloc[k])
            duplicate_num +=1
        else:
            pass
        k+=1
    print('duplicate_num:',duplicate_num)
    out_put_1['#'] = out_put_2[str(group_value)]
    print(out_put_1['#'])
    out_put_1.to_csv(str(output_path))

def check_duplicate(input,group_Key,group_value):
    '''
    group_key : the value that we want to sort 
    group_value : the value that we get after sorting group key
    '''
    out_put_1 = input.groupby(str(group_Key))[str(group_value)].apply(list)
    out_put_1 = pd.DataFrame(out_put_1).reset_index()
    out_put_2 = input.groupby(str(group_Key))[str(group_value)].count()
    out_put_2 = pd.DataFrame(out_put_2).reset_index()

    duplicate_num =0
    duplicate_list=[]
    k=0
    for i in out_put_2[str(group_value)]:
        if i!=1:
            duplicate_list.append(out_put_2.iloc[k][str(group_Key)])
            duplicate_num +=1
        else:
            pass
        k+=1
    #sprint(duplicate_list)
    #print('duplicate_num:',duplicate_num)
    out_put_1['#'] = out_put_2[str(group_value)]
    return(duplicate_list)



if __name__ =='__main__':
    data = pd.read_csv('data/c_elegans.PRJNA13758.WS285.geneOtherIDs.csv',sep='\t',header=None)
    df=pd.DataFrame(data)
    df=df.set_axis(['GeneID','Status','Sequence','GeneName','OtherName'],axis=1,inplace=False)
    duplicate_list = check_duplicate(input=df,group_Key='OtherName',group_value='GeneID')
    print(duplicate_list)

