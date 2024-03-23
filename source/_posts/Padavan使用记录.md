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
 - VPN（Wireguard）
 - FRPS

### 动态域名解析
有待研究！
目前我是通过脚本的方式实现DDNS。

# 防火墙
在开启的情况下INPUT与FORWARD链的Policy都是DROP。
需要单独使用iptables与ip6tables设置。
```bash 在防火墙规则启动后执行
ip6tables -I FORWARD -p tcp -m multiport --dport 8080,51820,22604,3389 -j ACCEPT
ip6tables -I FORWARD -p udp -m multiport --dport 8080,51820,22604,3389 -j ACCEPT
```
前面设置过的IPv4端口转发依旧生效。

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
curl -k -4 "https://fc.lyz05.cn/ipinfo/ddns?subdomain=<domain>"
echo -e "\n****ipv4 update complete**"
ip=`ip -6 addr show br0 |grep 'scope global'|grep -v deprecated|awk -F '/|inet6 ' 'NR==1{print $2;}'iP`
curl -k "https://fc.lyz05.cn/ipinfo/ddns?subdomain=<domain>&ip=${ip}"
echo -e "\n****ipv6 update complete"

leases_file="/tmp/dnsmasq.leases"  # dnsmasq.leases 文件路径

# 检查文件是否存在
if [ ! -f "$leases_file" ]; then
    echo "Error: dnsmasq.leases file not found."
    exit 1
fi

# 使用grep过滤包含 "240e" 的行，并逐行读取过滤结果
grep "240e" "$leases_file" | while IFS=' ' read -r lease_time mac_address ip_address hostname client_id; do
    # 在这里可以对满足条件的行进行处理
    # echo "Lease Time: $lease_time"
    # echo "MAC Address: $mac_address"
    echo "IP Address: $ip_address"
    echo "Hostname: $hostname"
    # echo "Client ID: $client_id"
	curl -k "https://fc.lyz05.cn/ipinfo/ddns?subdomain=${hostname}&ip=${ip_address}"
	echo ""
    echo "--------------------------"
    # 在这里可以根据需要进行其他操作

done
```

# 参考文献
[^1]: [不用开机键，你的 Windows 也能随时就绪：WoL 网络唤醒入门](https://sspai.com/post/67003)