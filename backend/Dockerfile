# build stage
FROM node:14-alpine
WORKDIR /app
COPY . .
RUN mkdir log
RUN touch log/node.access.log
RUN touch log/node.error.log
RUN yarn
RUN yarn build
EXPOSE 3000
CMD ["node", "./build/bundle.js"]
