---
title: VPS使用记录
tags:
  - 教程
categories:
  - 互联网
  - 原创
date: 2019-04-15 20:04:31
updated: 2020-04-12 12:00:00
mathjax: true
---
# 前言
一直以来都是用各种桌面客户端，没有体验过服务器是怎样的，想体验一波，发现国外便宜的VPS都挺贵的，主要是我没什么使用VPS的需求。但国内的学生机还是很便宜的10元/月，就是宽带只有1M，买后证明带宽还是很吃紧的。本来是不会写这篇文章的，因为写文章太累。但是我发现我的技术水平不够，经常要推倒系统重来，所以就有了这篇文章。方便我快速查阅恢复服务。
体验了2-3周左右的阿里云之后，发现宽带实在是硬伤。再加上服务器处于国内，下载各种国外服务器上的资源都很慢。以及国内发布网站要备案等诸多因素。决定不再使用国内VPS服务器。
总的来说国内的VPS，除了延时，稳定性占优，以及1M10元/月价格相对较香以外，没有其余优点。
然而过了一段时间后，我又来打脸我自己，我一咬牙又买了一台阿里云的轻量应用服务器。最后综合觉得还是用阿里云比较划算。一方面5M带宽也够我用，不够可以再加OSS，而且阿里云学生机配置给的比较够，再加上BGP网络。在中国，访问还是很稳定的。
经过去马来西亚国能大学测试发现，深圳阿里云在国外连接慢的想打人。

---
# 远程连接工具准备
因为VPS都远在天涯海角，你不可能直接接触到，所以我们需要各种各样的远程工具。对于目标linux操作系统，最重要的就是使用终端，而想安全使用终端`ssh`必不可少。我个人是使用`git`自带的`Mingw`类linux系统中的ssh连接。现在改为`putty`，方便挂代理。然后还需要一个远程文件管理器，这里我推荐winSCP，支持协议多，速度快，兼容Windows各种操作。对于编辑器，推荐notepad++。

