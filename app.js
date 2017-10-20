const Koa = require('koa');
const Router = require('koa-router');

const { getResultArr } = require('./crawler');

const app = new Koa();
app.use(require('koa2-cors')());

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

let router = new Router({ prefix: '/api' });
router.get('/user/:id/ani', async (ctx, next) => {
  const id = ctx.params.id;
  console.log(`crawler uid = ${id}`);
  let resultArr = await getResultArr(id);
  console.log(`crawler finish ${resultArr.length} item`);
  ctx.body = {
    data: resultArr
  };
});

app.use(router.routes()).use(router.allowedMethods());

module.exports = app;
