# THIS VERSION NOT WORKING (FROM HR)
# FROM node:8.0
# RUN mkdir /overview
# ADD . /overview
# WORKDIR /overview
# RUN npm install
# EXPOSE 8080
# CMD [ "node", "server/server.js" ]

# THIS VERSION WORK
FROM node:12-alpine
RUN apk add --no-cache python2 g++ make
WORKDIR /overview
COPY . /overview
WORKDIR /overview
RUN npm install
CMD [ "node", "server/server.js" ]
EXPOSE 8080