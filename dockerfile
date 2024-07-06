# Use the official Node.js image as a base image
FROM node:alpine

# Set the working directory to /app
WORKDIR /app

# Copy the client and server directories to the working directory
COPY client ./client
COPY server ./server
COPY .env /app/client
COPY .env /app/server

# Install npm packages for the client
RUN cd client && npm install

# Install npm packages for the server
RUN cd server && npm install

# Build the client
RUN cd client && npm run build

# Expose port 9000
EXPOSE 9000

# Set the working directory to /app/server
WORKDIR /app/server

# Start the server
CMD ["npm", "start"]
