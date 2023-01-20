#!/bin/bash

if [ $VERSION_NON_MASTER ] || [ $VERSION_NON_MAIN ]
then
  echo "Running version for non main branch"
else

  if ! git ls-remote --exit-code --heads origin main &>/dev/null
  then
    echo "Branch main does not exist"
    echo "Please rename master -> main or add a main branch"
    exit 1
  fi

  echo "Stashing your working directory..."
  git stash

  echo "Updating to development..."
  git checkout main

  echo "Fetching..."
  git fetch

  echo "Resetting to origin/main"
  git reset --hard origin/main
fi

echo "Running npm ci"
npm ci

echo "Running tests"
npm test
