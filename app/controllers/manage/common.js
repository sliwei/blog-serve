const request = require('request')
const fs = require('fs')
const conf = require('../../config')

/**
 * 单张图片上传
 */
const upload = async (ctx, next) => {
  const file = ctx.request.files.file
  ctx.DATA = await request({
    url: `${conf.api_url.API_CORE}/core/oss/upload`,
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
        }
      ]
    }
  })
  ctx.body = ctx.DATA
}

module.exports = {
  upload
}
