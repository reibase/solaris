# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of your application code to the working directory
COPY . .

RUN npm run build

# Expose a port to communicate with the React app
EXPOSE 5173

# Expose a port to communicate with the server
EXPOSE 3000


# Start server 
CMD ["npm", "start"]