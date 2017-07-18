#!/bin/bash

IMAGE_NAME=petkr/mesos-marathon-browser

docker build -t $IMAGE_NAME:dev .

if [ "$TRAVIS_PULL_REQUEST" = "false" ] && [ "$TRAVIS_REPO_SLUG" = "petr-k/mesos-marathon-browser" ]
then
  docker login -u "$DOCKERHUB_USERNAME" -p "$DOCKERHUB_PASSWORD"

  if [ "$TRAVIS_TAG" != "" ]
  then
    docker tag $IMAGE_NAME:dev "$IMAGE_NAME:$TRAVIS_TAG"
    docker push "$IMAGE_NAME:$TRAVIS_TAG"
    docker tag $IMAGE_NAME:dev "$IMAGE_NAME:latest"
    docker push "$IMAGE_NAME:latest"

  fi

  if [ "$TRAVIS_BRANCH" = "master" ]
  then
    docker tag $IMAGE_NAME:dev "$IMAGE_NAME:$TRAVIS_BRANCH"
    docker push "$IMAGE_NAME:$TRAVIS_BRANCH"
  fi

fi
