# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Compile TypeScript code
RUN npm run build

# Expose the port (if your application listens on a specific port)
EXPOSE 4000

# Command to run your application (if required, adjust as per your setup)
CMD ["node", "dist/index.js"]