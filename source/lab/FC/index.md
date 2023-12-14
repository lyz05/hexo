---
title: 函数计算Serverless

date: 2015-12-11 18:55:44

type: "about"

comments: false

---
# [主流视频网站弹幕解析接口](//fc.home999.cc/)
<iframe src="//fc.home999.cc/" width="100%" height=770px style="border:none;"></iframe>

# 机场订阅链接
输入用户名获取您的专属订阅链接：
<form name="sub" action="//fc.home999.cc/sub" method="get">
    <input type="text" placeholder="用户名" name="user"></input>&nbsp;&nbsp;
    <input type="submit"></input>
</form>

# [机场软件下载](//sub.home999.cc/sub/download)
<iframe src="//sub.home999.cc/sub/download" width="100%" height=900px style="border:none;"></iframe>

# [订阅转换](//sub.home999.cc/)
<iframe src="//sub.home999.cc/" width="100%" height=950px style="border:none;"></iframe>

# DNS Over HTTPS
地址：https://sub.home999.cc/dns-query
使用[该项目](https://github.com/m13253/dns-over-https)搭建于香港阿里云函数计算
支持EDNS，支持[Google](https://developers.google.com/speed/public-dns/docs/dns-over-https)与[IETF](https://www.rfc-editor.org/rfc/rfc8484.txt)标准。
上游使用Google Public DNS。
简单测试：
```bash
curl -H 'accept: application/dns-json' 'https://sub.home999.cc/dns-query?name=www.google.com&type=A' | jq
```
<form name="dns" action="//sub.home999.cc/dns-query" method="get">
    <input type="name" placeholder="DNS Name" name="name"></input>&nbsp;&nbsp;
    <input type="submit" value="Resolve"></input>
</form>

# [Cloudflare反代](//gd.home999.cc/proxy/)
<iframe src="//gd.home999.cc/proxy/" width="100%" height=260px style="border:none;"></iframe>

# [GitHub文件加速](//gd.home999.cc/gh-proxy/)
<iframe src="//gd.home999.cc/gh-proxy/" width="100%" height=730px style="border:none;"></iframe>
