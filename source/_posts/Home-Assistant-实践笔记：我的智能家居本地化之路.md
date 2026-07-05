---
title: Home Assistant 实践笔记：我的智能家居本地化之路
tags:
  - 教程
categories:
  - 互联网
  - 原创
mathjax: true
date: 2026-07-05 11:07:09
---
# 背景
家里买了新的美的家电，空调、电热水器、洗衣机。与此同时，家里还有个小爱音箱。于是萌生出一个使用小爱音箱控制美的家电设备的想法。经过搜寻，HA可以集成各种品牌的智能家居设备。

# 部署方案
我是使用斐讯N1作为HA的主机，安装了Armbian系统，docker环境。一条命令直接启动容器。
``` sh
  docker run -d --name home-assistant   --restart=unless-stopped   --network=host   -v /home/congcong/Configs/HomeAssistant:/config   homeassistant/home-assistant
```
如果需要升级，则需要重新拉取新镜像，删除旧容器，用新镜像重新创建容器。因为懒得写docker-compose文件，所以直接用命令行操作。
``` sh
  docker stop home-assistant
  docker rm home-assistant
  docker pull homeassistant/home-assistant
  docker run -d --name home-assistant   --restart=unless-stopped   --network=host   -v /home/congcong/Configs/HomeAssistant:/config   homeassistant/home-assistant
```

# 配置目录介绍
配置文件目录下主要会用到 或者 修改到的文件有
| 文件或目录 | 作用 |
| --- | --- |
| configuration.yaml | HA的主配置文件 |
| automations.yaml | 自动化配置文件 |
| scripts.yaml | 脚本配置文件 |
| custom_components/ | HACS、自定义集成安装位置 |
| backups/ | HA备份文件存放位置 |

# 主配置文件修改
尽管HA的可视化配置已经有很多功能，但仍有部分功能需要在主配置文件中进行修改。
下面是我在配置文件中修改的内容：WoL(Wake on Lan)功能、PushPlush推送功能、SSL证书配置。
```yaml configuration.yaml
switch:
  - platform: wake_on_lan
    name: "Desktop"                 # 定义HA中实体的名称,可任意命名
    mac: "AA-BB-CC-DD-EE-FF"        # 主机(电脑)的MAC地址
    host: "192.168.0.10"            # 主机(电脑)地址,可省略
    broadcast_address: "192.168.0.255"      # 广播地址.不可省略.此处假设路由器地址为192.168.1.1,如为其他网段需要修改
    broadcast_port: 9               # 止定wol端口,可省略

notify:
  - name: WeChatPush
    platform: rest
    resource: https://www.pushplus.plus/send
    method: POST
    message_param_name: content
    data:
      token: "你的token"
      title: "来自HA的通知"

http:
  ssl_certificate: /config/ssl/fullchain.pem
  ssl_key: /config/ssl/privkey.pem

```

