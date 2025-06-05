# Step 1: Use the official Node.js image as a base
FROM node:22-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code into the container
COPY . .

# Step 6: Expose the port the app will run on (e.g., port 3000)
EXPOSE 80

# Step 7: Command to start the application
CMD ["npm", "start"]
