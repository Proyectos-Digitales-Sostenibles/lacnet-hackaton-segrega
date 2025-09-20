#!/bin/bash
echo "The script you are running has basename `basename "$0"`, dirname `dirname "$0"`"
echo "The present working directory is `pwd`"

PROJECT_NAME=${PWD##*/}
echo "Project name is $PROJECT_NAME"

cd $(dirname "$0")
docker-compose -p $PROJECT_NAME up
