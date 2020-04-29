version="$(date +%Y-%m-%d-%S)"

git checkout -b release-$version

npm install

npm run build

npm run test

npm run build:gitbook

cp -R _book/* .

git clean -fx _book

git add .

git commit -a -m $version

git push origin release-$version
