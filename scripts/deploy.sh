#!/usr/bin/bash

server=$1
port=$2
upload=$3
uploadport=$4


echo -e "\033[0;31m CHANGE BASEPROJECT.TAR.GZ TO <YOURPROJECTNAME.TAR.GZ> AND REMOVE THE NEXT LINE"
exit 1003

rm -rf bundle

echo "building server only"
meteor build ./ --server-only --architecture os.linux.x86_64

echo "npm install dependencies"
tar xf *.tar.gz
mv bundle .bundle
workingdir=`pwd`
cd .bundle/programs/server
npm install
cd ../..

export MONGO_URL="mongodb://localhost:27017/"
export ROOT_URL=$server
export PORT=$port

function cleanup {
    echo "\ncleaning up"
    cd $workingdir
    rm -rf .bundle
}
trap cleanup EXIT

scp -P $uploadport BaseProject.tar.gz $upload
