# Base image
FROM node:alpine3.20 AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
RUN npm install

# Copy application files
COPY . .

# build the application
RUN npm run build

# Use Nginx as web server
FROM nginx:alpine

# Copy built app to Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx configuration file to sites-available folder 
COPY inventorcs-nginx.conf /etc/nginx/sites-available/inventorcs-nginx.conf

# Create symlink for enable Nginx configuration
RUN ln -s /etc/nginx/sites-available/inventorcs-nginx.conf /etc/nginx/sites-enabled/

# Expose the application port
EXPOSE 8080

# Command to run the application
CMD ["nginx", "-g", "daemon off;"]

