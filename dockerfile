# Use a lightweight Node.js image for production
# FROM node:21-alpine as build

# # Set the working directory in the container
# WORKDIR /usr/src/app

# # Copy package.json and package-lock.json to the working directory
# COPY package*.json ./

# # Install app dependencies
# RUN npm install --production

# # Bundle app source
# COPY . .

# # Build Next.js app for production
# RUN npm run build

# Start a new stage from scratch
FROM node:21-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy only necessary files from the previous stage
COPY /node_modules ./node_modules
# COPY --from=build /usr/src/app/.next ./.next
# COPY --from=build /usr/src/app/public ./public
# COPY --from=build /usr/src/app/package.json ./package.json
COPY /.next ./.next
COPY /public ./public
COPY /package.json ./package.json

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["npm", "start"]

#dckr_pat_b7s8ob74zfWHnv8kQFw5AzNT0yM
