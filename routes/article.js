const Router = require('koa-router')
const router = Router()
const dayjs = require('dayjs')
const DB = require('../db/db')
// 给路由加个前缀
// const router = Router({
//     prefix:'/api'
// });

router.get('/article', async(ctx)=>{
    let { beginIndex, limit } = ctx.request.querystring;
    const data = await DB.find('article',{},true,{beginIndex,limit})
    const result = {
        code:0,
        data,
        message:'请求成功！'
    }
    ctx.body = result;
})
// 根据条件搜索文章列表
// router.get('/article', async(ctx)=>{
//     let bodyData = ctx.request.querystring;
//     const data = await DB.find('article',bodyData,false)
//     const result = {
//         code:200,
//         data,
//         message:'请求成功！'
//     }
//     ctx.body = result;
// })

router.post('/article',async(ctx)=>{
    const {
        imgUrl,
        title,
        des,
        tag,
        content,
        status=0,
        readNum=0,
    } = ctx.request.body
    const timestamp=dayjs(new Date()).format('YYYY-MM-DD HH:mm')
    const id = Number(Math.random().toString().substr(3,10) + Date.now()).toString(36);
    const bodyData = {
        id,
        imgUrl,
        title,
        des,
        tag,
        content,
        status:Number(status),
        readNum:Number(readNum),
        createTime:timestamp,
        updateTime:timestamp
    }
    try {
        const data = await DB.insert('article',bodyData)
        const result = {
            code:0,
            data:data,
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

router.put('/article',async(ctx)=>{
    const {
        id,
        imgUrl,
        title,
        des,
        tag,
        content,
        status,
        readNum,
    } = ctx.request.body
    const timestamp=dayjs(new Date()).format('YYYY-MM-DD HH:mm')
    const bodyData = {
        imgUrl,
        title,
        des,
        tag,
        content,
        status:Number(status),
        readNum:Number(readNum),
        updateTime:timestamp
    }
    try {
        const data = await DB.update('article',{id},bodyData)
        const result = {
            code:0,
            data:data,
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

router.del('/article/:id',async(ctx)=>{
    const { id } = ctx.params;
    try {
        const data = await DB.remove('article',{id})
        const result = {
            code:0,
            data:data,
            message:'删除成功!'
        } 
        ctx.body = result;
    } catch (error) {
        const result = {
            code:-1,
            data:error,
            message:'删除失败!'
        } 
        ctx.body = result;
    }
})

module.exports = router;