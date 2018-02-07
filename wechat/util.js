

/*
 * 工具文件
 * 解析xml
 */
'use strict'

var xml2js = require('xml2js');
var Promise = require('bluebird');
var tpl = require('./tpl');
var util = require('../libs/util')
var path = require('path')
var request = require('request')
console.log(__dirname)

var wechat_file = path.join(__dirname,'../config/wechat.txt');
exports.parseXMLAsync = function(xml){
	return new Promise(function(resolve,reject){
		xml2js.parseString(xml,{trim:true},function(err,content){
			err ? reject(err) : resolve(content);
		})
	});
}

function formatMessage(result){
	var message = {};
	if(typeof result === 'object'){
		var keys = Object.keys(result);
		for(var i=0;i<keys.length;i++){
			var key = keys[i];
			var item = result[key];
			if(!(item instanceof Array) || item.length === 0) continue;
			if (item.length === 1){
				var val = item[0];
				if (typeof val === 'object') message[key] = formatMessage(val);
				else message[key] = (val || '').trim();
			}else{
				message[key] = [];
				for(var j=0,k=item.length;j<k;j++) message[key].push(formatMessage(item[j]));
			}
		}
	}
	return message;
}

exports.formatMessage = formatMessage;
exports.tpl = function(content,message){
	var info = {};
	var type = 'text';
	var fromUserName = message.FromUserName;
	var toUserName = message.ToUserName;

	if(Array.isArray(content)) type = 'news';
	type = content.type || type;
	info.content = content;
	info.createTime = new Date().getTime();
	info.msgType = type;
	info.fromUserName = toUserName;
	info.toUserName = fromUserName;

	return tpl.compiled(info);
}

exports.accessToken = function(){
	function accessToken(){
		this.access_token=null;
		this.expires_in=null;
	}
	// 如果this上已经存在有效的access_token，直接返回this对象
	accessToken.prototype.init = function(){
		if(this.access_token && this.expires_in){
			if(checkToken(this)){
				return Promise.resolve(util.readFileAsync(wechat_file));
			}
		}
		util.readFileAsync(wechat_file).then(function(data){
			try{
				data = JSON.parse(data);
			}catch(e){
				return updateAccessToken();
			}
			if(checkToken(data)){
				return Promise.resolve(data);
			}else{
				return updateAccessToken();
			}
		}).then(function(data){
			that.access_token = data.access_token;
			that.expires_in = data.expires_in;
			util.writeFileAsync(JSON.stringify(data));
			return Promise.resolve(data);
		});
	}
	}
	

	

function checkToken(data){
	if(!data || !data.access_token || !data.expires_in) return false;
	var access_token = data.access_token;
	var expires_in = data.expires_in;
	var now = new Date().getTime();
	return (now < expires_in) ? true : false;
}
function updateAccessToken(){
	var appID = this.appID;
	var appSecret = this.appSecret;
	var url = api.accessToken + '&appid='+ appID +'&secret='+ appSecret;

	return new Promise(function(resolve,reject){
		request({url:url,json:true}).then(function(response){
			var data = response.body;
			var now = new Date().getTime();
			var expires_in = now + (data.expires_in - 20) * 1000;   //考虑到网络延迟、服务器计算时间,故提前20秒发起请求
			data.expires_in = expires_in;
			resolve(data);
		});
	});
}
exports.jsapiTicket = function(token){
	request(
		"https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token="+token+"&type=jsapi",
		function(err,res,body){
			console.log('////jsapi////')
			console.log(res,body)
	})
}