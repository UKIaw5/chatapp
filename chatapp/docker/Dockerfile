# Specify base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port Next.js will run on
EXPOSE 3000

# Run the Next.js application
CMD ["npm", "run", "dev"]

