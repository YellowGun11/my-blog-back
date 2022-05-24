const Router = require('koa-router')
const router = Router()
const dayjs = require('dayjs')
const DB = require('../db/db')
// 给路由加个前缀
// const router = Router({
//     prefix:'/api'
// });

// 分类管理
router.get('/classfiy', async(ctx)=>{
    let { beginIndex, limit} = ctx.request.querystring;
    const data = await DB.find('classfiy',{},true,{beginIndex,limit})
    const result = {
        code:0,
        data,
        message:'请求成功！'
    }
    ctx.body = result;
})
 // 获取所有分类标签
router.get('/classfiyAll',async(ctx)=>{
    const data = await DB.find('classfiy',{},false)
    const reuslt = {
        code:0,
        data,
        message:'请求成功！'
    }
    ctx.body = result;
})

router.post('/classfiy',async(ctx)=>{
    const {
        name,
        status=0,
    } = ctx.request.body
    const timestamp=dayjs(new Date()).format('YYYY-MM-DD HH:mm')
    const id = Number(Math.random().toString().substr(3,10) + Date.now()).toString(36);
    const bodyData = {
        id,
        name,
        status:Number(status),
        createTime:timestamp,
        updateTime:timestamp
    }
    try {
        const data = await DB.insert('classfiy',bodyData)
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

router.put('/classfiy',async(ctx)=>{
    const {
        id,
        name,
        status,
    } = ctx.request.body
    const timestamp=dayjs(new Date()).format('YYYY-MM-DD HH:mm')
    const bodyData = {
        name,
        status:Number(status),
        updateTime:timestamp
    }
    try {
        const data = await DB.update('classfiy',{id},bodyData)
        const result = {
            code:0,
            data,
            message:'更新成功!'
        } 
        ctx.body = result;
    } catch (error) {
        const result = {
            code:-1,
            data:error,
            message:'更新失败!'
        } 
        ctx.body = result;
    }
})

router.del('/classfiy/:id',async(ctx)=>{
    const { id } = ctx.params;
    try {
        const data = await DB.remove('classfiy',{id})
        const result = {
            code:0,
            data,
            message:'删除成功!'
        } 
        ctx.body = result;
    } catch (error) {
        const result = {
            code:0,
            data:error,
            message:'删除失败!'
        } 
        ctx.body = result;
    }
})

module.exports = router;