#!/bin/sh

# Load version
version=$(cat VERSION)
component="$GITHUB_REPOSITORY"
tag="v$version"
main_repo_path=$(pwd)

publish_branch='publish'
self="https://${GITHUB_ACCOUNT}:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"

echo "Building $component @ $version [$tag]"

# Clone same repository
cd ..
git clone $self publish-branch
cd publish-branch
publish_repo_path=$(pwd)

# Checkout the publish branch
git checkout $publish_branch

# Setting up git user & email
git config --local user.name 'Chastilock CI/CD'
git config --local user.email 'info@chastilock.com'

# Remove tag (if this is a republish)
git tag -d $tag
# Remote tag
git push --delete "https://${GITHUB_ACCOUNT}:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git" $tag

# Delete anything (except dot files)
rm -rf *

# Copy content from other repository
cp -av $main_repo_path/* .

# Install & build
yarn
yarn build

# Commit the dist folder (and all other files)
git add -A
git add --force dist
git commit -m "[cicd] publishing version: $version"

# Tag the last commit
git tag $tag

# Push latest commit & tag
git push "https://${GITHUB_ACCOUNT}:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
git push "https://${GITHUB_ACCOUNT}:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git" --tags