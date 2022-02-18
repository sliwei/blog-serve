const cp = require('child_process')
const path = require('path')

/**
 * 部署
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
const deploy = async (ctx, next) => {
  const { name, branch = 'undefined', env = 'undefined' } = ctx.request.body
  // const cicd = await fetch(
  //   `${conf.api_url.devopsAPI}/deploy?name=${name}&branch=${branch}&env=${env}`
  // )
  // const cicd_res = await cicd.json()
  // ctx.body = cicd_res
  //
  // const name = ctx.query.name
  // const branch = ctx.query.branch || 'undefined'
  // const env = ctx.query.env || 'undefined'
  const proc = cp.exec(`sh ${path.join(__dirname, `../../../script/deploy.sh ${name} ${branch} ${env}`)}`, () => {});
  proc.stdout.pipe(process.stdout)
  proc.stderr.pipe(process.stderr)
  console.log(`${name},${branch},${env} success~`)
  ctx.body = ctx.json(ctx.DATA)
}

module.exports = { deploy }
