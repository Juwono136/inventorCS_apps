# Base image
FROM node:alpine3.20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
RUN npm install

# Copy application files
COPY . .

# build the application
RUN npm run build

# user Nginx as web server
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

# Expose the application port
EXPOSE 5173

# Command to run the application
CMD ["nginx", "-g", "daemon off;"]

