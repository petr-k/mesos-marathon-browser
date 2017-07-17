FROM node:8

RUN mkdir -p /data/app

COPY server /data/app
COPY build /data/app/build

WORKDIR /data/app

RUN yarn

CMD ["yarn", "start"]
EXPOSE 3001
