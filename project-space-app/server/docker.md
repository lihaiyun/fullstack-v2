docker build -t my-node-api .
docker run -p 5000:3001 --env-file .env my-node-api
