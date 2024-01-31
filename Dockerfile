# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

RUN npm install

# Copy the rest of your application code to the working directory
COPY . .

# Install app dependencies
RUN npm run build

# Expose a port to communicate with the React app
EXPOSE 3000

# Start server 
CMD ["npm", "run", "preview"]