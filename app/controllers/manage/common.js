const rp = require('request-promise');
const fs = require('fs');

/**
 * 单张图片上传
 */
const upload = async (ctx, next) => {
  const file = ctx.request.files.file;
  let options = {
    url: 'http://0.0.0.0:3005/core/oss/upload',
    method: 'POST',
    formData: {
      file: [
        {
          value: fs.createReadStream(file.path),
          options: {
            filename: file.name,
            contentType: file.mimeType
          }
        },
        {
          value: fs.createReadStream(file.path),
          options: {
            filename: file.name,
            contentType: file.mimeType
          }
        },
      ]
    }
  };
  let dat = await rp(options);
  let res = JSON.parse(dat);
  delete res.data.res;
  ctx.DATA = res;
  ctx.body = ctx.DATA;
};

module.exports = {
  upload,
};
