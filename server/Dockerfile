FROM node:11

WORKDIR /usr/app

COPY package.json /usr/app
COPY package-lock.json /usr/app

RUN npm install --progress=false --loglevel=notice

COPY . /usr/app
