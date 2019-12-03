---
title: Windows服务使用记录
tags:
  - 教程
categories:
  - 互联网
  - 原创
mathjax: true
date: 2019-12-01 23:07:47
---
# Windows防火墙
因为我比较菜，而Windows防火墙太过严苛，我一般是把windows防火墙关掉！但这样WIN10会一直发出警报，裸奔不够安全，建议还是上一个火绒，一切问题都解决了。
默认Win10是禁ICMP的，所以要去防火墙开例外。

# IIS服务器
微软自家的软件，搭配使用效果更佳
首先进入控制面板——程序和功能——启用或关闭Windows功能——IIS管理控制台
根据需要选择搭建的互联网服务
[Win10开启FTP与配置（完整无错版）](https://blog.csdn.net/qq_34610293/article/details/79210539)
根据需要设置虚拟目录
[iis搭建WEBDAV注意事项，（成功）](https://blog.csdn.net/taotaox/article/details/69907885)

# SSR
使用小飞机，选项设置中允许来自局域网的连接，就能看到小飞机监听了所有接口的HTTP代理端口

# 微软远程桌面
远程桌面需要专业版及以上版本的Win10，下载镜像是要注意！
此电脑——属性——高级系统设置——远程
RDP默认端口3389

# 端口转发
命令|解释
-|-
`netstat -ano`|查看所有的端口监听情况
`netstat -aon|findstr "9050"`|查看指定端口的监听情况
`netsh interface portproxy show all`|查看所有的端口转发
`netsh interface portproxy delete v4tov4 listenport=3340 listenaddress=10.1.1.110`|删除指定的端口转发规则
`netsh interface portproxy add v4tov4 listenaddress=192.168.222.145 listenport=15001 connectaddress=192.168.222.63 connectport=81`|添加指定的端口转发规则