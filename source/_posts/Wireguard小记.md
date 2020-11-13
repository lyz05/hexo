---
title: Wireguard小记
tags:
  - 教程
categories:
  - 互联网
  - 原创
mathjax: true
date: 2020-09-15 17:23:27
---
# 研究原因
我一直需要一个内网穿透的解决方案，将各个地方的内网组在一起，组一个大内网。在网上先是找到了这篇博客
> [通过 Wireguard 构建 NAT to NAT VPN](https://anyisalin.github.io/2018/11/21/fast-flexible-nat-to-nat-vpn-wireguard/)
感觉到方案可行就开始着手了。

# 服务器选取
Wireguard只要求一方能够直连即可，就是说双方要有一方能主动发起并建立连接，另一方可以在NAT后。这样位于NAT后的主机也可通过位于公网的主机中转流量，从而实现内网穿透。
所以第一部是需要一台位于公网的主机。
在'kai'的推荐下，~主要是因为贫穷~选了一个国内的NAT VPS。国外服务器，Wireguard已被精准识别，也用不了。国内的NAT VPS，带宽大，价格便宜，适合做流量中转，可靠性一般，但对于我个人使用基本是够用的。
选的是一台东莞电信的NAT VPS，感觉像是个家宽，基本上IP一天一变。所以要用服务商给的域名去连接。这个动态IP也为后面的Wireguard连接埋了个坑。

# Wireguard软件安装
首先是建立隧道的双方都要安装Wireguard。安装Wireguard可以按照[官网](https://www.wireguard.com/)教程操作。
Wireguard对于Linux支持较好，功能较全。目前用的Windows,Android端都有图形界面，也还可以。
在Ubuntu中，将上面的配置文件保存在'/etc/wireguard/wg0.conf'后，使用
`systemctl enable wg-quick@wg0`
`systemctl start wg-quick@wg0`
就能把wireguard启动起来，并注册系统服务，下次开机自启动。
输入`wg`可以看到详细的信息。

# Wireguard软件配置
Wireguard的配置部分只有一个配置文件`wg0.conf`
这个配置文件形如：
```ini wg0.conf
[Interface]
PrivateKey = {PrivateKey}
ListenPort = 7890               #监听端口
Address = 192.168.88.102/24     #本机VPN接入地址
#发往其他网络策略的自动NAT策略
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -A FORWARD -o wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o ens160 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -D FORWARD -o wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o ens160 -j MASQUERADE
DNS = 192.168.88.4              #设置全局DNS

[Peer]
PublicKey = {PublicKey}
PresharedKey = {PresharedKey}
AllowedIPs = 0.0.0.0/0          #设置本机通过WireGuard的路由，并将符合路由的包发往此对端主机
Endpoint = 192.168.11.219:51820 #对端UDP socket，本机可直连的地址
PersistentKeepalive = 25        #位于NAT后的机子，为了保持隧道可用，而设置的心跳包间隔时间
```
在各个需要接入Wireguard网络中的主机填写好相应的配置文件后，各个主机间的三层互通就做好了。
要保证数据正常传输，最重要的时通信两端的`AllowedIPs`的配置，保证数据包有去有回。可以通过`ping`测试连通性。使用`tcpdump`与`Wireshark`抓包，观察数据包流向。

# 部署过程
## 传统星型拓扑组网方案
如果想让流量往Wireguard以外的网络(公网)发送，在linux上需要用`iptables`添加相关的SNAT的命令。在WireGuard中可以用`PostUp``PostDown`字段在程序运行结束时执行脚本。
其他所有位于NAT后的机器直连接入位于公网的服务器，并设置相应的`AllowedIPs = 0.0.0.0/0`，这样所有数据包都从这个公网服务器发出。这就是传统的VPN组件方案。

## NAT2NAT星型拓扑组网方案
有时不仅仅是想访问内网的某台设备，而是想让内网的地址也能走隧道传输。或者有多个地域的内网要打通，就需要本方案了。
根据[通过 Wireguard 构建 NAT to NAT VPN](https://anyisalin.github.io/2018/11/21/fast-flexible-nat-to-nat-vpn-wireguard/)教程操作基本就可以了。
先根据`传统星型拓扑组网方案`调试好，然后在想要进行内网代理的机子上做SNAT处理，处理方式跟上面一样，添加好相应的路由就行。对于Windows需要开启路由转发。根据[How to Setup Wireguard VPN Server On Windows](https://www.henrychang.ca/how-to-setup-wireguard-vpn-server-on-windows/)教程操作即可。对于OpenWrt可以在网络——防火墙——流量规则——SNAT中添加wg到lan的地址改写即可，注意配置路由。

# 目前方案
同样是采用星型的拓扑组网方案，作为服务器的是位于学校的服务器，同时用frp将端口映射到公网，便于公网接入。大多数时候直接校园网接入即可。这时只需要在这台服务器和家里的OpenWrt路由上做SNAT就可任意访问校内和家里资源。对于公网的数据还是从校内的这台服务器中转发出。在这台校内服务器上可以做一个透明代理，就能实现神奇的功能。
<!--
/24
192.168.88.1    腾讯云服务器
192.168.88.3    斐讯N1
192.168.88.4    102 ESXi Ubuntu虚拟机
192.168.88.100  笔电
192.168.88.101  手机
192.168.88.200  备用
 -->