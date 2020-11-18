#!/bin/sh

# Load version
version=$(cat VERSION)
component='chastilock-cardgame'
tag="v$version"

publish_branch='publish'
self='git@github.com:Chastilock/chastilock-cardgame.git'

echo "Building $component @ $version [$tag]"

# Clone same repository
cd ..
git clone $self publish-branch
cd publish-branch
git checkout $publish_branch

# Setting up git user & email
git config --local user.name 'Chastilock CI/CD'
git config --local user.email 'info@chastilock.com'

# Remove tag (if this is a republish)
git tag -d $tag

# Delete anything (except dot files)
rm -rf *

# Copy content from other repository
cp -av ../$component/* .

ls