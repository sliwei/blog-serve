const {BstuDevops} = require("../../models");
const cp = require('child_process')
const path = require('path')

/**
 * 部署
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
const build_devops = async (ctx, next) => {
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
/**
 * lw 友链列表
 */
const devops_list = async (ctx, next) => {
  ctx.DATA.data = await BstuDevops.findAll({
    where: {is_del: 0},
    order: [
      ['id', 'DESC']
    ]
  });
  ctx.body = ctx.DATA;
};

/**
 * lw 添加、修改、删除友链
 * @param id 编号
 * @param title 站点名称
 * @param website 友链地址
 * @param sta 删除1:删除 0:正常
 */
const operation_devops = async (ctx, next) => {
  let dat = ctx.request.body;
  let res;
  if (!dat.id) {
    // 新增
    res = await BstuDevops.create({
      name: dat.name,
      branch: dat.branch,
      env: dat.env,
      url: dat.url,
      website: dat.website,
    })
  } else {
    // 修改、删除
    let upDat = {
      name: dat.name,
      branch: dat.branch,
      env: dat.env,
      url: dat.url,
      is_del: dat.is_del,
    };
    !dat.name && delete upDat.name;
    !dat.branch && delete upDat.branch;
    // !dat.env && delete upDat.env;
    // !dat.url && delete upDat.url;
    !dat.is_del && delete upDat.is_del;
    res = await BstuDevops.update(
      upDat, {where: {id: dat.id}}
    )
  }
  if (ctx.state(res)) {
    ctx.DATA.code = 0;
  }
  ctx.body = ctx.DATA;
};

module.exports = {
  build_devops,
  devops_list,
  operation_devops,
};
