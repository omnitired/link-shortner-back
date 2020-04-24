# Url shortner backend built with Nodejs

## Getting Started

- make sure node js > 10 and postgres > 10 are installed
- clone the project and run
```
  cd rivia && npm install 
  cp .env.example .env && cp env.test.example .env.test
```
- make the necessary changes to env files
- run 
```
  ./initdb.sh
  ./initdb_test.sh
  npm start
```
## on production server
-- install pm2 globaly and run
```
./build.sh
```

## to run tests
```
npm run test
```


### TODO:
- dockerize
- better error handling
- using i18 for error messages
