---
title: Padavan使用记录
tags:
  - 教程
categories:
  - 互联网
  - 原创
mathjax: true
date: 2023-08-16 21:45:16
---
# 序
主流的路由器固件中的一种，同样是基于Linux改的。给我的感觉是，相比于Openwrt更像路由器系统。并且功能菜单分类的更好，缺点是没Openwrt灵活，但稳定性不错。
下面主要将一些我经常配置的功能记录下来，以备后用。

# 高级设置
## 内网LAN
### 内网设置
修改路由器LAN口IP

### DHCP服务器（dnsmasq）
设置DHCP地址池
设置DHCP租期
设置DHCP下发的DNS
静态IP（固定IP）的绑定
dnsmasq的扩展功能

### 路由设置
除了DHCP的动态默认路由外，可以配置很多静态路由
经典的是将一些IP段的流量走旁路由，比方说：
 - Clash代理fake-ip段
 - Telegram IP段
 - Wireguard IP段。

### 网络唤醒
在配置好WOL功能的电脑中，用于唤醒电脑。
需要在电脑和BIOS中开启有关设置[^1]，并且电脑要支持WOL功能。

## 外网WAN
### 外网设置
路由器改桥接后，在此设置PPPoE相关信息。
可以修改运营商下发的DNS为自己设置的DNS，此DNS位于路由器DNS（dnsmasq）的上游。
### IPv6协议
运营商支持IPv6的话，可以在此配置IPv6支持。
可以修改运营商下发的DNS为自己设置的DNS，此DNS位于路由器DNS（dnsmasq）的上游。
### 端口映射（UPnP）
可以启用UPnP功能，这样位于内网的设备，可以自动在路由器上设置端口转发。
手动端口转发也在此设置，一般我会设置以下功能的端口转发：
 - 电脑远程桌面（rdp）
 - 比特彗星（BitComet）
 - 路由器WEB管理页面
 - VPN（Wireguard）
 - FRPS
### 动态域名解析
有待研究！
目前我是通过脚本的方式实现DDNS。

# 防火墙
一般情况下，我都懒得设置路由器上的防火墙，都将其关闭。但一定要确保内网的设备开了防火墙。同时也要检查一下路由器监听的端口是不是都是必要的。

# 系统管理
## 系统
记得在此修改默认路由器密码。
这里可以设置路由器定时重启，有需要可以设置。
## 服务
这里可以设置定时任务（crontab）

# 参数设置
## 脚本
可以设置一些与路由器运行状态有关的脚本，增加灵活性。

# 系统日志
除了基本的系统日志外，还有DHCP租期，UPnP，路由表，链接等值得关注的一些日志。

# 穿透服务
## WIREGUARD
没什么用，只是作为客户端接入其他的WIREGUARD服务端，功能不全。

# 注意事项
需要重启保存的文件需要放在`/etc/storage`下。

# 附录
## ddns.sh
```bash /etc/storage/ddns.sh
#!/bin/bash
curl -k -6 --resolve fc.home999.cc:443:2a09:8280:1::96cf https://fc.home999.cc/ipinfo/ddns?subdomain=<域名>
```

# 参考文献
[^1]: [不用开机键，你的 Windows 也能随时就绪：WoL 网络唤醒入门](https://sspai.com/post/67003)