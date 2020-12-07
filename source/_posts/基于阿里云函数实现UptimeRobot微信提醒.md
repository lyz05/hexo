title: 基于阿里云函数实现UptimeRobot微信提醒
tags:
  - 教程
categories:
  - 互联网
  - 原创
mathjax: true
date: 2020-12-07 14:04:51
---
# 前言
Uptime Robot可以非常方便的实现对网站上线率的监控，免费拥有每5分钟检测一次，最多50个网站的接入功能。
其中的题型功能支持很多海外IM工具，但并没有微信。
要实现微信提醒可以配合Uptime Robot的WebHook功能，通过使用ServerChan往微信发送消息。
ServerChan能提供每天500次推送请求。ServerChan同样拥有一个URL，对其发送Http请求就能推送消息了。
但是Http的请求参数与UptimeRobot中WebHook的请求参数不一样，所以我们需要一个转换器，将从UptimeRobot的WebHook请求转换为ServerChan的请求。而使用阿里云函数是最方便部署这样的小功能，无服务器架构，稳定可靠又免费。

在此之前通过搜索得知此博文[Uptime Robot接入微信提醒](https://blog.chrxw.com/archives/2019/12/02/794.html)
此博文使用的方式是PHP，但是要在服务器上部署PHP环境实在太麻烦了，而且还要出一个服务器的钱，也很难保证稳定性。

# 部署
此次使用的方式是阿里云函数的Http触发器，可以先参考一下我的另一篇博文[基于阿里云函数实现弹幕文件解析接口](https://blog.home999.cc/2020/%E5%9F%BA%E4%BA%8E%E9%98%BF%E9%87%8C%E4%BA%91%E5%87%BD%E6%95%B0%E5%AE%9E%E7%8E%B0%E5%BC%B9%E5%B9%95%E6%96%87%E4%BB%B6%E8%A7%A3%E6%9E%90%E6%8E%A5%E5%8F%A3/)了解一下如何快速的搭建一个Python环境的Http触发器。
然后在index.py中粘贴上我下方的代码：
``` Python index.php
# -*- coding: utf-8 -*-

from urllib.parse import unquote,quote,parse_qs
import requests
import urllib.request
import json
import time as t
import datetime
params = ''

# To enable the initializer feature (https://help.aliyun.com/document_detail/158208.html)
# please implement the initializer function as below：
# def initializer(context):
#    logger = logging.getLogger()  
#    logger.info('initializing')

def get_response(url,text,desp):
    payload = {'text':text,'desp':desp}
    response = requests.get(url,params=payload)
    response.encoding = 'utf-8'
    return response.text

def paramsget(key):
    return params.get(key,[""])[0]

def timeformat(obj):
    timestamp = obj.last_modified
    time = datetime.datetime.fromtimestamp(timestamp, tz)
    return time.strftime("%Y-%m-%d %H:%M:%S")

def handler(environ, start_response):
    global params
    response_headers = [('Content-type', 'text/html; charset=utf-8')]

    if 'QUERY_STRING' in environ:
        query_string = environ['QUERY_STRING']
        params = parse_qs(query_string)
        SCKEY = paramsget('token')
        desp = '### 名称: '+paramsget('monitorFriendlyName')+'\n'\
        +'#### 网址: ('+paramsget('monitorURL')+')\n'\
        +'#### 详情: '+paramsget('alertDetails')+'\n'\
        +'#### 状态: '+paramsget('alertTypeFriendlyName')+'\n'\
        +'#### 持续: '+paramsget('alertDuration')+'\n'
        if (paramsget('alertType') == '1'):
            text = paramsget('monitorFriendlyName')+'服务器下线啦\n'
        elif (paramsget('alertType') == '2'):
            text = paramsget('monitorFriendlyName')+'服务器上线啦\n'
        else:
            status = '500'
            start_response(status, response_headers)
            ret = '传入参数错误'
            return [ret.encode('utf-8')]
    else:
        status = '500'
        start_response(status, response_headers)
        ret = '传入参数错误'
        return [ret.encode('utf-8')]


    ret = get_response("https://sc.ftqq.com/"+SCKEY+".send",text,desp)

    # do something here
    status = '200'
    start_response(status, response_headers)
    return [ret.encode('utf-8')]
```
后面可以参考[Uptime Robot接入微信提醒](https://blog.chrxw.com/archives/2019/12/02/794.html)，在UptimeRobot添加一个WebHook题型功能，注意要将查询字符串中的token改成你自己在ServerChan中获取到的SCKEY。

然后就可以了。
当然如果你实在是懒得可以，也可以直接调用我用上面代码实现的API:[https://fc.home999.cc/webhook?token=xxxx&](https://fc.home999.cc/webhook?token=xxxx&),如果不放心后端代码实现，那还是自己部署吧。