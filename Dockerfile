# syntax=docker/dockerfile:1
FROM node:8.0
RUN mkdir /overview
ADD . /overview
WORKDIR /overview
RUN npm install
EXPOSE 8080
CMD [ "node", "server/server.js" ]