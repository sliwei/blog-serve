local NAME="blog-serve";
local CONF="/data/config";
local ROOT="/drone/src";
local RUN="/data/docker/" + NAME;

[
  {
    "kind": "pipeline",
    "type": "docker",
    "name": "deploy",
    "steps": [
//      {
//        "name": "restore-cache",
//        "image": "drillster/drone-volume-cache",
//        "settings": {
//          "restore": true,
//          "mount": [
//            "./node_modules"
//          ]
//        },
//        "volumes": [
//          {
//            "name": "cache",
//            "path": "/cache"
//          }
//        ]
//      },
//      {
//        "name": "build & copy",
//        "image": "node:14",
//        "volumes": [
//          {
//            "name": "config-conf",
//            "path": CONF
//          }
//        ],
//        "commands": [
//          "yarn",
//          "cp -rf "+CONF+"/mysql-orm.js "+ROOT+"/app/config/mysql.js",
//          "cp -rf "+CONF+"/gt.js "+ROOT+"/app/config/gt.js",
//          "yarn build:live",
//        ]
//      },
      {
        "name": "docker build&&push",
        "image": "plugins/docker",
        "settings": {
          "username": "admin",
          "password": {
            "from_secret": "registry_password"
          },
          "repo": "registry.bstu.cn/admin/"+NAME,
          "registry": "registry.bstu.cn"
        }
      },
      {
        "name": "rebuild-cache",
        "image": "drillster/drone-volume-cache",
        "settings": {
          "rebuild": true,
          "mount": [
            "./node_modules"
          ]
        },
        "volumes": [
          {
            "name": "cache",
            "path": "/cache"
          }
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
            "docker-compose up -d"
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
        "name": "cache",
        "host": {
          "path": "/tmp/cache"
        }
      }
    ]
  }
]
