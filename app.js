const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const path = require('path');
const static = require('koa-static');
const koaBody = require("koa-body")
const koajwt = require('koa-jwt')
const jsonwebtoken = require('jsonwebtoken')
const loginRouter = require('./routes/login');
const articleRouter = require('./routes/article');
const aboutRouter = require('./routes/about');
const classfiyRouter = require('./routes/classfiy');
const photoRouter = require('./routes/photo');
const userInfoRouter = require('./routes/userInfo');
const commonRouter = require('./routes/common');

const SECRET = 'yellow11'

const app = new Koa()
const staticPath = './static'
app.use(bodyParser({})) //解析request的body
// 使用文件上传中间件
app.use(koaBody({ 
    multipart: true,
    formidable: {
        maxFileSize: 500*1024*1024    // 设置上传文件大小最大限制，默认5M
    }
}))
app.use(static(path.join(__dirname, staticPath))) //静态资源请求

// 中间件对401错误进行
app.use(async (ctx, next) => {
    return next().catch((err) => {
      if (err.status === 401) {
        ctx.status = 401;
        ctx.body = {
          code: 401,
          msg: err.message
        }
      } else {
        throw err;
      }
    })
});
  
app.use(koajwt({ secret: SECRET }).unless({
    // 登录接口不需要验证
    path: [
      /^\/login/,
      /^\/userInfo/,
      /^\/userInfoUpdate/,
      /^\/article/,
      /^\/classfiy/,
      /^\/classfiyAll/,
      /^\/photo/,
      /^\/about/,
      /^\/file/,
    ]
}));

app.use(loginRouter.routes())
app.use(articleRouter.routes())
app.use(aboutRouter.routes())
app.use(classfiyRouter.routes())
app.use(photoRouter.routes())
app.use(userInfoRouter.routes())
app.use(commonRouter.routes())
app.listen(3001,()=>{
    console.log('app started at port 3001')
})