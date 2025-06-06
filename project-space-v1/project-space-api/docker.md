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

# Deploy to AWS
## Create Repository
aws ecr create-repository --repository-name nyp/project-space-api --region ap-southeast-1
## Authenticate Docker to ECR
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 017820698732.dkr.ecr.ap-southeast-1.amazonaws.com
## Tag Docker Image
docker tag project-space-api:latest 017820698732.dkr.ecr.ap-southeast-1.amazonaws.com/nyp/project-space-api:latest
## Push the Image to ECR
docker push 017820698732.dkr.ecr.ap-southeast-1.amazonaws.com/nyp/project-space-api:latest
