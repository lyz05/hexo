---
title: PandoraBox使用记录
tags:
  - 教程
  - 网络
categories:
  - 互联网
  - 原创
mathjax: true
date: 2019-11-17 17:32:06
---
# 前言
其实早在大一下就开始使用PandoraBox了，奈何一直没有写篇博文记录一下。
PandoraBox是国内从原版OpenWrt整出来的分支。最开始时，我是想直接用OpenWrt，但是好像我用的版本在路由器上有些问题。
后面发现了PandoraBox，有着除名字不同外，几乎一模一样的OpenWrt。
本次使用的路由器是斐讯K2p。早在高中时就有耳闻当时斐讯搞得0元购，奈何自己太年轻，并没有及时上车。所以我上车的时候已经晚了。
以为遭阿里系的封杀，我在腾讯系的转转找了一个专门做斐讯硬改和刷机的商家，选了硬改的斐讯k2p，大概270元左右，己经相当贵了，但是挺值的。（主要原因还是知名度太高，被炒高价格了）暑假帮同学再买时又贵了10-20元。

## 需求&选择
有两大需求促使我买一台路由器，并刷机上PandoraBox。
一是我需要一个支持WIFI 5(802.11ac)且穿墙信号尚可的路由器，用于家里上网，家里广电原配的渣渣路由器穿墙能力不行。
二是学校宿舍需要一台路由器，搞定我在学校使用WIFI上网的难题。因为学校宽带贼贵，我没买，WIFI绑定MAC地址上网。
如果只是普通的上网，那也不需要刷机，主要是想实现路由器WIFI自动认证，以及使用附带的其他功能。如：打印机、SSR。
打印机是因为宿舍弄了个小型打印店，方便我直接远程打印。
SSR不解释

### 系统选择
而在所有的路由器相关的系统中，也就OpenWrt的软件包最为多，可以实现高度定制化的功能。就直接上手最难的OpenWrt。后面，歪打正着的遇到了PandoraBox。

### 路由器选择
主要还是因为我孤陋寡闻，只知道K2P牛逼，支持刷机。因为原版K2P是不带USB口的，然后看到有硬改的，而且直接刷好，完美符合小白的我的需求。

