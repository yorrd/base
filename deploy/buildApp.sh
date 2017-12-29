#!/bin/bash

projectname=$1
apkname=$2
rooturl=$3
mobilesettings=$4

build='_build'
builddirectory=$projectname$build

export ANDROID_HOME=/opt/android-sdk
export ROOT_URL=$rooturl

echo "Removing old build"
    rm ../$builddirectory/*
echo "Building Application... (meteor build ../$builddirectory --server $rooturl --mobile-settings $mobilesettings.json)"
    meteor build ../$builddirectory --server $rooturl --mobile-settings $mobilesettings.json
echo "Finished Building!"
echo "Signing Application..."
    cd ../$builddirectory/android
    jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 release-unsigned.apk manuals --keystore ../../$projectname/yaskawa.keystore
echo "Finished Signing!"
echo "Zipalign Application..."
    /opt/android-sdk/build-tools/25.0.3/zipalign 4 release-unsigned.apk $apkname.apk
echo "Finished Application!"

echo "Installing Application on Connected Device..."
    sudo adb install $apkname.apk
