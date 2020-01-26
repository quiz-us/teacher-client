#!/bin/bash

# checkout server staging branch unless we are on master/prod, in which case we would pull master server branch
# launch the database
# start rails server
# npm install
# npm start
# run cypress

git clone -b staging git@github.com:quiz-us/quiz-us-server.git

cd quiz-us-server
gem install bundler:2.0.2
bundle update --bundler
bundle install --jobs=4 --retry=3 --path vendor/bundle
bundle exec rake db:setup
bundle exec rake db:seed
echo "Database is set up!"
bin/rails server -d


cd ..
npm run build
echo "Creating react production build"
while [ ! -f /build/index.html ]; do sleep 1; done
npx serve --single build -l 8000 &
node_modules/.bin/cypress run
