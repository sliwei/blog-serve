const fetch = require('node-fetch')
const FormData = require('form-data')
const fs = require('fs')
const conf = require('../../config')

/**
 * @swagger
 * /blog/manage/common/upload:
 *   post:
 *     tags:
 *       - server
 *     summary: 图片
 *     description: 说明
 *     requestBody:
 *       description: Pet object that needs to be added to the store
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: 文件
 *     responses:
 *       '200':
 *         description: 成功说明
 *       '400':
 *         description: 失败说明
 */
const upload = async (ctx, next) => {
  const file = ctx.request.files.file
  let formData = new FormData()
  formData.append('file', fs.createReadStream(file.path), {
    filename: file.name //上传的文件名
    // contentType: 'image/png',//文件类型标识
  })
  const response = await fetch(`${conf.api_url.API_CORE}/core/oss/upload`, {
    body: formData,
    method: 'POST', //请求方式
    headers: formData.getHeaders()
  })
  const res = await response.json()
  ctx.DATA.data = res.data
  ctx.body = ctx.DATA
}

module.exports = {
  upload
}
