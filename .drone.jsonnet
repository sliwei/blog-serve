local NAME="blog-serve";
local CONF="/data/config";
local ROOT="/drone/src";
local RUN="/data/wwwroot/" + NAME;

[
  {
    "kind": "pipeline",
    "type": "docker",
    "name": "deploy",
    "steps": [
      {
        "name": "build & copy",
        "image": "node:14.19.0-slim",
        "volumes": [
          {
            "name": "config-conf",
            "path": CONF
          },
          {
            "name": "run-conf",
            "path": RUN
          }
        ],
        "commands": [
          "yarn",
          "cp -rf "+CONF+"/mysql-orm.js "+ROOT+"/app/config/mysql.js",
          "cp -rf "+CONF+"/gt.js "+ROOT+"/app/config/gt.js",
          "yarn build",
          "mkdir -p "+RUN,
          "mkdir -p "+RUN+"/app",
          "rm -rf "+RUN+"/app/public/* && cp -rf "+ROOT+"/app/public "+RUN+"/app",
          "rm -rf "+RUN+"/app/views/* && cp -rf "+ROOT+"/app/views "+RUN+"/app",
          "rm -rf "+RUN+"/script/* && cp -rf "+ROOT+"/script "+RUN,
          "cp -rf "+ROOT+"/app/server.js "+RUN+"/app/server.js",
          "cp -rf "+ROOT+"/package.json "+RUN+"/package.json",
          "cp -rf "+ROOT+"/yarn.lock "+RUN+"/yarn.lock",
          "cp -rf "+ROOT+"/processes.json "+RUN+"/processes.json"
        ]
      },
      {
        "name": "start || restart",
        "image": "appleboy/drone-ssh",
        "settings": {
          "host": "bstu.cn",
          "username": "root",
          "password": {
            "from_secret": "ssh_key"
          },
          "port": 22,
          "command_timeout": "10m",
          "script_stop": false,
          "script": [
            "cd "+RUN,
            "yarn",
            "pm2 info "+NAME,
            "test $? -eq 0 && (yarn restart && echo Restart the success!) || (yarn pm2 && echo The first startup succeeded!)"
          ]
        }
      },
      {
        "name": "notify",
        "pull": "if-not-exists",
        "image": "guoxudongdocker/drone-dingtalk:latest",
        "settings": {
          "token": {
            "from_secret": "dingtalk_token"
          },
          "type": "markdown",
          "message_color": true,
          "message_pic": true,
          "sha_link": true
        },
        "when": {
          "status": [
            "failure",
            "success"
          ]
        }
      }
    ],
    "volumes": [
      {
        "name": "config-conf",
        "host": {
          "path": CONF
        }
      },
      {
        "name": "run-conf",
        "host": {
          "path": RUN
        }
      }
    ]
  }
]
