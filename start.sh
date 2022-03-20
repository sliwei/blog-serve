#!/bin/sh
# 替换数据库与GT秘钥
sed -i "s/##DATABASE##/${DATABASE}/" app/server.js
sed -i "s/##USERNAME##/${USERNAME}/" app/server.js
sed -i "s/##PASSWORD##/${PASSWORD}/" app/server.js
sed -i "s/##HOST##/${HOST}/" app/server.js
sed -i "s/##PORT##/${PORT}/" app/server.js
sed -i "s/##GT_ID##/${GT_ID}/" app/server.js
sed -i "s/##GT_KEY##/${GT_KEY}/" app/server.js
# 启动应用
node app/server.js