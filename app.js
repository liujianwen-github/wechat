
'use strict'

var Koa = require('koa');
var config = require('./config');
var weixin = require('./weixin');
var wechat = require('./wechat/wechat')
var generator = require('./wechat/generator');
var router = require('koa-route')
var app = new Koa();
var util = require('./wechat/util')

const jssdk = ctx => {
  
  // accessToken.init()


  console.log(ctx)
  ctx.response.body = 'jssdk';
};
// app.use(generator(config.wechat, weixin.reply)); //handler

// console.log(router)
// app.use(router.get('/',generator(config.wechat, weixin.reply)))
// app.use(router.get('/',weixin.setMenu))
// app.use(weixin.setMenu);

app.use(router.get('/jssdk', jssdk));
app.listen(8080);

console.log('Listening 8080...')