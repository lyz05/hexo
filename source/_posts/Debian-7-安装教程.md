---
title: Debian 7 安装教程
date: 2015-10-28 08:03:00
tags:
  - 教程
categories:
  - 互联网
  - 原创
mathjax: true
---
First you should download the file of Debian 7 64 bit


set source
--
```
#vim /etc/apt/sources.list
```
Enter the following information
```
deb http://mirrors.163.com/debian wheezy main non-free contrib
deb-src http://mirrors.163.com/debian wheezy main non-free contrib


deb http://mirrors.163.com/debian wheezy-updates main non-free contrib
deb-src http://mirrors.163.com/debian wheezy-updates main non-free contrib


deb http://security.debian.org/ wheezy/updates main
deb-src http://security.debian.org/ wheezy/updates main

#apt-get update
```

install some software
--
Open Terminal
input order
```
$su root
#apt-get install vim
#apt-get install gcc
#apt-get install g++
#apt-get install sudo
#apt-get install fpc
```

To solve the Chinese garbled
--
```
$su
#apt-get install ttf-arphic-uming
#apt-get install ttf-wqy-zenhei
#aptitude install locales
#dpkg-reconfigure locales
```
choose something
```
en_US.UTF8
zh_CN GB2312
zh_CN GBK GBK
zh_CN UTF-8 UTF-8
```
choose zh_CN UTF-8  
```
#vi /etc/default/locale
LANG=en_US.UTF-8
```

安装中文输入法
--
```
# apt-get install fcitx
```
创建脚本以便X Window启动时自动载入fcitx: 
```
# cd /etc/X11/Xsession.d  
# vi 25xchinput_start
```
输入以下内容并保存： 
```
export XMODIFIERS=@im=fcitx        
export XIM=fcitx        
export XIM_PROGRAM=fcitx        
/usr/bin/fcitx &
```
在配置中激活输入法
fcitx翻页按钮=向下-向上

安装vmware tools
```
tar zxvf ***.tar.gz
#sudo apt-get install make
#sudo apt-get install gcc
#sudo aptitude install linux-headers-`uname -r`
```
在root下运行vmware-install.pl


查看windows共享文件
--
```
#apt-get install samba
```
首先，下载samba；
接着，Alt+F2,
smb://windows的IP/共享目录
假设windows的ip是10.2.11.2.100, 共享目录是share和本地磁盘(E)
于是
smb://10.2.112.100/share
smb://10.2.112.100/本地磁盘(E)
即可直接访问。


解压deb包
--
dpkg命令常用格式如下：
dpkg -I iptux.deb#查看iptux.deb软件包的详细信息，
dpkg -c iptux.deb#查看iptux.deb软件包中包含的文件结构
dpkg -i iptux.deb#安装iptux.deb软件包
dpkg -l iptux#查看iptux软件包的信息
dpkg -L iptux#查看iptux软件包安装的所有文件
dpkg -s iptux#查看iptux软件包的详细信息
dpkg -r iptux#卸载iptux软件包
注：dpkg命令无法自动解决依赖关系。如果安装的deb包存在依赖包，则应避免使用此命令，或者按照依赖关系顺序安装依赖包。
dpkg -l | grep qq
用这个命令组合着出来了，列出已经安装的软件，并且包含qq关键字的。。
再用-r卸载


tar.gz文件解压
--