过了一段时间后，觉得putty太丑，winscp配合putty打开太麻烦，在[Kaiak](https://github.com/kaiakz)的大力推荐下，尝试使用`MobaXterm`,发现是真香。
`MobaXterm`支持格式各样的远程连接工具，本身的命令行界面就有一定的语法高亮，多标签页，用起来舒服。如果需要频繁操作终端的推荐使用。
后面尝试了下`VSC`的远程连接功能，它能够像在本地使用`VSC`一样完成各种操作。比较适合需要频繁修改服务器上文本文件的人使用。

# Ubuntu 18.04——阿里云
## 配置系统
因为一直以来我只用过Debian系的Linux操作系统，在体验桌面版Linux中又属Ubuntu软件多，所以直接上手Ubuntu，但网上挺多人使用CentOS作为服务器系统，CentOS毕竟是RedHat系的，稳定性方面应该要比Ubuntu好。如果只是想稳定跑服务，用CentOS没问题，新手还是推荐Ubuntu。
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
某天，我装了Ubuntu18.04 server版，发现Ubuntu支持直接从Github上获取Github上保存的公钥。这操作非常的赞，这样就可以让我的所有远程设备都能轻轻松松的获取公钥。而且不需要我主动去维护公钥的一致性。
从以下地址获取公钥并保存
```
wget -O - https://github.com/lyz05.keys >> /root/.ssh/authorized_keys
```
把这些公钥一个一行放置在`~/.ssh/authorized_keys`，我没有使用`ssh-copy-id`的命令
进行添加。这样可以快速添加设备。
关于`ssh-copy-id`的用法`ssh-copy-id root@home999.cc`

## 修改终端命令行颜色
默认的命令行的白字黑底，实在是太难分辨，所以修改配色，提升可读性是很有必要的。
在`~/.bashrc`中添加如下内容
```
PS1="${debian_chroot:+($debian_chroot)}\[\e[1;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$"
export PS1
```

## 修改系统主机名
修改`/etc/hostname`即可

## 修改系统语言
[Ubuntu 14.04 英文SSH终端更改为中文显示](https://blog.csdn.net/cnylsy/article/details/52474433)

## 使用xfce4(Xubuntu)桌面并用rdp远控
[教程](https://blog.csdn.net/qq_25556149/article/details/82216190)
然后就可以直接rdp远控了，ubuntu可以使用Remmina进行远控。
远控后我发现Terminal有一点小问题，以下是解决方案。
[Ubuntu打开终端出错：failed to execute default terminal emulator（如图示） ](https://zhidao.baidu.com/question/1770374646687303580.html)
因为我嫌Xubuntu自带的进程管理器太丑了，安装了gnome默认的`gnome-system-monitor`。

# Ubuntu 18.04——Vmware
因为穷，买不起云服务器，遂在本地跑起了虚拟机。
在本地用就一个字爽，缺点就是没公网ip，只能对内网设备提供服务。
## 安装Vmware
网上有破解版安装包，安装好之后需要进BIOS启用CPU虚拟化。
## Ubuntu镜像
不同于云服务厂商，镜像需要自己下载
[Ubuntu Server官网镜像下载页面](https://ubuntu.com/download/server)
下载之后安装就是无图形界面的最小化Ubuntu安装，可以很人性化的导入Github上的公钥。

# 相关有用的小工具安装
 - [zsh](https://www.cnblogs.com/dhcn/p/11666845.html)
 - [tldr](https://github.com/tldr-pages/tldr)
 - [Thefuck](https://www.jianshu.com/p/0d37b22aabba)
 - [Besttrace](https://www.xiaoz.me/archives/11769)
 - [youtube-dl]()
 
# 阿里云OSS
首先声明这个阿里云的OSS性能十分堪忧，主要是ossfs这个挂载工具堪忧。
全球上传速度也很慢，内网传输也才20-30M/s左右。外网传输也不过10M左右。
某404小站的Drive那是真的快！外网上传33M/s，外网下载有83M/s左右。测速工具Gdrive，测速服务器新加坡Vultr VPS。
尽管如此，我还是要用，为了省钱...搭配阿里云ECS不用付流量费，想要高速下载时再付流量费。
可以挂载内网OSS，所以有个优点能跟我搭建的nextcloud同步。
后面发现这唯一的优点也算不上优点，一方面IO很差，造成Nextcloud显示大批量图片缓慢。而且直接挂载会产生大量的请求，产生额外请求费用。
[ossfs快速安装](https://help.aliyun.com/document_detail/32196.html?spm=5176.8150156.427429.5.70396fabGjfZ98)
[ossutil64快速安装](https://help.aliyun.com/document_detail/50452.html?spm=a2c4g.11186623.6.670.61323090dzqURc)
自动挂载oss参考下面教程，修改fstab文件
[将阿里云OSS的Bucket挂载到Linux本地](https://www.jianshu.com/p/67c0816a968d)
阿里云OSS可以制定挂载用户

# SSL证书申请
首先我们需要一个私钥和证书，用于SSL加密使用。
有两种途径获得，一种途径是像CA申请获得，这就要钱了，不过阿里云有免费的SSL证书申请可以试一下。
另一种是自签名证书，不过浏览器会不信任，可以将证书加到受信任证书解决。
剩下的事情就好办了，在网页服务器中启用https，填写私钥与证书路径。
[SSL--Windows下生成OpenSSL自签证书](https://www.cnblogs.com/anlia/p/5920820.html)
[如何让chrome信任自签名证书？](https://www.jianshu.com/p/35c31b865bb9)
[Let’s Encrypt](https://letsencrypt.org/)
一个能申请免费域名的机构，甚至可以申请通配符域名，强力推荐。

# 域名配置&CDN加速
## cloudflare
听说cloudflare的口碑很好。所以，我也就选择它了。主要还是因为穷，cloudflare有free plan可以选，尽管境内加速不咋地，甚至减速。但是有免费的SSL证书，还有解析功能，还是挺期待的。
使用了一下，发现不行。主要是阿里云服务器在国内已经优化的很好了，套了个CF真的慢，之前想用它来给我的视频缓存，但好像不行。最主要的是CF的解析真的很迷，我这总是解析不到地址。
还有一个很重要的一点加了CDN之后，由于CF只代理部分端口的http和https协议，这使得我的其他TCP的服务通通不能直接连上了。
[CloudFlare免费CDN加速使用方法](https://zhuanlan.zhihu.com/p/29891330)

## 阿里云
毕竟入坑了阿里云的服务器，所以就把阿里云的服务连在一起用咯。阿里云控制台改版后的页面比以前清爽多了，但还是功能按钮太多。
一开始，我以为用阿里云的国内CDN需要备案，但好像他只验证了我的域名有没实名就可以用国内CDN加速了，用上CDN，国内小城镇的ping值就降了下来。尽管某些地区用的人少回源时间比较长，比直连慢，但总体上还是很不错的。域名解析，支持设置不同线路的DNS解析，目前我的Blog托管在香港阿里云加阿里云国内CDN，国外解析到Github Pages,这样全球都有CDN加速了。
CDN加速可以使用同一域名，只是在填回源地址时，要填ip地址。在回源HOST中填上相应的域名就好了。

## 腾讯云
跟阿里云大同小异，腾讯云的CDN有每月10GB的免费流量可用。

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
frp十分强大，而且也足够简介，跟nginx一样通过修改配置文件能够实现很多功能。
具体使用看项目地址中的Readme即可。
目前在本地我已实验成功TCP，http,https的转发。

## 搭建shadowsocksR
网上有很多一键安装脚本
[安装教程](https://ssr.tools/31)
管理脚本
```
ShadowsocksR 版：
/etc/init.d/shadowsocks-r start | stop | restart | status
```
可以加入`http_simple`混淆，来搞定运营商的QOS。
ssr`http_simple`配合nginx在80端口建真的网站效果更佳。
[利用网站配置端口隐蔽SSR的欺骗流量方案](https://www.vjsun.com/93.html)
[SSR 添加多用户多端口教程（ShadowsocksR多用户）-SSR中文网](https://ssr.tools/194)

## BBR加速
[阿里云轻应用服务器香港30M轻应用玩法,净化系统，装bbr脚本等(轻量)](https://www.cheshirex.com/1549.html)

## V2ray
[V2Ray 配置指南](https://toutyrater.github.io/)
[V2Ray官网](https://www.v2ray.com/)

## 搭建ftp服务器
我们使用`vsftpd`作为服务器软件 
[安装教程](https://www.linuxidc.com/Linux/2017-06/144807.htm)
下面这个只是参考，主要看上面那个教程
[root用户亦可登录教程](https://blog.csdn.net/qq_20545159/article/details/47701183)
关于`linux ftp`的使用
[linux ftp教程](https://www.cnblogs.com/mingforyou/p/4103022.html)

## 手动搭建nginxWeb服务器
直接安装，安装后使用`systemctl`来管理
初次安装时发现`systemctl status nginx`中有
`nginx.service: Failed to parse PID from file /run/nginx.pid: Invalid argument`
这样的错误
[解决方法](http://www.linuxdiyf.com/linux/31107.html)
[nginx详细配置](http://seanlook.com/2015/05/17/nginx-install-and-config)
[windows下nginx的安装及使用](https://www.cnblogs.com/jiangwangxiang/p/8481661.html)
[利用Nginx反向代理谷歌](https://zhgcao.github.io/2016/06/09/nginx-reverse-proxy-google/)
同理，可以反向代理其他网站。
为了避免被GFW扫描到，可以设置ip白名单，或者UA白名单。有钱甚至可以使用国内服务器中转，只不过速度较慢。
[NGINX Allow/Deny based on IP & User Agent combination](https://serverfault.com/questions/760359/nginx-allow-deny-based-on-ip-user-agent-combination)
服务器端反代有诸多限制，不够先进，可以参考`jsproxy`实现更高效的反代。


### 搭建Hexo静态网站博客
[nginx代理hexo博客](https://www.jianshu.com/p/682e62c2a3dc)
在我搭建的时候似乎遇到了权限问题，我把我的博客放在`/root`目录下，结果nginx返回`403 Forbidden`。
事实上很多web程序都不具备访问`/root`目录的能力，最好将网站统一放在推荐的位置。
或者用笨方法，直接root运行nginx。

### nginx端口转发(与frp共用端口)
目前我有一个二级域名，所以有三级域名可以由我自由分配，frp,nginx本身都要监听一个端口，当我访问不同的网站时需要指定不同的端口。这样做很麻烦，所以问题来了：能不能合并成一个端口提供服务。
这时候就要用到nginx的反向代理（端口转发）功能。
在目录`/etc/nginx/conf.d/`中添加配置文件。配置文件名自取，以`.conf`为文件后缀
下面是一段监听8082端口，并将所有的`*.home999.cc`请求转到端口8080来进行处理的配置文件。

在配置域名的时候，感觉nginx的理解与我的理解有一些偏差。所以只好按照nginx的理解去配域名了。

## 搭建git服务器
[廖雪峰版教程](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000/00137583770360579bc4b458f044ce7afed3df579123eca000)
先完成基本的创建用户，公钥添加，禁止bsah登陆，再按照下面修复`git shell修复教程`，修复`ssh`登陆报错。
[git shell修复教程](https://www.liaoxuefeng.com/discuss/001409195939432748a2c9fae3846bc98b3c2a547fa321b000/001439558216371603727f334d9451b9075c15996b2ae90000)

### hexo通过git部署博客到服务器
[通过 Git Hooks 自动部署 Hexo 到 VPS](https://blog.yizhilee.com/post/deploy-hexo-to-vps/)

## 部署Asp.NET应用
[教程](https://www.cnblogs.com/cgzl/p/9648813.html)
[Install .NET Core Runtime](https://dotnet.microsoft.com/download/linux-package-manager/ubuntu18-04/runtime-current)

## 搭建Nextcloud网盘
首先要做的是一键安装`LNMP`,我是不太喜欢这种一键安装包的，会把我原有的配置搞乱。
而且对服务器环境要求比较高，出问题了比较难查。
[LNMP环境一键安装包](https://www.flyzy2005.com/tech/install-lnmp-in-one-command/)
[教程](https://segmentfault.com/a/1190000015654232)
搭建完之后真的舒服，界面舒服又好用，自带WebDav。

如果想直接从服务器中导入其他文件，可以参考下面这个教程，要注意所有者是www，
同时最好修改导入文件的所有者为www。
[OCC命令给ownCloud/Nextcloud手动添加文件](https://www.orgleaf.com/2400.html)
然后可以以管理员的身份进入设置中的概览，进行完整性和安全性的扫描。
给PHP开大内存储存空间，修改`/usr/local/php/etc/php.ini`文件中`memory_limit`配置信息。
最后因为通过`LNMP`搭建的`NextCloud`问题太多，而选择了使用`snap`一键安装，从下载到安装不到1min。
[Ubuntu使用Snap快速安装NextCloud网盘，并配置域名及SSL证书](https://www.moerats.com/archives/429/)
`snap`会直接打包好一个虚拟的使用环境，与外界环境互不影响。
但是`NextCloud`默认使用的服务器`Apache2`会占用80端口，所以我们要修改这个端口，并用`nginx`做反向代理。
更改端口号，如果你没有备案：
`snap set nextcloud ports.http=8080 ports.https=8081`
手动扫描文件
`nextcloud.occ files:scan --all`
`nextcloud.occ files:scan root`
配置https
To install a Let's Encrypt SSL certificate, type:
`$ sudo nextcloud.enable-https lets-encrypt`
If you'd rather use a self-signed certificate, you can type:
`$ sudo nextcloud.enable-https self-signed`
在`nginx.conf`的`http`中添加`client_max_body_size 10g;`防止文件过大禁止写入。
`NextCloud`上面还有很多小插件可以使用，可以仔细研究一下。
[Nextcloud应用推荐](https://blog.wyc1236.com/2018/12/02/306/)
[使用Docker部署ONLYOFFICE Document Server](https://www.orgleaf.com/2588.html)
到最后发觉snap版本的nextcloud对本地文件和https反向代理支持不友好。而目前我也有能力全部手动装NextCloud，所以从官网下载NextCloud的PHP压缩包。
先到官网下载，PHP压缩包，然后解压，移动到`/var/www`目录下，设置好整个目录的所有者和组为`www-data`，配置nginx下NextCloud的conf，上官网查样例，粘贴即可。
访问网站，填写配置信息，如果有资料需要转移的，现在就可以转移了，然后再扫描文件。
最后进入设置概览，一次解决nginx与PHP的配置和扩展未装的问题，有能力的还可以上radis。
[解决Nextcloud提示“内存缓存未配置，为了提升使用体验，请尽量配置内存缓存。”的问题](https://www.himstudy.net/%E8%A7%A3%E5%86%B3nextcloud%E6%8F%90%E7%A4%BA%E5%86%85%E5%AD%98%E7%BC%93%E5%AD%98%E6%9C%AA%E9%85%8D%E7%BD%AE%EF%BC%8C%E4%B8%BA%E4%BA%86%E6%8F%90%E5%8D%87%E4%BD%BF%E7%94%A8%E4%BD%93%E9%AA%8C/)

## 搭建Aria2+AriaNG离线下载服务
[Nextcloud离线下载搭建方法-整合Aria2和AriaNg、Aria2 WebUI实现离线下载](https://wzfou.com/nextcloud-aria2/)
搭建完之后，使用`lnmp vhost add`可以添加AriaNG的前端于服务器上。
关于与`Nextcloud`的链接管理
[Nextcloud外部存储（本地）整合Aria2 AriaNG离线下载](https://blog.augustdoit.bid/nextcloud2/)
强烈建议给`AriaNg`添加登陆密码，因为先前了解到frp有这种功能，所以我猜测nginx也提供了这种功能。
后面发现不用密码也行，因为要使用离线下载功能的人必须先知道RPC密钥，才能与aria2联通。
[Nginx配置basic_auth密码验证](https://www.centos.bz/2017/07/nginx-basic_auth-password/)
添加一条文件拥有者修改代码，解决权限问题。
`chown www-data:www-data passwd.db`

## 搭建Fortuna OJ
Fortuna OJ作为用了3年的学校oj，当然要试着搭建一波了。
[Fortuna OJ 部署指南](https://github.com/mchobbylong/fortuna-oj-doc/blob/master/setup_on_ubuntu18_cn.md)
操作数据库
[MariaDB数据库简单入门（含备份、恢复）](https://blog.csdn.net/zhaoxixc/article/details/82079783)
搭建之中遇到了一些问题，我用的是Ubuntu 16.04，但是推荐的是Ubuntu 18.04。
并且不是纯净的。所以，我选择了手动安装，就遇到了`redis`找不到，数据库找不到等奇奇怪怪的问题。
所以最后，找了台纯净的Ubuntu18.04使用脚本直接搭建就OK了。
由于没有文档，很多东西只能自己去猜测，试验。
目前已知添加数据时，需要单个测试点一个个添加。

## 搭建青岛Online Judge
[后端代码](https://github.com/QingdaoU/OnlineJudge)
[前端代码](https://github.com/QingdaoU/OnlineJudgeFE)
[Docker部署代码](https://github.com/QingdaoU/OnlineJudgeDeploy)
[文档](https://docs.onlinejudge.me)

## 搭建简单的http文件服务器
使用nginx或apache都可。
个人喜欢nginx，所以就以nginx为例。
安装好nginx，在配置目录中增加如下配置
`/etc/nginx/conf.d/file.conf`
```
server {
	listen 8081;
	server_name sz.home999.cc;
	charset utf-8;
	
	location /files {
		alias /media;
		allow all;
		autoindex on;				#开启目录索引
		autoindex_exact_size off;	#关闭精准文件大小显示
		autoindex_localtime on;		#使用浏览器时区显示时间
	}
}
```
nginx本身只是一个很小的组件，但是拥有扩展的他具有无限可能。如果你觉得默认的文件列表功能太简陋，可以重新编译nginx并加上扩展。
[Nginx 索引目录美化](https://www.jianshu.com/p/ae73ee2bbe6e)

## BTsync同步工具(弃)&Syncthing
因为一不小心就买了4台VPS服务器，他们之间需要共享一些文件。然而，阿里云太贵，坚果云只能用webdav，而且限制比较多。所以需求就产生了，还可以充分利用带宽。
当我使用官网文档进行安装的时候，发现国内阿里云连不上服务器，最后一查发现被墙了。那就只好找替代方案了，发现了一个类似的并且也足够轻量，使用网页进行管理的同步工具`syncthing`。
[「玩物志」Syncthing的安装与使用](https://www.jianshu.com/p/4235cc85c32d)
搭建和使用还算时挺简单的，可以根据需要设置同步目录和启动。

## BaiduPCS-Web高速下载百度网盘
[项目地址](https://github.com/liuzhuoling2011/baidupcs-web)
搭建非常简单...

## Tomcat服务器搭建
[Vultr+CentOS7+阿里云+Tomcat部署Web应用](https://www.jianshu.com/p/cd3d20b8c26b?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation)
上面是较为全面的搭建教程。
省略复杂的过程及解释，直接来代码
```
sudo apt-get install default-jre
sudo apt-get install default-jdk
```
据说能够自动解决环境变量的问题
[Apache Tomcat® - Apache Tomcat 7 Software Downloads](https://tomcat.apache.org/download-70.cgi)
从上述链接中获取linux版Tomcat，选择core即可。
解压到`/usr/local`,并改名为`tomcat7`。
默认开放端口为8080，可以修改`/usr/local/tomcat7/conf/server.xml`文件。
[tomcat更改默认端口号](https://blog.csdn.net/m0_37836194/article/details/79151296)
在`Eclipse`中右键项目`Export -> WAR file`,并上传到`tomcat7/webapps`中。
还要在`server.xml`中`</Host>`前添加项目部署位置
```
<Context docBase="phase-04-implementation-003-javaWeb" path="/" reloadable="true" source="org.eclipse.jst.jee.server:phase-04-implementation-003-javaWeb"/>
```
管理`Tomcat`服务相关脚本均在`tomcat7/bin`下。
[Ubuntu 16.04自定义服务实现Tomcat开机自启动](https://blog.csdn.net/bbaaEE/article/details/82015155)

## PHP环境
最早体验php是用的LNMP或LAMP一键包，但这是在你没有其他服务的情况下，像我现在各种各样的服务都在一个服务器上跑。用一键包，安装路径奇奇怪怪，所以只好自己手动来安装
[Ubuntu 手动安装LNMP/LAMP,配置Nginx/Apache与PHP关联](https://feihu.blog/archives/773.html)
在之前体验的过程中，遇到两个挺有用的PHP文件，分别是`phpinfo`和`PHP探针`。

## mysql数据库
[ubuntu18.04 首次登录mysql未设置密码或忘记密码解决方法](https://blog.csdn.net/qq_38737992/article/details/81090373)

[mysql允许root远程登录](https://www.cnblogs.com/hehecat/p/9262106.html)

## Windows下ssh服务器FreeSSHd
[官网](http://www.freesshd.com/?ctt=download)
[在windows 下创建SFTP服务器](https://blog.csdn.net/zeswhd/article/details/80812496)
下载安装过程中，会询问是否要写入服务，如果选择写入，很可能后面因为软件自身占用22端口，而无法启动服务，需要手动关闭再开启。
主要是为了使用他的SFTP功能，并用frp做内网穿透，实现文件读写访问。
当然也可以使用frp自带的简易http文件下载服务器。

## Brook端口转发
[『原创』Shadowsocks Brook 中继(中转/端口转发) 便捷管理脚本](https://doubibackup.com/yv4cp61c.html)

## docker容器
[Docker 教程](https://www.runoob.com/docker/docker-hello-world.html)
[Docker对象清理](https://blog.csdn.net/weixin_32820767/article/details/81196250)

# 客户端搭建

## WebDAV客户端
[cadaver配置教程](https://blog.51cto.com/3331062/2306523)
webdav客户端挂载工具`davfs`
```
apt install davfs
vi /etc/davfs2/davfs2.conf
ignore_dav_header 1
mount -t davfs https://dav.jianguoyun.com/dav /media/nutstore
mount -t davfs http://sz.home999.cc:8080/remote.php/webdav/ /media/nextcloud
umount /media/nextcloud
```

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

## shadowsocksR客户端
[Linux安装并使用ssr](https://blog.mrwang.pw/2018/12/13/Linux%E5%AE%89%E8%A3%85%E5%B9%B6%E4%BD%BF%E7%94%A8ssr/)
启动成功后，软件会自动监听1080端口。使用socks5协议进行代理。
所以还需要一个额外的代理软件，来辅助命令行工具翻墙。
[shadowsocks + proxychains4 （解决git clone慢的问题 ）](https://my.oschina.net/uniquejava/blog/846349)

## speedtest测速软件
安装
```
wget https://raw.github.com/sivel/speedtest-cli/master/speedtest.py
chmod a+rx speedtest.py
mv speedtest.py /usr/local/bin/speedtest
chown root:root /usr/local/bin/speedtest
```
使用命令`speedtest`


## Google drive客户端
因为Google drive没有第三方客户端，所以万能的国外大佬们，绝对不允许自己的Google drive空间被白白浪费，整出了一大堆第三方Google drive工具，再加上Google良心，没有对这些第三方工具加以限制，因此可以实现各种骚操作。
我上网找到了两个适用于命令行的第三方工具，分别是Gdrive和Grive。
[Google Drive网盘文件直链获取一键脚本](https://www.cnblogs.com/weifeng1463/p/10967644.html)

### Gdrive
像普通网盘一样去使用Google drive，具备列目录，上传下载等基础功能。
不可以搭配proxychains4使用。
2020年2月21日测试使用，被Google报应用不安全，以致无法正常使用

### Grive
像Dropbox一样同步Google drive目录，可以指定目录，甚至某一个文件，同步并非实时。
可以搭配proxychains4使用。

### rclone
这个工具比我之前想的还要强大,至少与Google Drive配合，效果特别棒！可以彻底跟垃圾阿里云OSS say GoodBye。
有关这个工具的安装和使用。注意，如果使用没有浏览器的设备，需要特别注意选项。
[Linux下rclone简单教程(支持VPS数据同步,多种网盘,支持挂载)](https://ymgblog.com/2018/03/09/296/)
有关开机自动挂载
[CENTOS服务器使用rclone开机自动挂载谷歌云盘Google drive rclone自动挂载Gdrive磁盘的](https://lab.bnxb.com/zhishi/27538.html)
## Telegram BOT
Telegram有一个很强大的机器人，通过机器人API可以完成各种自动化操作。
[用Telegram管理VPS：我的5个Telegram机器人脚本](https://www.shuyz.com/posts/5-telegram-bot-script-for-vps-management/)

# 维护服务器命令
命令 | 备注
-|-
`netstat -nltp`     |   查看当前开放listen的所有Tcp端口信息
`htop`              |   系统资源管理器
`iftop`             |   [查看实时带宽流量情况](https://www.cnblogs.com/fklin/p/4986645.html)
`ifstat`            |   网络资源管理器
`df`                |   查看磁盘空间
`du -sh ./* --exclude="media"` | 查看当前目录文件(夹)大小并排除media文件夹
`screen`            |   [管理多终端](https://www.cnblogs.com/cute/p/5015852.html)
`screen -S new`     |
`screen -R reload`  |
`cat /var/log/dist-upgrade/main.log \| grep ERR` | 查看系统升级出错日志
`crontab`           |   [计划任务](https://www.runoob.com/w3cnote/linux-crontab-tasks.html)
`ps aux `           |   查看进程信息
`kill 9 PID`        |   杀制定PID的进程
`tar -xzvf file.tar.gz` | tar.gz解压命令
`tar -czvf ***.tar.gz ./file` | tar.gz压缩命令
`tar -cvf ***.tar ./file` | tar打包命令

## systemctl
```
systemctl start nfs-server.service
systemctl enable nfs-server.service
systemctl disable nfs-server.service
systemctl status nfs-server.service
systemctl restart nfs-server.service
systemctl
```
[服务管理--systemctl命令](https://my.oschina.net/5lei/blog/191370)

# VPS性能测试
## Zbench
```
#中文版
wget -N --no-check-certificate https://raw.githubusercontent.com/FunctionClub/ZBench/master/ZBench-CN.sh && bash ZBench-CN.sh
#英文版
wget -N --no-check-certificate https://raw.githubusercontent.com/FunctionClub/ZBench/master/ZBench.sh && bash ZBench.sh
```
Vultr Tokyo,Japan (5$/月)
```cpp
--------------------------------------------------------------------------
CPU 型号             : Intel Core Processor (Haswell, no TSX, IBRS)
CPU 核心数           : 1
CPU 频率             : 2399.996 MHz
总硬盘大小           : 25.5 GB (20.0 GB Used)
总内存大小           : 985 MB (147 MB Used)
SWAP大小             : 0 MB (0 MB Used)
开机时长             : 0 days, 5 hour 39 min
系统负载             : 0.27, 0.08, 0.02
系统                 : Ubuntu 18.04.3 LTS
架构                 : x86_64 (64 Bit)
内核                 : 4.15.0-74-generic
虚拟化平台           : kvm
--------------------------------------------------------------------------
硬盘I/O (第一次测试) : 392 MB/s
硬盘I/O (第二次测试) : 449 MB/s
硬盘I/O (第三次测试) : 466 MB/s
--------------------------------------------------------------------------
节点名称                  IP地址            下载速度            延迟
CacheFly                  204.93.150.152    70.7MB/s            0.931 ms
Linode, Singapore, SG     139.162.23.4      5.77MB/s            70.685 ms
Linode, London, UK        176.58.107.39     8.38MB/s            219.419 ms
Linode, Frankfurt, DE     139.162.130.8     7.20MB/s            248.157 ms
Linode, Fremont, CA       50.116.14.9       15.9MB/s            109.553 ms
Softlayer, Dallas, TX     173.192.68.18     11.4MB/s            142.574 ms
Softlayer, Seattle, WA    67.228.112.250    18.5MB/s            88.417 ms
Softlayer, Frankfurt, DE  159.122.69.4      3.19MB/s            244.037 ms
Softlayer, Singapore, SG  119.81.28.170     20.3MB/s            80.402 ms
Softlayer, HongKong, CN   119.81.130.170    34.0MB/s            49.481 ms
--------------------------------------------------------------------------
节点名称                  上传速度          下载速度            延迟
上海电信                  5.43 Mbit/s       10.84 Mbit/s        245.576 ms
西安电信                  61.67 Mbit/s      148.02 Mbit/s       111.181 ms
北京联通                  119.83 Mbit/s     74.82 Mbit/s        124.233 ms
--------------------------------------------------------------------------
合肥        : 65.69 ms   北京        : 51.29 ms   武汉        : 115.65 ms
昌吉        : Fail       成都        : Fail       上海        : Fail
太原        : 161.32 ms  杭州        : 168.98 ms  宁夏        : 144.09 ms
呼和浩特    : 126.03 ms  南昌        : Fail       拉萨        : Fail
乌鲁木齐    : 161.22 ms  天津        : 121.48 ms  襄阳        : Fail
郑州        : 162.86 ms  沈阳        : Fail       兰州        : 131.9 ms
哈尔滨      : Fail       宁波        : Fail       苏州        : Fail
济南        : 142.11 ms  西安        : 107.06 ms  西宁        : 111.34 ms
重庆        : 139.7 ms   深圳        : Fail       南京        : Fail
长沙        : Fail       长春        : 107.09 ms  福州        : 113.61 ms
--------------------------------------------------------------------------

```
腾讯云学生机（10元/月）
```cpp
--------------------------------------------------------------------------
CPU 型号             : Intel(R) Xeon(R) CPU E5-26xx v4
CPU 核心数           : 1
CPU 频率             : 2394.446 MHz
总硬盘大小           : 101.0 GB (13.0 GB Used)
总内存大小           : 1833 MB (445 MB Used)
SWAP大小             : 0 MB (0 MB Used)
开机时长             : 1 days, 22 hour 37 min
系统负载             : 1.34, 0.97, 0.77
系统                 : Ubuntu 18.04.4 LTS
架构                 : x86_64 (64 Bit)
内核                 : 4.15.0-76-generic
虚拟化平台           : kvm
--------------------------------------------------------------------------
硬盘I/O (第一次测试) : 108 MB/s
硬盘I/O (第二次测试) : 110 MB/s
硬盘I/O (第三次测试) : 109 MB/s
--------------------------------------------------------------------------
节点名称                  IP地址            下载速度            延迟
CacheFly                  204.93.150.152    315KB/s             162.957 ms

```

# 弃用
## 宝塔面板
[安装教程](https://doubibackup.com/hxvodqzg.html)
这个玩意太强大了，所以我单独的将他拿了出来，对于那些不想接触linux命令行的人简直太方便了。
完全的网页可视化管理，比起我先前提到的安装桌面环境来说要更省空间，并且也容易操作的多。
我觉得这玩意就像路由器中的后台管理luci，可以满足你大部分搭建服务器软件的需求。
缺点就是安装东西真的很慢，国内开发的软件，增值服务太多，花里胡哨的！！！
最后面我弃用了他，瞎改我的配置，瞎增加网页，吃相难看，再见！

## KCPTUN加速工具
这是一个TCP与UDP互转的加速工具，使用UDP协议进行加速，加速双方都需要部署软件。
[超级加速工具KCPTUN一键安装脚本 附100倍加速效果图-SSR中文网](https://ssr.tools/588)
windows客户端要去github上找Release，体验了一下发现没有宣传的效果那样好，给我感觉一般般，但是非常消耗带宽，不适合我这种阿里云小水管，适合那些大水管，并且TCP线路尤为糟糕的。

## Mosh
一种可以替代ssh基于UDP的远程shell工具，主要解决糟糕的境外VPS的ssh连接问题
[使用 Mosh 来优化 SSH 连接](https://www.hi-linux.com/posts/23118.html)
暂时找不到好用的windows客户端，用Cygwin的比较麻烦。而且表现并不比挂代理好，所以最后还是代理+ssh。

## 搭建kodexplorer网盘网站
[教程](https://www.jianshu.com/p/406a4c593d04)
上面这篇教程在安装`kodexplorer`之前，先使用了一键安装脚本`oneinstack`解决大部分服务器所需要的服务，虽然也是国人制作的一键安装脚本，但是相比宝塔面板，要干净很多。
在此之前推荐使用全新干净的系统安装。
不需要桌面此类的东西，而且不够简约，每打开一个东西都开新窗口，不大喜欢这种WEB OS的风格。


