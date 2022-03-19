#!/bin/sh
# 替换数据库与GT秘钥
sed -i "s/##DATABASE##/${DATABASE}/" dist/server.js
sed -i "s/##USERNAME##/${USERNAME}/" dist/server.js
sed -i "s/##PASSWORD##/${PASSWORD}/" dist/server.js
sed -i "s/##HOST##/${HOST}/" dist/server.js
sed -i "s/##PORT##/${PORT}/" dist/server.js
sed -i "s/##GT_ID##/${GT_ID}/" dist/server.js
sed -i "s/##GT_KEY##/${GT_KEY}/" dist/server.js
# 启动应用
node dist/server.js