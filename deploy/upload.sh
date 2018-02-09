
projectname=$1
sshaccess=$2
sshport=$3

echo "Did you update the version number in all of the following files?"
echo "ServiceWorker - sw.js"
echo "package.json"
echo "mobile-config.js"
read -p "Press Enter to continue"

meteor build ./ --server-only --architecture os.linux.x86_64
 scp -P $sshport $projectname.tar.gz $sshaccess
