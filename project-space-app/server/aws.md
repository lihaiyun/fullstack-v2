## Create Repository
aws ecr create-repository --repository-name nyp/project-space-api --region ap-southeast-1
## Authenticate Docker to ECR
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 017820698732.dkr.ecr.ap-southeast-1.amazonaws.com
## Tag Docker Image
docker tag project-space-api:latest 017820698732.dkr.ecr.ap-southeast-1.amazonaws.com/nyp/project-space-api:latest
## Push the Image to ECR
docker push 017820698732.dkr.ecr.ap-southeast-1.amazonaws.com/nyp/project-space-api:latest
