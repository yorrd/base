exec > log.log
exec 2>&1

tar xf *.tar.gz
(cd bundle/programs/server && npm install)

export MONGO_URL="mongodb://localhost:27017/finance"
export ROOT_URL="http://localhost:10000"
export PORT="10000"

pm2 stop Finance
pm2 delete Finance
pm2 start bundle/main.js --name Finance --watch
