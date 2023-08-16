---
title: 基于Clash透明代理的实现
tags:
  - 教程
  - 网络
categories:
  - 互联网
  - 原创
mathjax: true
date: 2020-10-10 08:44:45
---
# 研究原因
为了使之前写的WireGuard大内网融合方案，能更进一步完成科学上网。而不需要在多个VPN频繁切换。
实现一次接入，打通内网外网，实现真正意义上的异地组网融合。

# 安装与配置
## 服务端配置
Docker部署还是很香的，所以我这里使用的是Docker部署，使用官方的Docker镜像，写好一份`docker-compose.yml`配置文件,一键部署。
因为Docker网络这块不太了解，并且要在宿主机上配置iptables防火墙与路由，所以直接使用宿主机网络。就不需要做端口映射了。
```yml docker-compose.yml
version: '3.4'

services:
  clash:
    image: dreamacro/clash-premium:2021.07.03
    cap_add:
      - NET_ADMIN
    devices:
      - /dev/net/tun
    restart: unless-stopped
    volumes:
      - ./config.yaml:/root/.config/clash/config.yaml:ro
    network_mode: host
    # When your system is Linux, you can use `network_mode: "host"` directly.
    container_name: clash
```
在`./clash`目录中需要准备三份文件`config.yaml``ui`
其中只有`config.yaml`是必须要自己编写放好。
`ui`目录用于WEB端控制的前端代码。可以选择`yacd`直接下载静态网页就好
因为要实现透明代理，按照官方文档必须启用DNS，这里有一份`config.yaml`示例
关于DNS后面会写一篇关于DNS的博文来详细讲述。
这里面nameserver就填国内的DNS，fallback就填国内直连能获取到的国外DNS。
由于现在多数的Public DNS都已经支持EDNS，所以解析结果会更加精准。
理论上选择一个国外DNS就够了，但为了更快的速度，国内解析结果用国内DNS更快。
由于现在境内对境外DNS的干扰严重，DoT，DoH都已经是重点关照对象。虽然没有直接封禁Public DNS的IP地址，但是其他相关的检测技术都用上了。目前还能无污染的拿到IP地址的方式也就只有使用非常规端口了。
然而Clash并不依赖于准确的IP地址解析，即使是污染的地址，Clash也会重构发往代理的数据包，将IP地址反向解析为域名，并让远端代理服务器去解析真正的IP，所以在本地只起到一种域名与IP的映射功能。
```yml config.yaml
port: 7890
socks-port: 7891
redir-port: 7892
allow-lan: true
mode: Rule
log-level: warning
external-controller: 0.0.0.0:9090
secret: ""
external-ui: ui
#此处内容请安装一个gui版本的clash然后在里面配置好代理然后抄过来
dns:
  enable: true
  listen: :1053
  enhanced-mode: redir-host
  nameserver:
    - '114.114.114.114'
    - '223.5.5.5'
  fallback:
    - 208.67.220.220:5353
    - 208.67.222.222:5353
    - 101.6.6.6:5353
proxies:
proxy-groups:
rules:
```
成功启动后接下来就是编写最为关键的`iptables`规则
为了规避流量成环问题，规则中没有对设备进行透明代理的相关代码。只有经过此电脑中转的数据包才会进行透明代理。
在此之前需要开启当前linux系统的路由功能。
临时生效：
`echo "1" > /proc/sys/net/ipv4/ip_forward`
永久生效的话，需要修改`sysctl.conf`：
`net.ipv4.ip_forward = 1`
执行`sysctl -p`马上生效
下面是参考底部[参考文档](#参考文档)中的TPROXY方式改写的iptables规则，能够将TCP与UDP的流量准确筛选后送给clash
可以看到规则中有对所有53端口的UDP数据包的重定向，重定向的端口得是clash的DNS端口。
```bash postup.sh
#!/bin/bash
#Clash(Tproxy TCP+UDP)
# ROUTE RULES
ip rule add fwmark 1 table 100
ip route add local 0.0.0.0/0 dev lo table 100

# CREATE TABLE
iptables -t mangle -N clash

# RETURN LOCAL AND LANS
iptables -t mangle -A clash -d 0.0.0.0/8 -j RETURN
iptables -t mangle -A clash -d 10.0.0.0/8 -j RETURN
iptables -t mangle -A clash -d 100.64.0.0/10 -j RETURN
iptables -t mangle -A clash -d 127.0.0.0/8 -j RETURN
iptables -t mangle -A clash -d 169.254.0.0/16 -j RETURN
iptables -t mangle -A clash -d 172.16.0.0/12 -j RETURN
iptables -t mangle -A clash -d 192.168.0.0/16 -j RETURN
iptables -t mangle -A clash -d 224.0.0.0/4 -j RETURN
iptables -t mangle -A clash -d 240.0.0.0/4 -j RETURN

# whitelist China ip.
iptables -t mangle -A clash -m set --match-set china dst -j RETURN

# FORWARD ALL
iptables -t mangle -A clash -p udp -j TPROXY --on-port 7893 --tproxy-mark 1
iptables -t mangle -A clash -p tcp -j TPROXY --on-port 7893 --tproxy-mark 1

# REDIRECT
iptables -t mangle -A PREROUTING -j clash

# hijack DNS to Clash
iptables -t nat -N CLASH_DNS
iptables -t nat -F CLASH_DNS 
iptables -t nat -A CLASH_DNS -p udp -j REDIRECT --to-port 1053
iptables -t nat -I PREROUTING -p udp --dport 53 -j CLASH_DNS
```
配置好后可以观察能否进行透明代理。
通过在本机访问http://localhost:9090/ui/
可以使用WEB管理Clash
通过使用`docker-compose logs`可查看Clash运行日志
测试没问题后，需要将iptables规则保存，在下次自启动时，能自动生效。
[Ubuntu Server 如何永久儲存iptables的設定？](https://magiclen.org/ubuntu-server-iptables-save-permanently/)
如果不想永久储存iptables规则，可以在执行clash前先执行上面的`postup.sh`结束clash后在执行下面的`postdown.sh`恢复原有网络
```bash postdown.sh
#!/bin/bash
#Clash(Tproxy TCP+UDP)
ip rule del fwmark 1 table 100
ip route del local default dev lo table 100
# 对局域网其他设备进行透明代理
iptables -t mangle -D PREROUTING -j clash
iptables -t mangle -F clash
iptables -t mangle -X clash
# hijack DNS to Clash
iptables -t nat -D PREROUTING -p udp --dport 53 -j CLASH_DNS
iptables -t nat -F CLASH_DNS
iptables -t nat -X CLASH_DNS
```
## 客户端配置
在一个局域网环境下(二层网络中),手动配置静态地址，将设备的网关与DNS均指向上述部署了Clash的linux机子中即可使用。
如果写了重定向DNS的iptables规则，则可以不下发DNS，使用默认的DNS，只要保证网关是运行Clash的透明网关且DNS数据包经过这个透明网关即可。
除此之外还可以通过DHCP来下发代理网关和DNS，也可以通过DHCP来指定设备下发，其余设备走默认网关/DNS。
`DHCP Options 6 DNS`
`DHCP Options 3 Gateway`
只需先绑定mac地址，给绑定的mac地址下发不同的DHCP Options即可。
除此之外，DHCP还可以下发PAC地址，客户端自动配置代理。目前测试Windows，IOS均可使用，Android，Linux不太行。
`DHCP Options 252 PAC`
Windows IOS均需要启用代理自动获取

# 与WireGuard联动
在相同的机子部署WireGuard，并设置这台电脑为出口网关，其余设备只要接入WireGuard，就既能访问WireGuard设备中的内网资源，又能完成科学上网。
对端的wireguard设备将数据包往这个透明网关路由，也能获得科学上网能力。这样就不局限于在同一局域网（二层网络）的条件限制。

# 参考文档
[Clash Document](https://lancellc.gitbook.io/clash/)
<!-- 重传文件，以应对阿里云OSS封禁 -->