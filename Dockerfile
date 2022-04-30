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

# SET ENV then run docker run with --env
ENV LOADERIO_TOKEN=xxx

# create file with touch loaderio-[token].txt
# add content to the file loaderio-[token]
WORKDIR /overview
RUN echo "loaderio-${LOADERIO_TOKEN}" > loaderio-${LOADERIO_TOKEN}.txt 

WORKDIR /overview
RUN npm install
CMD [ "node", "server/server.js" ]
EXPOSE 8080