# 刷机
## uboot
首先选择一台成色上好的路由器，然后开始刷机。
刷机前，像安卓机的Recovery系统一样，需要刷个预刷机系统不死uboot。
[不死uboot使用教程 - 全文](http://www.elecfans.com/dianzichangshi/20171211600608_a.html)
上面有一篇关于uboot的使用教程，和针对newifi的刷机教程。
因为买回来的时候已经是刷好uboot的了。所以，并没有实际尝试过，只能云尝试一波。

## Pandorabox
[K2P A1 A2 路由器刷机教程 最详细教程，适合新手！](https://www.right.com.cn/forum/thread-361922-1-1.html)
然后就是PandoraBox的刷机了，首先肯定是各种备份，把uboot中能备份的组件都备份了。然后选择固件上传，开刷就好。
刷机记得选择的是公版。
默认用户名密码`root`和`admin`

## LEDE
[koolshare Lede X64 Nuc](http://firmware.koolshare.cn/LEDE_X64_fw867/)
在上面这个链接可以下载到适用于Vmware的LEDE镜像
默认密码`koolshare`


# 配置
## 配置上网
### 路由器配置
刷好之后，应该可以通过路由器ip访问到uhttpd搭载的luci界面。
默认的WAN口连接方式是DHCP客户端，如果网线可以直接使用DHCP获取ip地址上网，就不需要配置。
我在学校就需要通过WIFI桥接的方式来联网。
在网络————无线中选择扫描，选择要连接的WIFI，输入密码。分配WAN防火墙。一路下一步就可以完成。这种方式相当于WIFI接入WAN口，套了一层NAT。但可以所有设备公用这一个IP地址的网络。所以，接下来要解决的就是让路由器像手机一样认证学校WIFI。
学校WIFI其实就是一个网页，通过抓包可以看到学校WIFI认证的URL，访问这个URL就可以认证。这样也就绕过了网页中的只允许手机设备认证的限制。
除了当路由器用，也可以当交换机用，只需要关闭DHCP服务，所有的设备都接入LAN口就好。

### 虚拟机配置
虚拟机因为有显示器和默认路由器的原因，需要自己配置网络
`vi /etc/config/network`中配置静态ip桥接接入宿主主机网络。这个口为LAN口
单一LAN口还需要配置网关和DNS

## SSH管理
在系统——管理中可以设置SSH管理方式，修改密码，添加密钥。

## 酷软中心
这好像是个asp的动态网页，加上虚拟机强大的性能，完美的图像化，傻瓜都可以配置。
关键字`koolss`

### 虚拟机做旁路由
这是比较麻烦的事情，因为要做旁路由，简单的说，虚拟机桥接物理网络，配置好虚拟机IP地址，然后需要走旁路由的机子，手动配置网关和DNS。如果拥有局域网中的网关权限，那还可以更自由话的更改DHCP服务器，相关配置。
只要做到所有往内网外的报全部转到旁路由，由旁路由转发即可。

## 软件包
OP(OpenWrt)的可玩性在于丰富的软件包，以及类linux的Shell。
OP使用opkg包管理器，一个类似于apt的包管理器。可以通过shell或者luci界面安装，安装luci应用可以直接过滤luci的包。自动解决依赖。

### shadowsocksR plus+
在路由器上直接配置就好了，1904版本支持多节点轮换，当主节点挂了，可以自动切换结点。路由方式等各种功能还是比较全的。

### FRP内网穿透
frp的路由器版本，也可以直接用作者github上编译的路由器版本，那就没有luci界面可用了。

### 负载均衡
解决多WAN上网的问题。
除了可以单个设备认证wifi热点上网，还可以实现多个设备认证WiFi上网。通过k2p的两个无线网卡，可以分别接入学校的wifi，然后做MAC地址伪装，在从不同的网络接口发出认证包，结合负载均衡(mwan3)就可以实现多WAN上网。目前我在用的就是这种形式(10M+5M)
mwan3配置文件
```
config rule 'login1'
	option dest_ip '10.0.0.0/16'
	option sticky '0'
	option proto 'all'
	option use_policy 'wwan1_only'
	option src_ip '192.168.1.100'

config rule 'login'
	option dest_ip '10.0.0.0/16'
	option sticky '0'
	option proto 'all'
	option use_policy 'wwan_only'
	option src_ip '192.168.1.1'

config rule 'vpn'
	option dest_ip '10.1.0.0/16'
	option proto 'all'
	option sticky '0'
	option use_policy 'wwan1_only'

config rule 'https'
	option sticky '1'
	option dest_port '443'
	option proto 'tcp'
	option use_policy 'wwan1_only'

config rule 'default_rule'
	option dest_ip '0.0.0.0/0'
	option proto 'all'
	option sticky '0'
	option use_policy 'wwan1_only'

config policy 'balanced'
	option last_resort 'default'
	list use_member 'wwan1_m1_w1'
	list use_member 'wwan_m1_w1'

config interface 'wwan1'
	option enabled '1'
	option family 'ipv4'
	option count '1'
	option size '56'
	option timeout '2'
	option interval '5'
	option failure_interval '5'
	option recovery_interval '5'
	option flush_conntrack 'never'
	option reliability '1'
	list track_ip '10.0.10.11'
	option down '5'
	option up '1'

config interface 'wwan'
	option enabled '1'
	option family 'ipv4'
	option count '1'
	option size '56'
	option timeout '2'
	option interval '5'
	option failure_interval '5'
	option recovery_interval '5'
	option flush_conntrack 'never'
	option reliability '1'
	list track_ip '10.0.10.11'
	option down '5'
	option up '1'

config member 'wwan1_m1_w1'
	option interface 'wwan1'
	option metric '1'
	option weight '1'

config member 'wwan_m1_w1'
	option interface 'wwan'
	option metric '1'
	option weight '1'

config policy 'wwan_only'
	list use_member 'wwan_m1_w1'
	option last_resort 'default'

config policy 'wwan1_only'
	list use_member 'wwan1_m1_w1'
	option last_resort 'default'
```

# 校园网认证
这是我写的校园网认证用的shell脚本。
这个脚本有指定从那个接口发包，拿去用时，要自己修改一下。
auth.sh
```sh
#!/bin/sh
#依赖：curl,wget,network.sh

#account=180021107080
loginurl="http://10.0.21.23/wifi.jhtml?loginurl&userid=180021104890&ip=10.0.15.102:8080&unicom=1&username=&password="
logouturl="http://10.0.15.102:8080/portal/entrance/http_logout.jsp?language=Chinese"
urlfilename="/root/0.txt"
loginfilename="/root/login.txt"
logoutfilename="/root/logout.txt"
networkfilename="/root/network.sh"

login()
{
	#获取认证链接
	echo -e '获取认证链接过程：'
	/usr/bin/curl --interface apclix0 -m 5 $loginurl -o $urlfilename
	
	#读取并显示认证链接信息
	str=$(cat /root/0.txt)
	echo -e '\n认证原始链接：'
	echo $str
	echo -e '认证处理后链接：'
	echo ${str:21:197}
	for i in $(seq 1 5); do
		#访问认证链接
		echo -e '认证过程：'
		/usr/bin/wget --bind-address=10.3.20.249 --header="Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3" --header="Accept-Encoding: gzip, deflate" --header="Accept-Language: zh-CN,zh;q=0.9,zh-TW;q=0.8" -U "Mozilla/5.0 (Linux; U; Android 2.2.1; en-us; Nexus One Build/FRG83) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1" -O $loginfilename "${str:21:197}"
		#/usr/bin/curl --interface apcli0 --header "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3" --header "Accept-Encoding: gzip, deflate" --header "Accept-Language: zh-CN,zh;q=0.9,zh-TW;q=0.8" -A "Mozilla/5.0 (Linux; U; Android 2.2.1; en-us; Nexus One Build/FRG83) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1" -o $loginfilename "${str:21:193}"
		#获取认证返回信息文件的大小
		size=$(ls -l $loginfilename | awk '{print $5}')
		echo -e '认证结果文件大小：'
		echo $size
		#显示认证返回信息
		str1=$(cat $loginfilename)
		echo -e '认证返回信息：\n'
		echo $str1
		#判断认证是否成功
		if [ $size = "7" ]; then
			break;
		fi
	done
}

logout()
{	
	echo -e '下线过程：'
	/usr/bin/curl --interface apclix0 --header "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3" --header "Accept-Encoding: gzip, deflate" --header "Accept-Language: zh-CN,zh;q=0.9,zh-TW;q=0.8" -A "Mozilla/5.0 (Linux; U; Android 2.2.1; en-us; Nexus One Build/FRG83) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1" -o $logoutfilename $logouturl
	echo -e '下线结果：'
	str=$(cat $logoutfilename)
	echo $str
}

relogin()
{
	ash $networkfilename www.baidu.com
	if [ $? -eq 1 ]; then
		login
	fi
}

help()
{
	echo 'auth version: auth'
	echo 'Describe: 校园网认证工具'
	echo 'Useage：auth [command]'
	echo -e '\nOptions:'
	echo ' login			: 校园网认证'
	echo ' logout			: 校园网下线'
	echo ' relogin		: 校园网检测断线并重连，与crontab搭配使用'
	echo ' help			: 显示本帮助信息'
}

if [ -d $1 ]; then 
	help
elif [ $1 = "help" ]; then
	help
elif [ $1 = "login" ]; then 
	login
elif [ $1 = "logout" ]; then 
	logout 
elif [ $1 = "relogin" ]; then 
	relogin 
else
	echo "无效的参数"
fi


#wget --header="Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3" --header="Accept-Encoding: gzip, deflate" --header="Accept-Language: zh-CN,zh;q=0.9,zh-TW;q=0.8" -U "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36" -O 0.txt 'http://blxx.zhbit.com/wifi.jhtml?loginurl&userid=180021104890&ip=10.0.15.102:8080&unicom=0&username=&password='
#blxx.zhbit.com
#/usr/bin/wget --bind-address=10.3.44.59 --header="Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3" --header="Accept-Encoding: gzip, deflate" --header="Accept-Language: zh-CN,zh;q=0.9,zh-TW;q=0.8" -U "Mozilla/5.0 (Linux; U; Android 2.2.1; en-us; Nexus One Build/FRG83) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1" -O $logoutfilename $logouturl
```
network.sh
```sh
#!/bin/sh
#检测网络连接
#依赖：httping

httptest()
{
	httping -c 2 -t 1 $1 > /dev/null 2>&1
	if [ $? -eq 0 ];then
		echo success
		return 0
	else
		echo failed
		return 1
	fi
}

pingtest()
{
	ping -W 2 -c 2  $1 > /dev/null 2>&1
	if [ $? -eq 0 ];then
		echo success
		return 0
	else
		echo failed
		return 1
	fi
}
if [ -d $1 ]; then 
	echo -n '校园dns测试.........'
	pingtest 10.0.10.11
	echo -n '校园官网测试.........'
	httptest www.bitzh.edu.cn
	echo -n 'Baidu测试.........'
	pingtest www.baidu.com
	echo -n 'google测试.........'
	httptest www.google.com
else
	echo -n $1' test......'
	pingtest $1
	#echo $?
	exit $?
fi

```
与corntab结合可以实现定时自动认证，corntab+auth.sh relogin可以实现轮询检测是否断网，从而重新认证。
对于我来说一般不会掉认证。但是因为学校的WIFI晚上1点会有使用时段限制，所以每天一大早就会掉认证，这就需要每天一大早，给他自动认证一发。
corntab中使用的执行语句
```sh
/root/auth.sh relogin > /root/auth.log 2>&1  &
```
修改rc.local可以添加路由器启动时执行的语句
因为rc.local执行的时候网络还没初始化好，所以要延迟执行语句,我设置的是1min，相对来说比较合适。
```sh
sleep 60 && /root/auth.sh relogin > /root/auth.log 2>&1
```
# LED灯开关
鉴于晚上LED灯刺眼，所以使用脚本开关
关灯脚本
```sh
#!/bin/bash
for i in `ls /sys/class/leds`
do
  cd /sys/class/leds
  cd $i
  echo 0 > brightness
done
```
开灯脚本
```sh
/etc/init.d/led start
```
然后弄一个crontab就好了
