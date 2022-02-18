#!/bin/sh

cd /data/git
#cd /Users/awei/project/wei/testest

prjName=$1
branch=$2

if [ "$branch" = "undefined" ];then
   branch='master'
fi

echo "name:$1, branch:$branch, env:$3"

if [ ! -d "${prjName}" ]; then
  echo 'git clone'
  git clone git@github.com:sliwei/$prjName.git
  cd ${prjName}
  git checkout -B $branch origin/$branch --
else
  echo 'git pull'
  cd ${prjName}
  git checkout -B $branch origin/$branch --
  git fetch origin --recurse-submodules=no --progress --prune
  git merge origin/$branch --no-stat -v
fi

sh ./deploy.sh $3

#yarn
#yarn build:live
#cp -rf ./dist ../../www/classroom-support-serve/

#/usr/bin/docker stop abcweb
#/usr/bin/docker rm abcweb
#/usr/bin/docker rmi abcweb-img:latest
#/usr/bin/docker build . -t abcweb-img:latest --rm=true
#/usr/bin/docker run -d --name=abcweb -p 8888:8080 abcweb-img:latest
