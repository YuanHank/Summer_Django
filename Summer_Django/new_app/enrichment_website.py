import numpy as np
import pandas as pd
import scipy.stats
from statsmodels.stats.multitest import multipletests
from IPython.display import display
import json
# https://www.statsmodels.org/dev/generated/statsmodels.stats.multitest.multipletests.html

def fisher(A,B,C,D) :

    T = int(A)      #交集數         1      剩下的交集處
    S = int(B)      #輸入 genes數   18    輸入一總數
    G = int(C)      #genes 樣本數   1117   篩選的樣本
    F = int(D)      #總 genes數     6572  輸入二總數

    S_T = S-T
    G_T = G-T
    F_G_S_T = F-G-S+T

    oddsratio, pvalue_greater = scipy.stats.fisher_exact( [ [T,G_T] , [S_T,F_G_S_T]] ,'greater')
    oddsratio, pvalue_less = scipy.stats.fisher_exact( [ [T,G_T] , [S_T,F_G_S_T]] ,'less')

    return pvalue_greater

# ================================================================================================
# ================================================================================================

def enrichment_website(input_data,type,cutoff):
    domain_data = pd.read_csv("D:/CODE/Summer_Django/enrichment/protein_domain_map_id.csv")
    input_list = input_data
    cut_off = float(cutoff)
    D = [6611 for n in range(len(domain_data))] #總共的蛋白質個數 ->這行代表現在有13878個domain，而現在6705種蛋白質要對這13878個domain做分析，所以需要產生母體蛋白質數量為6705而長度為13878的list
    C = list(domain_data["number"]) #母體蛋白質裡面有多少個蛋白質屬於該domain，
    B = [len(input_list) for n in range(len(domain_data))] #input的蛋白質數量
    list_A = list(range(len(domain_data)))
    A = list(range(len(domain_data)))
    test = list(range(len(domain_data)))
    input_return = [input_data for n in range(len(domain_data))]
    for n in range(len(domain_data["Domains"])): #由這行可知總共的domain數量
        list_A[n] = list(set(input_list)&set(domain_data["ID"][n].replace('[','').replace(']','').replace("'",'').replace(' ','').split(",")))#用來設定input的蛋白質有同時出現在第n個domain裡面
        A[n] = len(list_A[n])#計算在第n個domain裡面，有多少是與input的蛋白質重複（也就是C&B的交集)
        test[n] = fisher(A[n], B[n], C[n], D[n])#將所有計算套入方程式計算enrichment


    
    P_value_corr_FDR = multipletests(test,alpha=cut_off, method= "fdr_bh")
    P_value_corr_Bon = multipletests(test,alpha=cut_off, method= "bonferroni")

    result = pd.DataFrame({
                            "Domain_id":domain_data["Domains"],
                            "P-value":test,
                            "FDR":P_value_corr_FDR[1],
                            "Bonferroni":P_value_corr_Bon[1],
                            'A':A,
                            'B':B,
                            'C':C,
                            'D':D,
                            'IDs':domain_data['ID'],
                            #'detail':[input_data,domain_data["Domains"]],
                            'input':input_return,
                            })

    result['Expect ratio'] = list(map(lambda x,y:x/y ,list(C),list(D)))
    result['Obeserved ratio'] = list(map(lambda x,y:x/y ,list(A),list(B)))

    if type =='FDR':
        result_p_val = result[result["FDR"]<=cutoff]
        result_p_val = result_p_val[["Domain_id","FDR",'A','B','C','D','IDs','input','Expect ratio','Obeserved ratio']]
        return(result_p_val)
    elif type =='Bonferroni':
        result_p_val = result[result["Bonferroni"]<=cutoff]
        result_p_val = result_p_val[["Domain_id","Bonferroni",'A','B','C','D','IDs','input','Expect ratio','Obeserved ratio']]
        return(result_p_val)
    elif type =='No adjustment':
        result_p_val = result[result['P-value']<=cutoff]
        result_p_val = result_p_val[["Domain_id","P-value",'A','B','C','D','IDs','input','Expect ratio','Obeserved ratio']]
        return(result_p_val)

def enrichment_compare(input_data,domain):
    domain_data = pd.read_csv("D:/CODE/Summer_Django/enrichment/protein_domain_map_id.csv")
    input_list = input_data
    domain_data = domain_data.set_index('Domains')
    domain_list = domain_data.loc[domain]
    domain_list = domain_list["ID"].replace('[','').replace(']','').replace("'",'').replace(' ','').split(",")
    list_A = list(set(input_list)&set(domain_list))
    total_list = []
    for i in range (len(domain_list)):
        if domain_list[i] not in list_A:
            total_list.append(domain_list[i])
    
    for i in range(len(input_list)):
        if input_list[i] not in list_A:
            total_list.append(input_list[i])
    total_list = total_list + list_A
    input_check =np.array(['&#9989;' for i in range(len(total_list))])
    domain_check =np.array(['&#10060;' for i in range(len(total_list))])

    for i in range(len(total_list)):
        
        if total_list[i] in input_list:
            input_check[i] = '&#9989;'
            
        else: 
            input_check[i] = '&#10060;'
            

        if total_list[i] in domain_list:
            domain_check[i] = '&#9989;'
            
            
        else:
            domain_check[i] = '&#10060;'
            
        
    result = pd.DataFrame({'ID':total_list,'input':input_check,'domain':domain_check})
    #display(result)
    return (domain_list,result)
if __name__ =="__main__":
    input_list = ['YGL028C', 'YGR279C', 'YGR282C', 'YLR343W', 'YMR215W', 'YMR305C', 'YMR307W', 'YOL030W', 'YOL132W']
    '''
    result = enrichment_website(input_list,'FDR',0.01)
    display(result)
    '''
    list_A,result= enrichment_compare(input_list,'PF00332')
    print(list_A)