FROM ubuntu
MAINTAINER Raphaël Rougeron goldoraf@gmail.com

# the ubuntu image is really minimalist, we need to include universe in apt's sources
RUN echo "deb http://archive.ubuntu.com/ubuntu precise main universe" > /etc/apt/sources.list
RUN apt-get update

# we need build tools & add-apt-repository command
RUN apt-get install build-essential python-software-properties

# install node.js
RUN add-apt-repository ppa:chris-lea/node.js
RUN apt-get update
RUN apt-get install nodejs

RUN npm install grunt-cli -g

ADD . /osef
RUN cd /osef; npm install

EXPOSE 8020