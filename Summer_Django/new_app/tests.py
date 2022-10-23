import os 

os.chdir('../../pirScan')
os.system('python3 piTarPrediction.py inputSeq.fa ce whole [0,2,2,3,6]')

os.chdir('../Summer_Django/new_app')

# Create your tests here.
