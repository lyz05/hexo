---
title: 用NODE解压缩爱奇艺弹幕文件
tags:
  - 教程
categories:
  - 互联网
  - 原创
mathjax: true
date: 2022-11-16 19:21:14
---
# 前言
因为Django的效率问题，以及Python冷启动可能会比Node要慢。
所以把我现有的Django项目用Express重构，重构过程中遇到zlib解压缩爱奇艺弹幕数据的问题。
在网上能找到的Node解压爱奇艺数据的只有下面这篇博文。
[《中国新说唱2020》不完全数据大屏](https://yiluyanxia.github.io/c03ee65c.html)
但可惜的是博主没有公开相关源码，所以我自己瞎试找到了解决方案。
核心代码如下：
稍微解释一下：promises是我用循环把用axios包装所有的弹幕地址，axios返回的是Promise。
再用Promise.all去异步请求所有的弹幕文件，就能得到二进制的压缩后的弹幕文件数据。
想要解压就要用到`pako.inflate(value, {to: "string"})`。
我是参考了两篇stackoverflow上的回答，才找到了这个方法。具体请看文末的参考资料。
``` js
const api_url = `https://cmts.iqiyi.com/bullet/${tvid.slice(-4, -2)}/${tvid.slice(-2)}/${tvid}_300_${i + 1}.z`;
const params = {
  rn: "0.0123456789123456",
  business: "danmu",
  is_iqiyi: "true",
  is_video_page: "true",
  tvid: tvid,
  albumid: albumid,
  categoryid: categoryid,
  qypid: "01010021010000000000"
};
promises.push(axios({method: "get", url: api_url, params: params, responseType: "arraybuffer"}));
const values = await Promise.all(promises);
const pako = require("pako");
const datas = values
			.map(value => value.data)
			.map(value => pako.inflate(value, {to: "string"}));
```

# 参考资料
[Use zlib.js to decompress python zlib compress](https://stackoverflow.com/questions/47057832/use-zlib-js-to-decompress-python-zlib-compress)
[Python's zlib decompresses data, but Pako (JavaScript zlib) fails](https://stackoverflow.com/questions/70827921/pythons-zlib-decompresses-data-but-pako-javascript-zlib-fails)