# HACS集成
HA自带的组件和集成比较少，如果想将 米家 和 美的接入，就需要借助第三方的商店，HACS是Home Assistant Community Store的缩写，是一个第三方插件管理工具。
通过HACS可以安装各种自定义组件、主题和插件，极大地扩展了Home Assistant的功能。
除了HACS商店列出的组件以外，还可以安装Github上其他开发者的自定义组件。
安装的本质就是将git仓库克隆到HA的custom_components目录下，然后在HA中配置即可。
国内的可以用替换了github源的版本 [HACS 极速版](https://github.com/hacs-china/integration)，手动安装就好，将仓库克隆并解压到HA的custom_components目录下，然后在HA中配置即可。
下面介绍几个目前在用的HACS组件：

## Xiaomi Home 与 Xiaomi Miot
[Xiaomi Home](https://github.com/XiaoMi/ha_xiaomi_home) 是小米官方的Home Assistant集成，支持小米智能家居设备的接入和控制。通过这个集成，可以将小米的智能设备（如灯泡、插座、传感器等）添加到Home Assistant中，实现统一管理和自动化控制。
[Xiaomi Miot](https://github.com/al-one/hass-xiaomi-miot) 是一个第三方的Home Assistant集成，专注于小米米家设备的接入。它支持更多的设备类型和功能，尤其是一些官方集成不支持的设备。
Xiaomi Miot 主要接入小爱音箱，后续需要与小爱音箱进行对话的时候会用到，主要是用到里面的 `播放控制 conversation` 这个传感器，这个传感器能获取到最后一次与小爱音箱的对话记录。
其他常规的米家设备用 Xiaomi Home 接入就可以了。

### 配置集成
在HA主页的左侧菜单中，点击“设置”->“设备与服务”，然后点击右下角的“添加集成”，在搜索框中输入集成名称（如 Xiaomi Home、Xiaomi Miot 等），然后按照提示进行配置即可。
配置完成后会生成集成卡片，可以看到当前接入了多少设备。
我的做法是将`Xiaomi Home`里的所有设备全部接入了，因为家里的智能灯有时会将开关关上，导致设备离线。为了避免烦人的设备离线提示，在“显示设备状态变化通知”去掉了"离线"的勾选，这样就不会在HA频繁收到设备离线的通知了。

## [Midea AC LAN](https://github.com/wuwentao/midea_ac_lan)
用来接入`美的美居`中的设备。通过这个集成，可以在Home Assistant中控制和监控这些美的设备，实现自动化场景和远程控制。

## [AI合集(AI HUB)](https://github.com/ha-china/ai_hub)
可以将HA中的语音助手接入大模型，继承了STT（语音转文本）、TTS（文本转语音）、对话处理（大语言模型）等功能。
STT：注册一个硅基流动ASR的账户，目前好像不收费
TTS：Edge TTS语音，微软的语音合成模型，声音挺自然的，也是网上短视频营销号最喜欢用的语音合成，普通话、方言不在话下。
对话处理（大语言模型）：根据需要选一个平台的大预言模型，兼容OPENAI的地址。我使用的是`packyapi`[推广链接](https://www.packyapi.com/register?aff=VkP5)中转。
提示词模板如下：
```markdown
你是 Home Assistant 的家庭语音助手，名字叫小白。

请真实、准确地回答问题。

回答要求：
- 使用简体中文。
- 使用纯文本，不使用 Markdown。
- 默认只回答一句话。
- 简洁、直接，只说结果。
- 不重复用户的问题。
- 不主动解释原因，除非用户要求。
- 不使用"好的"、"当然"、"没问题"、"根据分析"、"希望对您有所帮助"等客套话。
- 控制设备时，仅确认执行结果。
- 查询状态时，仅返回用户需要的信息。
- 分析数据时，先说结论，再补充一句必要说明。
- 尽量控制在30个汉字以内，复杂问题不超过两句话。
- 信息不足时，直接说明无法确定，不要猜测。
```
最后，需要在设置->语音助手里创建一个语音助手，选择 "AI HUB" 作为对话代理，并关联之前配置好的 STT（硅基流动）和 TTS（Edge TTS）服务。具体步骤如下：

1. 进入 设置 → 语音助手 → 添加助手。
2. 设置名称（如“小白”），选择对话代理为 "AI HUB"。
3. STT 选择 "SenseVoiceSmall (SiliconFlow)"，TTS 选择 "Edge TTS"。
4. 保存并启用。

可以用手机的HA测试下语音助手（STT/TTS）功能是否正常，电脑的语音助手只能测试对话代理。公开新实体里面要将语音助手可见的实体选中，这样语音助手才能读取设备信息或操控设备。

## [天气预报](https://github.com/hasscc/tianqi)
支持接入国内的天气预报服务，获取实时天气信息和预报数据。
可以知道最近2小时是否有雨以及有无天气预警信号。
可以设计自动化，比方说，有天气预警信号的时候，小爱音箱播报相关信息。

## [TP-Link Router](https://github.com/AlexandrErohin/home-assistant-tplink-router)
接入TP-Link路由器，获取路由器的状态信息和设备连接情况。可以监控网络流量、设备在线状态等。
主要有两个用途，显示一下WAN口的运营商分配的内网/公网IP。用于追踪某台设备是否连入家里WiFi，来判断某人是否在家。

## [南方电网集成](https://github.com/CubicPill/china_southern_power_grid_stat)
可以查询南方电网的电费信息，获取用电量和费用数据。
目前用处不大，接入之后可以查询当月、当年、去年的用电量。应该可以通过创建辅助元素，做一些简单的统计分析。

## [Bemfa](https://github.com/skddyj/bemfa)
将 Home Assistant 实体同步至巴法云，并使用小爱同学/天猫精灵/小度音箱控制。
把HA中的设备同步到巴法云，再在米家中添加第三方设备，选巴法。
相当于米家中添加了几个HA的设备，因此，手机小爱，音箱小爱都能实现原生控制。
我接入了美的的洗衣机、电热水器 和 空调，基本的开关操作是可以的，但查询设备信息不行。
我还接入了 台式机电源 开关，可以WoL控制台式机开机。

# 官方集成
## Kodi
可以在Kodi里面开启http控制，这样HA也能操控kodi播放的内容。
我家客厅的电视就装了Kodi APP,这样HA可以播放`翡翠台`这样的IPTV内容。

## 移动应用
手机上安装HA官方APP后，这里就会显示对应的设备，可以给每个人创建一个用户，并将用户绑定到设备，在地图中画一个家里的电子围栏。这样当手机位置靠近家里时，HA就会显示此人在家。
能接入挺多手机里的状态信息，可以自行研究。

## 证书到期
用处不是很大，单纯是怕有时候ACME自动签发证书功能失效了，可以监控证书是否到期，还有多久到期。

## Backup
开启备份后自带的集成，也就是备份的一些状态信息。

## System Monitor
可以将运行HA的宿主机的系统基本信息接入进HA，比方内存占用、CPU占用、网络地址之类。

# 自动化
集成只是把设备信息汇总到 HA 平台，每次操作还得打开 APP，这未免太麻烦。实际还停留在智能家居的第一步：设备接入。
而自动化，则能让智能家居根据预设条件自动控制设备，真正解放双手。
典型的自动化脚本分为三段式，触发、条件、动作。
 - 触发（Trigger）：定义何时启动自动化，比如时间到达、设备状态变化、传感器数值变化等。
 - 条件（Condition）：可选，用于在触发后进一步判断是否执行动作，比如只在特定时间段、某人不在家时才执行。
 - 动作（Action）：触发且条件满足时，实际执行的操作，如开灯、发送通知、调用服务等。
下面我挑选几个经典的自动化介绍下，可以打破原有的 米家 和 美的美居 平台的割裂。

## 小爱音箱播报天气预警信息
安装了`天气预报`模块后，读取里面的预警信息，就能通过小爱音箱实时播报天气预警信息。
```yaml
alias: 中山天气变为异常
description: ""
triggers:
  - entity_id:
      - binary_sensor.zhongshan_warning
    trigger: state
    attribute: alarms
conditions:
  - condition: sun
    before: sunset
    after: sunrise
  - condition: template
    value_template: "{{ state_attr('binary_sensor.zhongshan_warning', 'warning') }}"
actions:
  - data:
      execute: false
      silent: false
      text: "{{ state_attr('binary_sensor.zhongshan_warning', 'alarms')[0].title }}"
      entity_id: media_player.xiaomi_lx06_0298_play_control
    action: xiaomi_miot.intelligent_speaker
mode: single

```

## 小爱音箱提醒
先监听热水器的状态变化，再根据条件判断是否触发提醒。
只需简单调用`xiaomi_miot.intelligent_speaker` 这个动作完成TTS就行。
```yaml
alias: 热水器煲好提醒
description: ""
triggers:
  - type: running
    device_id: 9818a0028171033c896e0bb47426c63d
    entity_id: b5379c416aba05cc8ccf03e434a6977b
    domain: binary_sensor
    trigger: device
conditions:
  - condition: device
    type: is_on
    device_id: 9818a0028171033c896e0bb47426c63d
    entity_id: d2029cdd11b1bd9aa650a21ddcf6b4c8
    domain: switch
actions:
  - device_id: 8b102b825bfe1999db7c35fe5cedb168
    domain: text
    entity_id: 919c6bc6e64d953a98e079379874a50f
    type: set_value
    value: 热水煲好了，快去享用热水
mode: single
```

## 小爱音箱对话
举个例子，比如，当我询问小爱音箱“热水器当前多少度？”时，它可以直接回答“热水器当前温度为 XX 度”。
这里的判断条件，是监听小爱音箱 `conversation` 实体中的识别结果，判断里面是否包含想要的关键字，再去调用音箱对应的播报服务，把设备当前状态实时读出来。
STT的结果可以从 `trigger.to_state.state` 里读取
TTS的内容可以直接调用 `xiaomi_miot.intelligent_speaker` 这个动作来完成。
在 设置-> 开发者工具中可以测试 模板 和 调用动作。
```yaml
alias: 询问小爱热水器温度
description: ""
triggers:
  - entity_id:
      - sensor.xiaomi_lx06_0298_conversation # 改成自己的小爱音箱的conversation
    trigger: state
conditions:
  - condition: template
    value_template: " {{ '热水器' in trigger.to_state.state and '度' in trigger.to_state.state }}"
actions:
  - data:
      execute: false
      silent: false
      entity_id: "{{ trigger.to_state.attributes.parent_entity_id }}"
      text: 热水器当前温度为{{ states('sensor.194613558808523_current_temperature') }}度
    action: xiaomi_miot.intelligent_speaker
mode: single
```

## 小爱音箱接入语音助手大模型
前面的小爱对话，还是基于本地规则和固定回复来完成的。
而这一步，我想做得更进一步：让小爱音箱直接把用户的话交给大模型处理。
不过这里有个小问题，小爱音箱在正常识别到语音后，会先走官方渠道进行回复，这时候 HA 拿到 `conversation` 内容的时机已经比较晚了，所以需要先打断官方的回答。
我这里用了一个取巧的方法：先让小爱音箱执行“停止”指令，把官方播报打断，然后再调用 `conversation.process`，把用户的对话文本 `trigger.to_state.state` 交给大模型处理。
大模型返回结果后，再沿用前面的方式，把回答通过小爱音箱播报出来，
这样就完成了一次完整的“语音提问 -> 大模型回答 -> 音箱播报”的闭环，同时大模型也能正常处理对HA接入设备的操控。
```yaml
alias: 询问小白小爱（AI答复）
description: ""
triggers:
  - entity_id:
      - sensor.xiaomi_s12_5928_conversation
    trigger: state
conditions:
  - condition: template
    value_template: " {{ '小白' in trigger.to_state.state }}"
actions:
  - device_id: 43e8a7dcedf7617fc2025721f7ec2411
    domain: text
    entity_id: c4f6c0f19b42d57339b9ce71698645d3
    type: set_value
    value: 停止
  - action: conversation.process
    data:
      text: "{{ trigger.to_state.state }}"
      agent_id: conversation.siliconflow_qwen3_8b
    response_variable: ai
  - data:
      execute: false
      silent: false
      entity_id: "{{ trigger.to_state.attributes.parent_entity_id }}"
      text: "{{ ai.response.speech.plain.speech }}"
    action: xiaomi_miot.intelligent_speaker
mode: single
```

## 询问小爱音箱手机电量
借助前面的`移动应用`集成，可以把手机电量信息作为传感器接入。
这样我只要直接问小爱音箱“手机电量多少？”它就能把当前电量播报出来，不用再拿起手机看一眼。

实现方式和前面的对话场景类似，还是先监听小爱音箱的 `conversation` 结果，再判断用户是否在询问“手机”和“电量”这两个关键词。如果命中，就读取手机电量传感器的值，然后通过小爱音箱播报出来。

如果家里有多个小爱音箱，也可以复用同一套逻辑，只需要从自动化触发时的消息体里取出对应的触发对象，让触发这次自动化的小爱音箱来播报回复。

```yaml
alias: 询问小爱手机电量
description: ""
triggers:
  - entity_id:
      - sensor.xiaomi_s12_5928_conversation
      - sensor.xiaomi_l05c_e513_conversation
    trigger: state
conditions:
  - condition: template
    value_template: " {{ '手机' in trigger.to_state.state and '电量' in trigger.to_state.state }}"
actions:
  - data:
      execute: false
      silent: false
      entity_id: "{{ trigger.to_state.attributes.parent_entity_id }}"
      text: 手机电量为百分之{{ states('sensor.22081212c_battery_level_2') }}
    action: xiaomi_miot.intelligent_speaker
mode: single

```

## KODI播放指定URL
我还做了一个定时联动：在指定时间检查家里的电视是否处于开机状态，如果开机，就自动切换到翡翠台。
先通过一个定时自动化，在固定时间触发判断；如果电视在线，就先通过小爱音箱播报一句“新闻时间到”，然后再调用 KODI 的播放脚本，直接跳转到预设的直播源。
自动化实例如下：
```yaml
alias: 定时跳转翡翠台
description: ""
triggers:
  - trigger: time
    at: "18:30:00"
conditions:
  - condition: state
    entity_id: device_tracker.c4_bd_8d_45_24_ba
    state: home
actions:
  - device_id: 8b102b825bfe1999db7c35fe5cedb168
    domain: text
    entity_id: 919c6bc6e64d953a98e079379874a50f
    type: set_value
    value: 新闻时间到
  - action: script.kodi_2
    metadata: {}
    data: {}
mode: single

```
如果只是让 KODI 播放 TVB 新闻，其实逻辑也很简单，直接调用 `media_player.play_media` 即可，把直播地址传进去，KODI 就会开始播放。
脚本实例如下：
```yaml
action: media_player.play_media
metadata: {}
data:
  media:
    media_content_id: https://mytv.cdn.loc.cc/o12.php?id=fct
    media_content_type: video
  announce: true
target:
  entity_id: media_player.1304dian_shi

```

# 总结
折腾 Home Assistant 这段时间，我最大的感受是，它真正强大的地方并不只是“能接入多少设备”，而是它能把原本分散在不同平台、不同生态里的能力，重新整合成一套属于自己的本地自动化系统。

从设备接入、状态联动，到小爱音箱播报、语音对话，再到接入大模型，这套方案基本已经覆盖了我日常最常用的智能家居场景。它不追求一步到位，但胜在足够灵活、足够本地，也足够可控。很多功能看起来只是一个小小的自动化，真正连起来之后，体验其实会顺很多。

对我来说，智能家居最有意思的地方，不是买了多少设备，而是把这些设备真正串成一个能为自己服务的系统。不管是偏技术的折腾，还是偏生活化的体验，最终目的其实都是一样的：让技术真正服务于生活，让家里的设备变得更聪明，也让日常使用变得更自然。

刚开始玩 HA 的时候，还没有 AIGC 这些工具。现在有了 AIGC 之后，不管是学习新东西，还是编写新脚本，效率和质量都提升了很多，很多想法也更容易快速落地，踩坑的概率也少了不少。尤其像 HA 这种以 YAML 配置为主的方式，对 AI 也更友好，不需要它理解你在 GUI 里一步一步点了什么，直接根据配置文件就能更好地协助修改和生成内容。