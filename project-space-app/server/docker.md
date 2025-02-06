# Docker build
## build image
docker build -t my-node-api .

## run container
docker run -p 5000:3001 --env-file .env --name my-container my-node-api

## remove container
docker ps
docker stop my-container
docker rm my-container

## remove images
docker image prune -a

# Docker compose
## docker compose build
docker compose up --build -d

## list images
docker images

## list running containers
docker ps

## stop & remove containers
docker compose down

## remove image
docker rmi project-space-api
