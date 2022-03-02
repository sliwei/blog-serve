local NAME="blog-serve";
local CONF="/data/config";
local ROOT="/data/git/" + NAME;
local RUN="/data/wwwroot/" + NAME;

[
  {
    "kind": "pipeline",
    "type": "docker",
    "name": "deploy",
    "steps": [
      {
        "name": "copy",
        "image": "node:14",
        "volumes": [
          {
            "name": "config-conf",
            "path": CONF
          }
        ],
        "commands": [
          "pwd",
          "ls -l",
          /*
          "yarn",
          "cp -rf ${CONF}/mysql-orm.js ${ROOT}/app/config/mysql.js",
          "cp -rf ${CONF}/gt.js ${ROOT}/app/config/gt.js",
          "yarn",
          "",
          "",
          "",
          "",
          "cp -rf /drone/src/http/* /nginx-conf"
          */
        ]
      }
//      {
//        "name": "restart",
//        "image": "appleboy/drone-ssh",
//        "settings": {
//          "host": "bstu.cn",
//          "username": "root",
//          "password": {
//            "from_secret": "ssh_key"
//          },
//          "port": 22,
//          "command_timeout": "10m",
//          "script_stop": false,
//          "script": [
//            "nginx -t",
//            "test $? -eq 0 && nginx -s reload || exit 1",
//            "echo ✅ nginx restart complete~🎉"
//          ]
//        }
//      },
//      {
//        "name": "notify",
//        "pull": "if-not-exists",
//        "image": "guoxudongdocker/drone-dingtalk:latest",
//        "settings": {
//          "token": {
//            "from_secret": "dingtalk_token"
//          },
//          "type": "markdown",
//          "message_color": true,
//          "message_pic": true,
//          "sha_link": true
//        },
//        "when": {
//          "status": [
//            "failure",
//            "success"
//          ]
//        }
//      }
    ],
    "volumes": [
      {
        "name": "config-conf",
        "host": {
          "path": CONF
        }
      }
    ]
  }
]