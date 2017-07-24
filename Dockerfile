FROM node:8 AS builder

COPY src /data/builder/src
COPY public /data/builder/public
COPY package.json yarn.lock /data/builder/

WORKDIR /data/builder

RUN yarn build:ci

# -----

FROM node:8
RUN mkdir -p /data/app

COPY server /data/app
COPY --from=builder /data/builder/build /data/app/build

WORKDIR /data/app

RUN yarn

CMD ["yarn", "start"]
EXPOSE 3001
