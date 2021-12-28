---
title: 阿里云函数自建无污染递归DoH解析
tags:
  - 教程
categories:
  - 互联网
  - 原创
mathjax: true
date: 2021-12-28 20:36:28
---
# 前言
由于众所周知的原因，DNS污染日趋花哨。正常的污染也就随意污染到一个海外地址，但现在污染到回环地址或直接不响应的情况都有发生。
而且境内想要直连无污染的公共DNS也越来越难。DoT，DoH都有不同程度的干扰。例：DoH会通过SNI检测直接Reset掉。
Clash的fallback是走直连线路的，所以需要我们选择一个境内直连可用的DNS解析器。
因此，有了自建无污染DNS解析器的想法，但是传统的53端口解析，明文不安全，
剩下的加密DNS方案中，DoH能更好的利用WEB技术，使DNS解析像访问网站一样常见。正好阿里云函数有HTTP解析器，可以方便低成本的搭建，不需要自己有一台海外的服务器。

# 准备工作
 - 一个不在黑名单的域名
 - 一个开通阿里云函数计算功能的阿里云账号
 - 一个开通容器镜像服务功能的阿里云账号

# 搭建过程
由于阿里云函数计算已经支持Docker镜像部署，而docker镜像部署也更为方便一些，所以这里选择使用容器镜像创建。
为了方便，我们选择一个Github上现成的[DoH服务软件](https://github.com/m13253/dns-over-https)，该软件支持Google与IETF的两种标准，并且支持ESC，能根据源IP地址，获取更精确的解析结果。
阿里云函数计算使用容器创建需要自己先把Docker镜像做好，然后上传做好的容器到阿里云的容器镜像服务中。
所以我们找一台linux，先在本地clone上面的项目，然后使用项目中的Dockerfile文件在本地构建好镜像，然后再上传到自己的阿里云账号下。
在阿里云的控制台——容器镜像服务中，新建个人实例。在镜像仓库中选择创建镜像仓库，仓库名称可以填doh，创建完毕后，就可以尝试在本地构建并上传镜像了，执行下面的代码。
```bash
git clone git@github.com:m13253/dns-over-https.git
cd dns-over-https
mv Dockerfile.server Dockerfile
docker build .
docker login --username=******* registry.cn-hongkong.aliyuncs.com
docker tag [ImageId] registry.cn-hongkong.aliyuncs.com/***/doh:[镜像版本号]
docker push registry.cn-hongkong.aliyuncs.com/***/doh:[镜像版本号]
```
上传好镜像后，后面的工作就很简单了
在阿里云函数中，选择香港地域后，先随便创建一个服务，然后在创建一个函数，选择使用容器镜像创建。
这时候要求你选择一个容器镜像，选刚才上传的容器镜像，可能还需要授权一下阿里云函数计算访问容器镜像服务。
创建完后就可以测试了，可以按一下测试函数，如果返回404等Http客户端错误，基本上运行服务器软件就没什么问题了。
然后就是去绑定自定义域名，添加一个路径`/dns-query`,选择刚才创建的服务和函数名就好了。
可以自己实验一下，能否正常解析。
```
curl -H 'accept: application/dns-json' 'https://{自定义域名}/dns-query?name=www.google.com&type=A' | jq
```
阿里云函数每月免费额度100万，个人使用基本上是够了的。