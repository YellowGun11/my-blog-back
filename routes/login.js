const Router = require("koa-router");
const jsonwebtoken = require('jsonwebtoken')
const router = Router();
const DB = require("../db/db");

const SECRET = 'yellow11'
// 给路由加个前缀
// const router = Router({
//     prefix:'/api'
// });

router.post("/login", async (ctx) => {

  //从request中获取GET请求
  // query：返回的是格式化好的参数对象。
  // querystring：返回的是请求字符串
  // let bodyData = ctx.request.querystring;
  console.log(ctx.request.body);
  const { username, password } = ctx.request.body;
  const data = await DB.find("acount", { username, password }, false);
  const len = data.length;
  let result;
  if (len > 0) {
    result = {
      code: 0,
      data: {
        id: data[0]._id,
        name: data[0].username,
        token: jsonwebtoken.sign(
          { name:data[0].username, id:data[0]._id },
          SECRET,
          { expiresIn: '1h' }
        )
      },
      message: "登录成功！",
    };
  } else {
    result = {
      code: -1,
      data: {},
      message: "账号或密码错误！",
    };
  }
  ctx.body = result;
});

module.exports = router;
