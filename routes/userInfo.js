const Router = require('koa-router')
const router = Router()
const dayjs = require('dayjs')
const DB = require('../db/db')
// 给路由加个前缀
// const router = Router({
//     prefix:'/api'
// });

// 个人信息管理
router.get('/userInfo', async(ctx)=>{
    const data = await DB.find('userInfo',{},false)
    const result = {
        code:0,
        data,
        message:'请求成功！'
    }
    ctx.body = result;
})

router.post('/userInfo',async(ctx)=>{
    const {
        name,
        avtorUrl,
        des,
        location,
        social,
    } = ctx.request.body
    const timestamp=dayjs(new Date()).format('YYYY-MM-DD HH:mm')
    const id = Number(Math.random().toString().substr(3,10) + Date.now()).toString(36);
    const bodyData = {
        id,
        name,
        avtorUrl,
        des,
        location,
        social,
        createTime:timestamp,
        updateTime:timestamp
    }
    try {
        const data = await DB.insert('userInfo',bodyData)
        const result = {
            code:0,
            data,
            message:'新增成功!'
        } 
        ctx.body = result;
    } catch (error) {
        const result = {
            code:-1,
            data:error,
            message:'新增失败!'
        } 
        ctx.body = result;
    }
})

router.put('/userInfo',async(ctx)=>{
    const {
        id,
        name,
        avtorUrl,
        des,
        location,
        social,
    } = ctx.request.body
    const timestamp=dayjs(new Date()).format('YYYY-MM-DD HH:mm')
    const bodyData = {
        name,
        avtorUrl,
        des,
        location,
        social,
        updateTime:timestamp
    }
    try {
        const data = await DB.update('userInfo',{id},bodyData)
        const result = {
            code:0,
            data,
            message:'更新成功!'
        } 
        ctx.body = result;
    } catch (error) {
        console.log(error)
        const result = {
            code:-1,
            data:error,
            message:'更新失败!'
        } 
        ctx.body = result;
    }
})

module.exports = router;