---
title: Hyperledger fabric学习与实践
tags:
  - 教程
categories:
  - 互联网
  - 原创
mathjax: true
date: 2022-11-19 15:41:22
---
在开始学习与实践之前，需要准备相关环境。
因为Github Codespaces的免费额度用满了，所以我选择了在Ubuntu22.04.1安装Hyperledger Fabric的开发环境。
# 环境准备
## 所需工具版本
Ubuntu 22.04.1
go version go1.19.3 linux/amd64
fabric 2.4.7
docker 20.10.21
docker-compose version 1.29.2

## 安装Go语言环境
因为APT软件源中的Go版本较低，所以需要手动安装。
```bash
curl -O https://storage.googleapis.com/golang/go1.19.3.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.19.3.linux-amd64.tar.gz
vi ~/.profile
source ~/.profile
```
在`~/.profile`文件后追加如下内容
```bash ~/.profile
export GOROOT=/usr/local/go
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin:$GOROOT/bin
```

## 安装Fabric样例、Docker镜像和二进制文件
your_github_userid：是你的github账号
$HOME/go： 该目录是Go官方建议目录
```bash
mkdir -p $HOME/go/src/github.com/<your_github_userid>
cd $HOME/go/src/github.com/<your_github_userid>
curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh
./install-fabric.sh
```

# 使用Fabric的测试网络
这段命令用于启动Fabric测试网络，它会创建一个由两个对等节点和一个排序节点组成的Fabric网络。
启动完测试网络后需要我们创建通道并部署链码（智能合约）。
通道是用于划分每个节点的私有区域，每个通道都有自己的账本和账本的副本。
官网教程给的链码是一个简单的[资产管理链码](https://github.com/hyperledger/fabric-samples/tree/main/asset-transfer-basic)。
在Fabric中，智能合约作为链码以软件包的形式部署在网络上。链码安装在组织的对等节点上，然后部署到某个通道，然后可以在该通道中用于认可交易和区块链账本交互。
deplyCC: 部署链码
-ccn: 链码名称
-ccp: 链码路径
-ccl: 链码语言(go (default), java, javascript, typescript)
```bash
cd fabric-samples/test-network
./network.sh down
./network.sh up createChannel # 启动网络并创建通道
./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-go -ccl go # 部署链码
```
## 与网络交互
peer CLI:允许您调用已部署的智能合约，更新通道，或安装和部署新的智能合约。
如果已经在[安装示例、二进制和 Docker 镜像](https://hyperledger-fabric.readthedocs.io/zh_CN/latest/install.html)中下载了二进制文件，就可以配置二进制文件与配置文件的环境变量。
```bash
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
```
使用peer0.Org1身份登录网络进行操作
初始化账本
重置asset6所有者为Christopher
```bash
# Environment variables for Org1

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"function":"InitLedger","Args":[]}'
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"function":"TransferAsset","Args":["asset6","Christopher"]}'
```
使用peer0.Org2身份登录网络进行操作
```bash
# Environment variables for Org2

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051
peer chaincode query -C mychannel -n basic -c '{"Args":["ReadAsset","asset6"]}'
```
## 客制化
阅读asset-transfer-basic中chaincode的源码，可知有以下方法：
```js
InitLedger(ctx)
CreateAsset(ctx, id, color, size, owner, appraisedValue)
ReadAsset(ctx, id)
UpdateAsset(ctx, id, color, size, owner, appraisedValue)
DeleteAsset(ctx, id)
AssetExists(ctx, id)
TransferAsset(ctx, id, newOwner)
GetAllAssets(ctx)
```
因此可以使用peer CLI调用这些方法
对于查询请求使用：query，修改请求使用：invoke
```bash
peer chaincode query -C mychannel -n basic -c '{"Args":["GetAllAssets"]}' | jq
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"function":"CreateAsset","Args":["asset7","blue","5","Tom","35"]}'
peer chaincode query -C mychannel -n basic -c '{"Args":["ReadAsset","asset7"]}'
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"function":"UpdateAsset","Args":["asset7","red","6","Tony","40"]}'
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"function":"DeleteAsset","Args":["asset7"]}'
peer chaincode query -C mychannel -n basic -c '{"Args":["AssetExists","asset7"]}'
```
## 关停网路
```bash
./network.sh down
```

# 编写你的第一个应用
启动网络
```sh
cd fabric-samples/fabcar
./startFabric.sh javascript
```
安装依赖
```js
cd javascript
npm install
ls
```
## 登记管理员用户
下边的部分执行和证书授权服务器通讯。你在运行下边的程序时，你会发现，打开一个新终端，并运行`docker logs -f ca_org1`来查看 CA 的日志流，会很有帮助。
我们登记一个 admin 管理员用户：
```sh
node enrollAdmin.js
```
注册和登记应用程序用户
```sh
node registerUser.js
```
## 查询账本
现在，我们有了两个独立用户的身份—— admin 和 appUser ——它们可以被我们的应用程序使用。
首先，我们来运行我们的 query.js 程序来返回账本上所有汽车的侦听。这个程序使用我们的第二个身份——user1——来操作账本。
```sh
node query.js
```
## 更新账本
`submitTransaction` 比 `evaluateTransaction` 更加复杂。除了跟一个单独的 peer 进行互动外，SDK 会将 `submitTransaction` 提案发送给在区块链网络中的每个需要的组织的 peer。其中的每个 peer 将会使用这个提案来执行被请求的智能合约，以此来产生一个建议的回复，它会为这个回复签名并将其返回给 SDK。
SDK 搜集所有签过名的交易反馈到一个单独的交易中，这个交易会被发送给排序节点。
排序节点从每个应用程序那里搜集并将交易排序，然后打包进一个交易的区块中。
接下来它会将这些区块分发给网络中的每个 peer，在那里每笔交易会被验证并提交。
最后，SDK 会被通知，这允许它能够将控制返回给应用程序。
在真实世界中的一个应用程序里，智能合约应该有一些访问控制逻辑。比如，只有某些有权限的用户能够创建新车，并且只有车辆的拥有者才能够将车辆交换给其他人。

# 参考资料
[企业级区块链实战教程](https://learnblockchain.cn/books/enterprise/01%20preface.html)
[安装示例、二进制和 Docker 镜像](https://hyperledger-fabric.readthedocs.io/zh_CN/latest/install.html)
[使用Fabric的测试网络](https://hyperledger-fabric.readthedocs.io/zh_CN/latest/test_network.html)
[编写你的第一个应用](https://hyperledger-fabric.readthedocs.io/zh_CN/release-2.2/write_first_app.html)

<!-- 
# 论文初步想法
粤康码信息上BCOS链
澳门健康码信息上Fabric链
设计各自链上数据结构（根据现有的二维码上的信息设计）
链上组织机构：卫生局（上传疫苗、核酸信息）、公安局（上传身份证信息）
广东的粤康码依托粤省事，粤省事中需要人脸识别或微信支付密码来实名认证。
澳门的健康码，需要自行填写身份信息。
 -->