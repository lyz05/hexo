---
title: 基于阿里云函数计算实现OSS文件自动索引功能
tags:
  - 教程
categories:
  - 互联网
  - 原创
mathjax: true
date: 2020-02-14 16:02:34
---
# 前言
可能是我的搜索方式不对。总之，我找不到OSS自动索引当前目录文件的功能。所以，决定自己写一个，操作并不难。

首先要有一个美观的索引页面，为了锻炼一下自己，就用bootstrap手写了一个，效果如下：

![001](/images/基于阿里云函数实现OSS文件自动索引功能/001.png)

# 使用
因为是使用的阿里云函数计算，所以要先开通服务
新建函数 - 事件函数
![002](/images/基于阿里云函数实现OSS文件自动索引功能/002.png)

所在服务，函数名称：随便取一个名
运行环境：python3 (因为我是用Python写的)
函数入口：index.handler(代表OSS事件发生后，会调用index.py里的handler函数)
函数执行内存：选一个最小的就够用了

![003](/images/基于阿里云函数实现OSS文件自动索引功能/003.png)

在代码执行中直接粘贴下面的代码
![004](/images/基于阿里云函数实现OSS文件自动索引功能/004.png)

```
import oss2
import json
import datetime

auth = oss2.Auth('<你的阿里云AccessKey>', '<你的阿里云AccessKeySecret>')
endpoint = 'oss-cn-hongkong-internal.aliyuncs.com'
#endpoint = 'oss-cn-hongkong.aliyuncs.com'
bucketName = '<你的bucketName>'
bucket = oss2.Bucket(auth, endpoint, bucketName)
#返回给云函数的信息
message = ""

#列举Object大小
def objsize(obj):
    dict = {0:'B',1:'KB',2:'MB',3:'GB'}
    size = obj.size
    cnt = 0
    while (size/1024>=1 and cnt<3):
        size /= 1024
        cnt += 1
    return str(round(size,2))+dict[cnt]

#列举Object最后修改时间
def objtime(obj):
    timestamp = obj.last_modified
    time = datetime.datetime.fromtimestamp(timestamp)
    return time.strftime("%Y-%m-%d %H:%M:%S")

# 写某一个Object的链接
def writeitem(obj,folder):
    #当前Object不是首页和当前目录
    if (len(folder) != len(obj.key) and obj.key.find('index.html') == -1):
        #Object是目录
        if (obj.is_prefix()):
            return "<tr><td><a href='/"+obj.key+"'>"+obj.key[len(folder):]+"</a></td><td></td><td></td></tr>"
        else:
            return "<tr><td><a href='/"+obj.key+"'>"+obj.key[len(folder):]+"</a></td><td>"+objsize(obj)+"</td><td>"+objtime(obj)+"</td></tr>\n"
    else:
        return ""

# 列举folder目录下所有文件和子目录。flag:是否递归
def dfs(folder,flag):
    global message
    #index.html头部信息
    html = "<!DOCTYPE html><html><head><meta http-equiv=\"content-type\" content=\"txt/html; charset=utf-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><link rel=\"stylesheet\" href=\"https://cdn.staticfile.org/twitter-bootstrap/3.4.1/css/bootstrap.min.css\"><title>Index of /"+folder+"</title></head><body><div class=\"container\"><div class=\"row\"><h1>Index of /"+folder+"</h1><hr><table class=\"table table-striped table-hover\"><thead><tr><th>File name</th><th>File Size</th><th>Date</th></tr></thead><tbody>"
    #首页不需要返回上一层
    if (folder!=''):
        html += "<tr><td><a href='../'>../</a></td><td></td><td></td></tr>\n"
    # 列举文件夹
    for obj in oss2.ObjectIterator(bucket, prefix=folder, delimiter = '/'):
        if obj.is_prefix():
            html += writeitem(obj,folder)
            #message += 'directory: ' + obj.key+'\n'
    # 列举文件
    for obj in oss2.ObjectIterator(bucket, prefix=folder, delimiter = '/'): 
        if not obj.is_prefix():
            html += writeitem(obj,folder)
            #message += 'file:' + obj.key+'\n'
    #index.html尾部信息
    html += "</table><hr></div></div></body></html>"
    #上传index.html的地址
    url = folder+"index.html"
    #上传index文件
    result = bucket.put_object(url, html)
    #print(html)
    message += 'Url:{0}'.format(url) + '\n'
    message += 'HTTP status: {0}'.format(result.status)+'\n'
    #递归操作
    if (flag):
        for obj in oss2.ObjectIterator(bucket, prefix=folder, delimiter = '/'):
            if obj.is_prefix():  # 文件夹
                dfs(obj.key,flag)

#OSS有创建删除Object事件产生
def handler(event, context):
    global message
    message=""
    eventObj = json.loads(event)["events"]
    url = eventObj[0]['oss']['object']['key']
    #得到事件发生Object的URL
    if (url.find('index.html')==-1 and len(url)-1!=url.rfind('/')):
        #不是index.html且不是目录
        if (url.find('/')==-1):
            dfs(folder = '',flag = False)
        else:
            dfs(url[:url.rfind('/')+1],False)
        return message
    else:
        return 'Not Modified'
```
可以在触发事件中选一个OSS模板的测试事件

![005](/images/基于阿里云函数实现OSS文件自动索引功能/005.png)

执行结果类似这样

![006](/images/基于阿里云函数实现OSS文件自动索引功能/006.png)

然后在创建一个OSS的触发器，中间可能会要求授予调用的权限，按照提示操作即可

![007](/images/基于阿里云函数实现OSS文件自动索引功能/007.png)

# 费用
阿里云函数计算每个月每个账户有一定的免费额度，所以正常使用免费。

OSS费用按照OSS的收费方式进行。