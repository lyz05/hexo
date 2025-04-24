---
title: 函数计算Serverless

date: 2015-12-11 18:55:44

type: "about"

comments: false

---
# [主流视频网站弹幕解析接口](//fc.lyz05.cn/)
<iframe src="//fc.lyz05.cn/" width="100%" height=800px style="border:none;"></iframe>

<!-- 
# 机场订阅链接
输入用户名获取您的专属订阅链接：
<form name="sub" action="//fc.lyz05.cn/sub" method="get">
    <input id="user" type="text" placeholder="用户名" name="user"></input>&nbsp;&nbsp;
    <input type="submit"></input>
</form> 
-->

# [机场软件下载](//sub.lyz05.cn/sub/download)
<iframe src="//sub.lyz05.cn/sub/download" width="100%" height=900px style="border:none;"></iframe>

# [订阅转换](//sub.lyz05.cn/)
<iframe src="//sub.lyz05.cn/" width="100%" height=950px style="border:none;"></iframe>

# DNS Over HTTPS
地址：https://sub.lyz05.cn/dns-query
上游使用香港腾讯云https://doh.pub/dns-query
简单测试：
```bash
curl -H 'accept: application/dns-json' 'https://sub.lyz05.cn/dns-query?name=www.google.com&type=A' | jq
```
<form name="dns" action="//sub.lyz05.cn/dns-query" method="get">
    <input type="name" placeholder="DNS Name" name="name"></input>&nbsp;&nbsp;
    <input type="submit" value="Resolve"></input>
</form>

# [Cloudflare反代](//gd.lyz05.cn/proxy/)
<iframe src="//gd.lyz05.cn/proxy/" width="100%" height=260px style="border:none;"></iframe>

# 115网盘离线下载
<form name="115" action="https://upload-fc-tvb-ktyrokgrdn.cn-shenzhen.fcapp.run" method="get">
    <input type="url" placeholder="URL" name="url"></input>&nbsp;&nbsp;
    <input type="submit" value="Resolve"></input>
</form>