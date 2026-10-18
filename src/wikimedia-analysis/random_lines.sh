time \
awk 'BEGIN  {srand()} 
     !/^$/  { if (rand() <= .005 || FNR==1) print > "compare_commits_oc_small.csv"}' compare_commits_oc.csv