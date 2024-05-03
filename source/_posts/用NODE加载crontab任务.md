---
title: 用NODE加载crontab任务
tags:
  - 教程
categories:
  - 互联网
  - 原创
mathjax: true
date: 2022-11-16 19:02:52
---
# 前言
众所周知有诸多平台可以实现定时任务，像：阿里云函数，Github Actions，服务器中的crontab。
如果不希望定时任务过于分散，我们可以全部写在一个文件里，然后用nodejs来加载这个文件，统一调用，实现定时任务。
大多数定时任务改写成Node代码并不复杂！而且可以直接与我的Express项目放一起运行，节省资源开销。

# 代码
node-cron:是一个非常好用的定时任务库，可以很方便的实现定时任务。
使用起来非常简单，由如下代码所示：
```js schedule.js
const cron = require("node-cron");
module.exports = (app) => {
	//TODO 添加自动删除一个月前的日志
	console.log("schedule.js loaded");
	cron.schedule("0 */8 * * *", () => {
		subcache(app);
	});
	cron.schedule("*/15 * * * *", () => {
		cf2dns().then((result)=>{
			leancloud.add("Schedule", {
				name: "cf2dns",
				result
			});
		});
	});
};
```
目前实现了[`cf2dns`](https://github.com/ddgth/cf2dns)的功能（仅支持DNSPOD），可以每15min自动更新DNSPOD的Cloudflare优选IP记录。
以下是实现操作DNSPOD上的域名解析记录的相关js代码。
```js dnspod.js
const axios = require("axios");
const token = process.env.DNSPOD_TOKEN;
const querystring = require("querystring");
// 创建实例时配置默认值
const instance = axios.create({
	baseURL: "https://dnsapi.cn"
});

async function get_record(domain, subdomain) {
	const api = "/Record.List";
	const data = querystring.stringify({
		"domain": domain,
		"sub_domain": subdomain,
		"login_token": token,
		"format": "json"
	});
	const res = await instance.post(api, data);
	return res.data.records;
}

async function update_record(domain, record) {
	const {id, line, type, name, value} = record;
	const api = "/Record.Modify";
	const data = querystring.stringify({
		domain,
		record_id: id,
		value,
		record_line: line,
		record_type: type,
		sub_domain: name,
		"login_token": token,
		"format": "json",
	});
	const res = await instance.post(api, data);
	return res.data;
}

async function add_record(domain, record) {
	const {line, type, name, value} = record;
	const api = "/Record.Create";
	const data = querystring.stringify({
		domain,
		value,
		record_line: line,
		record_type: type,
		sub_domain: name,
		"login_token": token,
		"format": "json",
	});
	const res = await instance.post(api, data);
	return res.data;
}

async function del_record(domain, record) {
	const {id} = record;
	const api = "/Record.Remove";
	const data = querystring.stringify({
		domain,
		record_id: id,
		"login_token": token,
		"format": "json",
	});
	const res = await instance.post(api, data);
	return res.data;
}

module.exports = {get_record, update_record, add_record, del_record};
```
定时更新gd.home999.cc域名的Cloudflare优选IP记录，方便快捷。
有时候可能希望调用某个URL，来定时执行某些操作，如果本身是Express应用，可以像写NODE测试用例一样，使用`chaiHttp`来直接调用。
```js
function subcache(app) {
	console.log("Running Cron Job：subcache");
	chai.use(chaiHttp);
	chai.request(app)
		.get("/sub/cache")
		.end((err, res) => {
			leancloud.add("Schedule", {
				name: "subcache",
				result: res.text
			});
			console.log(res.text);
		});
}
```

# 后记
综上，可以很方便的实现定时任务。总有些任务需要定时操作，像数据库定期备份，文件定期缓存等。
通过引入定时任务的js脚本，就能在运行Express应用的同时，自动执行定时任务。