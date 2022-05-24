const Router = require('koa-router')
const router = Router()
const path = require('path');
const fs = require('fs')
// 给路由加个前缀
// const router = Router({
//     prefix:'/api'
// });

router.post('/file', async (ctx) => {
  console.log(ctx.request.files)
  // 获取图片源
  const file = ctx.request.files.file
  console.log(file)
  // 接受读出流
  const reader = fs.createReadStream(file.path)
  // 修改文件名称
  const myDate = new Date()
  const newFilename = myDate.getTime() + '.' + file.name.split('.')[1]
  // 创建写入流
  const stream = fs.createWriteStream(path.join('../upload',newFilename))
  // 用管道将读出流‘倒给’输入流
  reader.pipe(stream)
  // 打印上传文件在服务器上存储的相对路径
  console.log('uploading %s -> %s', file.name, stream.path)
  // 重定向到基于根目录的静态资源web访问路径，展示图片
  // ctx.redirect(stream.path.substr(6).replace(/\\/g,'/'))
  // console.log(stream.path.substr(6).replace(/\\/g,'/'))
  return ctx.body = { 
    code: 0, 
    data: { 
      url: 'http://' + ctx.headers.host + '/upload/' + newFilename
    }
  };
})


module.exports = router;
