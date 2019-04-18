---
title: 使用阿里云ECS记录
tags:
  - 教程
categories:
  - 互联网
  - 原创
date: 2019-04-15 20:04:31
---
# 前言
一直以来都是用各种桌面客户端，没有体验过服务端是怎样的，想体验一波，发现国外便宜的VPS都挺贵的，主要是我没什么使用VPS的需求。但国内的学生机还是很便宜的10元/月，就是宽带只有1M，事实证明还是很吃紧的，本来是没有这篇文章的，但是我发现我的技术水平不够，经常要推倒系统重来，所以就有了这篇文章。方便我快速恢复

---
# Ubuntu 18.04
## 配置系统
首先选择一台阿里云ECS实例安装好基本的操作系统Ubuntu 18.04，然后就是开机。
因为不知道阿里云的密钥是怎么用的，所以我是选择密码安装。后面可以使用密钥登陆，并关闭密码登陆，保证服务器安全。
为了方便，去安全组将所有的端口都开放。
## 关闭阿里云安骑士
安骑士确实烦，整天提示我有异常登陆，然而这异常登陆全是我自己，这还叫什么异常！！
还总是发短信，是真的良心，实则推销自己的企业版，自动打补丁。
[阿里云ECS关闭删除安骑士](https://blog.mimvp.com/article/24653.html)
核心代码
```
wget http://update.aegis.aliyun.com/download/uninstall.sh
bash uninstall.sh
wget http://update.aegis.aliyun.com/download/quartz_uninstall.sh
bash quartz_uninstall.sh

pkill aliyun-service
rm -rf /etc/init.d/agentwatch /usr/sbin/aliyun-service
rm -rf /usr/local/aegis*
```
## ssh公钥设置
现在已经可以ssh远程系统了。因为我们直接用密码登录比较麻烦，再加之会有被暴力破解密码的风险，建议使用密钥认证登录，要使用密钥登录，首先需要在服务器上放置你ssh远程所有设备的公钥。
```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDE5GtFXjaL4ogbJbYqWY3Z+DwwggQHdoEt3cVTXKM151ZO0ahGMrbXbWZhNerCUNbTb5hqC5P/RCYiTtsd3GocLcd+3WcvAgtwmoUTKLh22ePDyd+wVJkoz6/QprUe9VyVndkLt/LEp0k129p5BjzEoAxOss6RhH/BfDylRg1xIUDYK4slU53Bg5dESBGuTSv8oznO8m42W+dYfPauQdw0cmggngX97trLznwTLMAMbF7pjpzeHkZnbEM3xh9C5YOsJ8ECRvSN+5Jd9Tt7FjW47FGr58I4RKID2SKmNjdZQzS/KZDPBd7ZuRvfB9xrA1Ths+0ru4iMpf6AE4qbH/kH congcong@DESKTOP-N1PAF3A
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCp8iUceheqeU2f72DzuF9qwR0wzaHyVAiZIsw6oR+a5342Kr+vA5468aGlDW7d4W1bhVg9nfjuTKfngnpr9Mesl3V36LlMRZkfseRUWJEQfOITKcswEac9pORbSR+ay7kZz3iJvGeAgyquOmiFgcNaooxNnmP1iIsiMmTWRQv6ytKHTUBgEUfwBhyyyDSd5MuDUpBpM+M5jDwTy6ByeDn2r/ejddNvh4KGEIHI76klc8Fvbg1bt2GLTGUn0WUAPwIzJKa73BqhdlSdeb5M6vMVCbJDz9CnitqlaS0nGh+2+m0KBGM/yBousZWfnRVBYOzcxjJtsnacpqJ3SBHalKJ7 u0_a179@localhost
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCiuxUzIy3m67awi6DG5WGRABWaCGTUoME9nQB9Lh72Tihf6xth9I5GtZ+AWIp+bP6V//33phWIGHNaIZWTNcGqFHdLb7NFfSHKwRuxCSI7PMoFpWIigC/wAB6jsTAcjT8uAdjtq4Z+GMmOZzR6Vw51WBN6+ZN54UuJTxXN8AbP5KpFuRNsqlm8IQeNGtWW0PFsaGZKqttM+1oILa5VNyY44HS6jlkejEEy4hSxO6O1p5A1QXIlDBQcPoVHGg2zeNw8yqJa6G+XR3jTigXosvNIPMgAfW7aN/v8Ue3Q+wlChugI0+6esH4pNvK87msmUXysqFSyWURb1EfRlZwETAWl 294068487@qq.com
```
这是我3个设备的公钥，分别是笔记本Win/ubuntu,手机Termux的公钥。
把这些公钥一个一行放置在`~/.ssh/authorized_keys`，我没有使用`ssh-copy-id`的命令
进行添加。
## 使用xfce4(Xubuntu)桌面并用rdp远控
[教程](https://blog.csdn.net/qq_25556149/article/details/82216190)
然后就可以直接rdp远控了，ubuntu可以使用Remmina进行远控。
远控后我发现Terminal有一点小问题，以下是解决方案。
[Ubuntu打开终端出错：failed to execute default terminal emulator（如图示） ](https://zhidao.baidu.com/question/1770374646687303580.html)
因为我嫌Xubuntu自带的进程管理器太丑了，安装了gnome默认的`gnome-system-monitor`。
# 服务器搭建
## 搭建frp内网穿透
[项目地址](https://github.com/fatedier/frp/releases)
在这里下载当前平台所需要的二进制运行文件。
frps.ini配置文件如下：
```
[common]
bind_addr = 0.0.0.0
bind_port = 7000
vhost_http_port = 8080
dashboard_port = 7500
token = 12345678
subdomain_host = home999.cc
```
[部署教程](https://blog.csdn.net/fanxl10/article/details/82381176)
作者很良心的写好了服务脚本，可以后台运行并开机自启
部署好之后，有三个重要的管理代码
```
systemctl start frps //启动
systemctl status frps //状态查询
systemctl enable frps //开机启动
```
## 搭建shadowsocksR
网上有很多一键安装脚本
[安装教程](https://teddysun.com/486.html)
管理脚本
```
ShadowsocksR 版：
/etc/init.d/shadowsocks-r start | stop | restart | status
```
## 搭建ftp服务器
我们使用`vsftpd`作为服务器软件
[安装教程](https://www.linuxidc.com/Linux/2017-06/144807.htm)
下面这个只是参考，主要看上面那个教程
[root用户亦可登录教程](https://blog.csdn.net/qq_20545159/article/details/47701183)
关于`linux ftp`的使用
[linux ftp教程](https://www.cnblogs.com/mingforyou/p/4103022.html)

## 搭建nginxWeb服务器
直接安装，安装后使用`systemctl`来管理
初次安装时发现`systemctl status nginx`中有
`nginx.service: Failed to parse PID from file /run/nginx.pid: Invalid argument`
这样的错误
[解决方法](http://www.linuxdiyf.com/linux/31107.html)
[nginx详细配置](http://seanlook.com/2015/05/17/nginx-install-and-config)
### 搭建Hexo静态网站博客
[nginx代理hexo博客](https://www.jianshu.com/p/682e62c2a3dc)
在我搭建的时候似乎遇到了权限问题，我把我的博客放在`/root/`目录下，结果nginx返回`403 Forbidden`。
下面给出服务的配置信息，将配置信息保存在`/etc/nginx/conf.d/hexo.conf`
```
server {
        listen       8082;
        server_name  127.0.0.1;
        #charset koi8-r;
        #access_log  logs/host.access.log  main;
        location / {
            root   /home/public;
            index  index.html;
    }
}
```
### 端口转发(与frp共用端口)
目前我有一个二级域名，所以有三级域名可以由我自由分配，frp,nginx本身都要监听一个端口，当我访问不同的网站时需要指定不同的端口。这样做很麻烦，所以问题来了：能不能合并成一个端口提供服务。
这时候就要用到nginx的反向代理（端口转发）功能。

# 客户端搭建

## WebDAV客户端
[cadaver配置教程](https://blog.51cto.com/3331062/2306523)

## Mplayer命令行视频播放
命令行播放视频
[Mplayer](https://jingyan.baidu.com/article/2fb0ba4081900c00f2ec5f8d.html)
`mplayer -fs -x 25 -y  12  -ss 00:01:10 -vo caca video.mp4`

## ffmpeg视频压制
`ffmpeg -i VID_20170131_094350.mp4 -vcodec libx264 -preset veryfast -crf 27 -acodec aac -ac 2 -ar 48000 -ab 128 -f mp4 output.mp4`
-i 打开视频，查看视频详情(长度，音频流，视频流，码率)
-ar 采样率
-ab 码率
-ac 声道数

# 维护服务器命令
查看当前开放listen的所有Tcp端口信息
`netstat -nltp`
系统资源管理器
`top`
网络资源管理器
[`iftop`](https://www.cnblogs.com/fklin/p/4986645.html)
`ifstat`
