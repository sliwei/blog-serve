FROM node:14.17.1-alpine

COPY dist /www
COPY node_modules /www/node_modules

#设置变量
ENV DATABASE=""
ENV USERNAME=""
ENV PASSWORD=""
ENV HOST=""
ENV PORT=""
ENV GT_ID=""
ENV GT_KEY=""

WORKDIR /www

EXPOSE 3000

# 如果build环境与运行环境不同需要执行pty的重新编译
#RUN apk add --update \
#          python \
#          python-dev \
#          py-pip \
#          make \
#          g++ && cd node_modules/node-pty && yarn run install

RUN ["chmod", "+x", "./start.sh"]

CMD ./start.sh

