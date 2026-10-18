# Run these one at a time. They seem to get stuck if run with the others.




#####cd ../mediawiki-core && git log -all --stat > ../../wikimedia-gitlog/mediawiki-core.txt
#cd ../../data/repos/operations-puppet
#cd ../mediawiki-core && git log --all --stat > ../../wikimedia-gitlog/mediawiki-core.txt
# Then open in VS code and save the encoding as utf-8
# Then run        cat mediawiki-core.txt | jc --git-log > mediawiki-core.json

cd ../../data/repos/operations-software-gerrit
git log --all --stat > ../../wikimedia-gitlog/operations-software-gerrit.txt
# Then run         cat operations-software-gerrit.txt | jc --git-log > operations-software-gerrit.json


#cd ../../data/repos/operations-puppet
#cd ../mediawiki-extensions && jc git log --all --stat > ../../wikimedia-gitlog/mediawiki-extensions.json



#cd ../../data/repos/operations-puppet
#cd ../operations-puppet && jc git log --all --stat > ../../wikimedia-gitlog/operations-puppet.json
