#!/usr/bin/env bash

# Examples:
# sh start.sh - start docker and open command line to project directory
# sh start.sh dev - start docker image and immediate run npm install and npm start for development
# sh start.sh build - start docker, build & test application then save production docker image

source "./docker/docker.properties"

IMAGENAME=$APP_NAME
SCRIPTFILE=
TASK=$1
CLEAN=$2

if [ "$TASK" == "clean" ]; then
  TASK=""
  CLEAN="clean"
fi

if [ "$TASK" != "" ]; then
  SCRIPTFILE="docker/$TASK.sh"
fi

if [[ "$CLEAN" == "clean" || "$(docker images -q $IMAGENAME-dev 2> /dev/null)" == "" ]]; then
  docker rmi $IMAGENAME-dev || echo "image $IMAGENAME-dev not yet built"
  docker build -t $IMAGENAME-dev -f ./docker/Dockerfile.dev .
fi

docker run -v $(PWD):/usr/app -p $HOST_PORT:8080 -it --privileged --rm --net=host --name $IMAGENAME-dev $IMAGENAME-dev /bin/bash $SCRIPTFILE

if [ "$TASK" == "build" ]; then
  docker rmi $IMAGENAME || echo "image $IMAGENAME not yet built"
  docker build -t $IMAGENAME -f ./docker/Dockerfile.prod.$APP_SERVER .
  docker save $IMAGENAME > $IMAGENAME.tgz
fi
