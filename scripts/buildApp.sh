#!/bin/bash

isrun=$1
server=$2

export ANDROID_HOME=/opt/android-sdk
export ROOT_URL=$server

echo "Building Application..."
    meteor build ../qrcodeextension_build --server $server

echo "Signing Application..."
    cd ../qrcodeextension_build/android
    jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 release-unsigned.apk elearningapp

echo "Zipalign Application..."
    /opt/android-sdk/build-tools/25.0.3/zipalign 4 release-unsigned.apk elearning_qr.apk

echo "Finished Application!"

if [ "$isrun" == "run" ] ; then
echo "Installing Application on Connected Device..."
    sudo adb install elearning_qr.apk
fi
