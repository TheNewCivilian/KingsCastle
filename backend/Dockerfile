# build stage
FROM node:16-alpine as build-stage
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build
EXPOSE 3000
WORKDIR /app/build
CMD ["node", "bundle.js"]
