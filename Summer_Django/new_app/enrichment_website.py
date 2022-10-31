import numpy as np
import pandas as pd
import scipy.stats
from statsmodels.stats.multitest import multipletests
from IPython.display import display
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
    domain_data = pd.read_csv("D:\CODE\Summer_Django\enrichment\protein_domain_map_id.csv")
    input_list = input_data
    cut_off = float(cutoff)
    D = [6611 for n in range(len(domain_data))] #總共的蛋白質個數 ->這行代表現在有13878個domain，而現在6705種蛋白質要對這13878個domain做分析，所以需要產生母體蛋白質數量為6705而長度為13878的list
    C = list(domain_data["number"]) #母體蛋白質裡面有多少個蛋白質屬於該domain，
    B = [len(input_list) for n in range(len(domain_data))] #input的蛋白質數量
    list_A = list(range(len(domain_data)))
    A = list(range(len(domain_data)))
    test = list(range(len(domain_data)))

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
                            })

    result['Expect ratio'] = list(map(lambda x,y:x/y ,list(C),list(D)))
    result['Obeserved ratio'] = list(map(lambda x,y:x/y ,list(A),list(B)))

    if type =='FDR':
        result_p_val = result[result["FDR"]<=cutoff]
        return(result_p_val)
    elif type =='Bonferroni':
        result_p_val = result[result["Bonferroni"]<=cutoff]
        return(result_p_val)
    elif type =='No adjustment':
        result_p_val = result[result['P-value']<=cutoff]
        return(result_p_val)
if __name__ =="__main__":
    input_list = ['YLR449W', 'YML074C', 'YNL135C']
    result = enrichment_website(input_list,'FDR',0.01)
    display(result)