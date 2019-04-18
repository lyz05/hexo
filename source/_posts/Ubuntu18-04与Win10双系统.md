---
title: Ubuntu18.04与Win10双系统
tags:
  - 教程
categories:
  - 互联网
  - 原创
date: 2018-11-25 22:30:35
---
# 搭建Ubuntu 18.04与Win10双系统运行环境
目标主机：XPS 13 9360
目标引导模式：UEFI
# 安装系统大致步骤
1. 	下载ubuntu 18.04.1 LTS镜像
	[Ubuntu官方下载页面](https://www.ubuntu.com/download/desktop)

2. 	准备4G以上空间U盘，并使用Rufus烧录
	[Rufus官方下载页面](https://rufus.ie/en_IE.html)

3. 	Rufus烧录使用默认配置，先选择U盘，选择好镜像，按要求先使用推荐的烧录方式。

4. 	重启电脑，狂按F12进入一次启动页面，选择U盘启动。

5.	先`try ubuntu`，试试当前版本的Ubuntu与机子的硬件兼容性如何，如果有不兼容的建议换Ubuntu版本，不然找驱动可能要你命。

6.	`Install Ubuntu`，一路正常安装，进入分区页面时，根据需要分区。至少需要两个区`/`与`swap`。启动引导安装位置有两种选择，一种是选择整个硬盘，会覆盖Windows Boot Mannager。另一种是选择分区`/boot`，装好Ubuntu后重启进入windows使用EasyBCD添加Ubuntu开机引导。
	![分区方式表](http://5b0988e595225.cdn.sohucs.com/images/20180628/d33a504fbbd242929da6a969dacded1a.jpeg)

7. 	一切顺利的话，重启进入Ubuntu系统。能见到熟悉的Gnome界面


# 安装Ubuntu下软件
我选择的是最小安装，所以不带播放器，office等插件。

## Ubuntu安装软件的方式
Ubuntu/Debian系都是用deb后缀的安装包，可以直接从软件的官网上下载，deb后缀的包。
需要注意的是分清系统是32位还是64位，i386代表32位,amd64代表64位。Linux发行版中的软件绝大部分都有64位版。如果我记得没错的话，不打开选项64位系统无法安装32位。
`apt-get` `apt` 这两个命令基本一致可以用于更新/搜索/安装/卸载Debian系的软件，并能自动解决依赖问题，是安装的首选方式。对于软件来源可以直接修改Sources.list或添加ppa。
[Ubuntu14.04和16.04官方默认更新源sources.list和第三方源推荐（干货！）](https://www.cnblogs.com/zlslch/p/6860229.html)
`dpkg -i` 安装本地的deb包，命令无法直接解决依赖问题，需要再次使用`sudo apt install -f`解决软件的依赖问题。
`snap install` snap工具安装法
`pip3` `pip` python相关的软件安装命令

# 优化工具
Gnome Tweak Tool [参考链接](https://jingyan.baidu.com/article/86f4a73ebd6c9437d7526963.html)

# 播放器
SMplayer
[网易云音乐](https://music.163.com/#/download)

# 输入法
[搜狗输入法](https://pinyin.sogou.com/linux/?r=pinyin)

# 浏览器
[Google-chrome-stable](https://jingyan.baidu.com/article/335530da98061b19cb41c31d.html)
[flash](https://jingyan.baidu.com/article/6b182309813095ba58e15915.html)

# 办公软件
[wps office](http://www.wps.cn/product/wpslinux/)
字体问题[解决方法](https://www.cnblogs.com/EasonJim/p/7146587.html)

# 编程工具&文本编辑器
git
g++
vim
fpc
[notepadqq](https://notepadqq.com/s/)

# 视频处理
ffmpeg
x264
[Aegisub](https://www.linuxidc.com/Linux/2016-01/128039.htm)

# Wine-deepin
[2018年wine QQ最完美解决方案（多Linux发行版通过测试并稳定运行）](https://www.lulinux.com/archives/1319)
TIM
微信

# 下载工具
[uGet](https://blog.csdn.net/fengyulinde/article/details/78309314)

# 截图工具
Shutter 建议在设置-键盘中设置快捷键命令：`shutter -s`

# 博客工具
hexo

# 翻墙工具
shadowsocksR
lantern

#其他工具
[thefuck](https://www.jianshu.com/p/0d37b22aabba)
[indicator-sysmonitor](https://blog.csdn.net/tecn14/article/details/24489031/) 状态栏网速监控工具

# 相关软件的配置
gedit 首选项，插件看需求
notepadqq 配色 [编译命令](https://blog.csdn.net/dongzhiyu/article/details/61207022?utm_source=blogxgwz3)
gnome-tweak-tool 根据需求设置
