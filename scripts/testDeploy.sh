#!/usr/bin/bash
rm -rf bundle
meteor build ./ --server-only --architecture os.linux.x86_64
tar xf *.tar.gz
mv bundle .bundle
workingdir=`pwd`
cd .bundle/programs/server
npm install
cd ../..
export MONGO_URL="mongodb://localhost:27017/"
export ROOT_URL="http://localhost:8080"
export PORT="8080"

function cleanup {
    echo "\ncleaning up"
    cd $workingdir
    rm -rf .bundle
    rm *.tar.gz
}
trap cleanup EXIT

echo "starting node"
node main.js
