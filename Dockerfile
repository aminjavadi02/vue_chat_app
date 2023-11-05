# Use an official Node runtime as a parent image
FROM node:lts-alpine

# Set the working directory
WORKDIR /app

# Install Vue CLI globally
RUN npm install -g @vue/cli

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Make port 8080 available
EXPOSE 8080

# Serve the application for development
CMD ["npm", "run", "serve"]
