---
title: 单域名可实现Cloudflare Workers优选IP
tags:
  - 教程
categories:
  - 互联网
  - 原创
mathjax: true
date: 2024-03-24 11:09:45
---
# TLDR
鱼和熊掌不可兼得。
想要保留国内域名 DNS 服务器（如：DNSPOD）不变的情况下，还能接入CloudFlare服务。
在2021 年 11 月以前，可以使用cloudflare partner来实现。
在这之后，借助SaaS功能，两个域名，绑定信用卡也能实现。
那么有没有更好的方案呢？
为什么不想修改域名的NS记录到Cloudflare，一个最大的因素就是，国内的NS支持分运营商解析域名。
那么，可以考虑将子域名(dnspod.example.com)接入到DNSPOD上，主域名(example.com)接入到Cloudflare上。
主域名可以CNAME子域名下的域名。这样既能享受Cloudflare的服务，又支持分运营商解析。

# 主域名(example.com)接入Cloudflare
在购买域名的服务商将NS记录修改成Cloufalre提供的NS服务器即可。
```
NS	dan.ns.cloudflare.com
NS	mary.ns.cloudflare.com
```
接入成功后，配置workers相关路由。给workers使用的子域名配置小橙云。
假设workers使用的子域名为gd
![配置路由](/images/单域名可实现CloudflareWorkers优选IP/Screenshot_20240324112757.png)
配置路由完成之后，Cloudflare就知道gd.example.com属于Cloudflare，会转发流量到workers。
接着需要配置子域名的NS记录，让子域名接入到DNSPOD上。
![配置NS](/images/单域名可实现CloudflareWorkers优选IP/Screenshot_20240324114720.png)
配置workers.example.com的CNAME为cloudflare.dnspod.example.com，不要打开小乘云。
![配置CNAME](/images/单域名可实现CloudflareWorkers优选IP/Screenshot_20240324115650.png)

# 子域名(dnspod.example.com)接入DNSPOD
在dnspod中添加域名dnspod.example.com，根据要求完成域名验证。
当状态显示正常后，*.dnspod.example.com的域名记录就可以配置了。
![子域名接入DNSPOD](/images/单域名可实现CloudflareWorkers优选IP/Screenshot_20240324115005.png)
借助项目[cf2dns](https://github.com/ddgth/cf2dns)，优选Cloudflare IP，并自动分运营商配置A，AAAA记录。
![优选IP记录](/images/单域名可实现CloudflareWorkers优选IP/Screenshot_20240324115430.png)