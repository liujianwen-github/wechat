/*
 * 配置文件
 * 
 */
'use strict'

var path = require('path');
var util = require('./libs/util');

var wechat_file = path.join(__dirname,'./config/wechat.txt');

var config = {
	wechat:{
		appID:'wx0534c81fb07b1e9b',
		appSecret:'c82ff2b506095e2b445846bbbcc73c2c',
		token:'weixin',
		getAccessToken:function(){
			console.log('get access_token')
			return util.readFileAsync(wechat_file);
		},
		saveAccessToken:function(data){
			console.log('save access_token')
			return util.writeFileAsync(wechat_file,data);
		},
	}
};

module.exports = config;