# Step 1: Build the React application using a Node.js base image
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies with forced installation to handle conflicts
RUN npm install --force

# Copy the rest of the application files to the working directory
COPY . .

# Build the application for production
RUN npm run build

# Step 2: Use Nginx to serve the built static files
FROM nginx:alpine

# Remove default Nginx static files (optional but can help avoid confusion)
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output from the previous stage to Nginx's html folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for incoming traffic
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]