const router = require('koa-router')();
const axios = require('axios');
const request = require('request');
const fs = require('fs')

router.prefix('/blog/manage/common');

/**
 * POST TEST
 */
router.post('/upload', async (ctx, next) => {
  const file = ctx.request.files.file;
  // let formdata = new FormData()
  // formdata.append('file', ctx.request.files.file)
  // let dat = await axios({
  //   method: 'POST',
  //   url: 'http://127.0.0.1:3000/core/oss/upload',
  //   headers: {
  //     'Content-Type': 'multipart/form-data'
  //   },
  //   data: formdata,
  // });
  // console.log(dat.data);
  var options = {
    url: 'http://127.0.0.1:3000/core/oss/upload',
    method: 'POST',
    formData: {
      files: [
        {
          value: fs.createReadStream(file.path),
          options: {
            filename: file.name,
            contentType: file.mimeType
          }
        }
      ]
    }
  };

  axios({
    url: 'http://127.0.0.1:3000/core/oss/upload',
    method: 'POST',
    formData: {
      files: [
        {
          value: fs.createReadStream(file.path),
          options: {
            filename: file.name,
            contentType: file.mimeType
          }
        }
      ]
    }
  }).then(res => {
    console.log(res);
  })

  // request(options).then(res => {
  //   console.log(res);
  // });
  // const res = await ctx.req.pipe(request.post('http://127.0.0.1:3000/core/oss/upload'));
  // console.log(JSON.stringify(res));
  ctx.body = ctx.DATA;
});

module.exports = router;