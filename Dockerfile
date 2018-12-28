FROM node:9-slim

WORKDIR /opt/app/

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

CMD yarn start
