const Router = require('koa-router')
const router = Router()
const dayjs = require('dayjs')
const DB = require('../db/db')
// 给路由加个前缀
// const router = Router({
//     prefix:'/api'
// });

// 照片管理
router.get('/photo', async (ctx) => {
  let { beginIndex, limit } = ctx.request.querystring;
  const data = await DB.find('photo', {}, true, { beginIndex, limit })
  const result = {
    code: 0,
    data,
    message: '请求成功！'
  }
  ctx.body = result;
})

router.post('/photo', async (ctx) => {
  const {
    imgUrl,
    name,
    status = 0,
  } = ctx.request.body
  const timestamp = dayjs(new Date()).format('YYYY-MM-DD HH:mm')
  const id = Number(Math.random().toString().substr(3, 10) + Date.now()).toString(36);
  const bodyData = {
    id,
    imgUrl,
    name,
    status:Number(status),
    createTime: timestamp,
    updateTime: timestamp
  }
  try {
    const data = await DB.insert('photo', bodyData)
    const result = {
      code: 0,
      data,
      message: '新增成功!'
    }
    ctx.body = result;
  } catch (error) {
    const result = {
      code: -1,
      data: error,
      message: '新增失败!'
    }
    ctx.body = result;
  }
})

router.put('/photo', async (ctx) => {
  const {
    id,
    imgUrl,
    name,
    status,
  } = ctx.request.body
  const timestamp = dayjs(new Date()).format('YYYY-MM-DD HH:mm')
  const bodyData = {
    imgUrl,
    name,
    status:Number(status),
    updateTime: timestamp
  }
  try {
    const data = await DB.update('photo', { id }, bodyData)
    const result = {
      code: 0,
      data: data,
      message: '更新成功!'
    }
    ctx.body = result;
  } catch (error) {
    const result = {
      code: -1,
      data: error,
      message: '更新失败!'
    }
    ctx.body = result;
  }
})

router.del('/photo/:id', async (ctx) => {
  const { id } = ctx.params;
  try {
    const data = await DB.remove('photo', { id })
    const result = {
      code: 0,
      data,
      message: '删除成功!'
    }
    ctx.body = result;
  } catch (error) {
    const result = {
      code: -1,
      data: error,
      message: '删除失败!'
    }
    ctx.body = result;
  }
})

module.exports = router;