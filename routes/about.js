const Router = require('koa-router')
const router = Router()
const dayjs = require('dayjs')
const DB = require('../db/db')
// 给路由加个前缀
// const router = Router({
//     prefix:'/api'
// });

// 关于管理
router.get('/about', async (ctx) => {
  const data = await DB.find('about', {}, false)
  const result = {
    code: 0,
    data,
    message: '请求成功！'
  }
  ctx.body = result;
})

router.post('/about', async (ctx) => {
  const {
    imgUrl,
    content,
  } = ctx.request.body
  // const timestamp = new Date().getTime()  // 时间戳
  const timestamp = dayjs(new Date()).format('YYYY-MM-DD HH:mm')
  const id = Number(Math.random().toString().substr(3, 10) + Date.now()).toString(36);
  const bodyData = {
    id,
    imgUrl,
    content,
    createTime: timestamp,
    updateTime: timestamp
  }
  try {
    const data = await DB.insert('about', bodyData)
    const result = {
      code: 0,
      data: data,
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

router.put('/about', async (ctx) => {
  const {
    id,
    imgUrl,
    content,
  } = ctx.request.body
  const timestamp = dayjs(new Date()).format('YYYY-MM-DD HH:mm')
  const bodyData = {
    imgUrl,
    content,
    updateTime: timestamp
  }
  try {
    const data = await DB.update('about', { id }, bodyData)
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

module.exports = router;