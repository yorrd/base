#!/usr/bin/bash

directory=$1
git=$2
branch=$3

# shopt -s dotglob
cp -rT ./ $directory

cd $directory
git remote set-url origin $git
git checkout -b $branch
git commit
git push --set-upstream origin $branch
