
projectname=$1
sshaccess=$2
sshport=$3

meteor build ./ --server-only --architecture os.linux.x86_64
 scp -P $sshport $projectname.tar.gz $sshaccess
