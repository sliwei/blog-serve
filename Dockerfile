FROM node:14.17.1-alpine

COPY node_modules /app/node_modules
COPY dist /app/dist
COPY script /app/script
COPY deploy.sh /app
COPY start.sh /app

#设置变量
ENV DATABASE=""
ENV USERNAME=""
ENV PASSWORD=""
ENV HOST=""
ENV PORT=""
ENV GT_ID=""
ENV GT_KEY=""

WORKDIR /app

EXPOSE 3004

RUN apk add --update \
          python \
          python-dev \
          py-pip \
          make \
          g++ && cd node_modules/node-pty && yarn run install

RUN ["chmod", "+x", "/app/start.sh"]

CMD ./start.sh

