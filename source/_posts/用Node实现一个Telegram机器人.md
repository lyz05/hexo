---
title: 用Node实现一个Telegram机器人
tags:
  - 教程
categories:
  - 互联网
  - 原创
mathjax: true
date: 2022-11-10 13:31:19
---
# 前言
好久没开新坑了，今天就开一个新坑！
聊天机器人这个领域还没怎么涉及过，所以就想着做一个Telegram机器人，来练练手。
之所以选择Telegram，是因为它的API比较简单，而且有很多开源的库可以使用。
在国内常用的还是微信和QQ，但这两个受限于官方对机器人的态度，与国内众所周知的原因，所以就不考虑了。

# 技术选型
个人项目，开发效率是第一位，在此之前用Python比较多，正好想换换口味。在网上找到`node-telegram-bot-api`的Node模块，看到项目中的Example足够的简单快捷，就决定用Node来实现。
这也是我第一次完整的用Node写项目，刚开始就被module的导包所困扰，但幸运的是很快就解决。

# 申请机器人
因为在弄一个机器人服务之前，我就已经注册过一个机器人用于定时汇报服务器上的信息。当时就简单的调用一下API，就能给指定用户发送消息，再在服务器上设个cron定时任务，就能定时发送消息推送了。

根据网上的教程，在Telegram上搜索`BotFather`，然后点击`Start`，就能开始跟它聊天了。简单发送指令`/newbot`根据提示一步步操作即可。这里面有个`token`，就是机器人的唯一标识，有了这个就可以调用API操控机器人了。
![申请bot图片](/images/用Node实现一个Telegram机器人/001.png)

这次要做的是一个更加复杂的机器人，所以就需要申请一个新的机器人了。
这次申请的机器人是为了配合订阅功能加的，能够方便我推送维护信息和订阅链接。还有到期提醒功能。

# 机器人功能
## 智能聊天机器人
反正是整来玩的，机器人最基本的就是聊天吧，类似手机上的智能语音助手。
所以我找了个可以智能聊天的机器人，然后把它的API接入到我的机器人中，就能实现智能聊天了。
核心代码如下：
```js
// 智能聊天机器人
bot.on('text', msg => {
    if (msg.text.indexOf('/') === -1) {
        bot.sendMessage(msg.chat.id, 'you said: ' + msg.text);
        axios.get('https://api.qingyunke.com/api.php?key=free&appid=0&msg=' + encodeURI(msg.text)).then(res => {
            console.log(res.data);
            bot.sendMessage(msg.chat.id, res.data.content);
        });
    }
});
```
虽然比较智障，但聊剩余无。

## 欢迎页面
按照Telegram官方说法，每个机器人都应该有一个`/start`欢迎页面。
```js
// 欢迎页面
bot.onText(/\/start/, (msg) => {
    let name = [msg.from.first_name];
    if (msg.from.last_name) {
        name.push(msg.from.last_name);
    }
    name = name.join(" ");
    bot.sendMessage(msg.chat.id, `Welcome, ${name}!`);
    bot.sendMessage(msg.chat.id, `You can send me any message and I will repeat it back to you.`);
    bot.sendMessage(msg.chat.id, `You can also send me commands like /start, /help.`);
});
```

## 猜数游戏
100内的猜数游戏，怎么着也得来一个吧！
```js
//猜数游戏
bot.onText(/\/game/, (msg) => {
    const chatID = msg.chat.id;
    const guess = parseInt(msg.text.replace("/game", ""));
    if (game[chatID] == undefined) {
        game[chatID] = {
            num: Math.floor(Math.random() * 100),
            limit: 10,
        }
        bot.sendMessage(chatID, `我们来玩猜数游戏吧！`);
        bot.sendMessage(chatID, `猜一个数字，你有10次机会。范围:[0, 100)`);
        bot.sendMessage(chatID, `请输入你的猜测：(例：/game 50)`);
        return;
    }
    let {num, limit} = game[chatID];
    if (limit <= 0) {
        bot.sendMessage(chatID, `游戏结束！未猜出正确答案，正确答案为：${num}`);
        game[chatID] = undefined;
        return;
    }
    game[chatID].limit--;
    if (guess == num) {
        bot.sendMessage(chatID, `恭喜你猜对了！`);
        game[chatID] = undefined;
    } else if (guess > num) {
        bot.sendMessage(chatID, `你猜的数字太大了！`);
    } else {
        bot.sendMessage(chatID, `你猜的数字太小了！`);
    }
});
```

## 机器人指令设置
机器人的指令设置，主要是为了方便用户使用，也可以用来做一些简单的功能。
在此之前我都是自己去找`botfather`设置机器人的指令，查了下API手册，发现可以直接通过API来设置机器人的指令。
代码的含义：在发送`/help`指令时，机器人会告诉你指令的同时，再将指令设置到机器人上。
```js
    bot.onText(/\/help/, (msg) => {
        const helpMsg = [
            {command: 'start', description: '欢迎界面'},
            {command: 'game', description: '猜数游戏'},
            {command: 'sendpic', description: '发送你的头像'},
            {command: 'help', description: '帮助'},
        ];
        const helpMsgText = helpMsg.map(item => {
            return `/${item.command} - ${item.description}`;
        }).join("\n");
        bot.sendMessage(msg.chat.id, helpMsgText, {parse_mode: "HTML"});
        bot.setMyCommands(helpMsg);
    });
```

# 部署
这是一个十分令人头疼的问题。如果不想自己本地托管，还要免费的话，就得找合适的提供商。
在部署之前，首先得选部署方式：webhook、长轮询。
 - 长轮询：默认300ms进行一次api请求，会消耗一些网路带宽。同时，不适合函数计算这类会冻结进程的平台。
 - webhook：需要一个公网可访问的URL，让Telegram主动调用你的服务器URL，优点是能保证消息的新鲜度，节省资源。缺点是需要可信的证书。

## 阿里云函数计算
这是我第一个选择的平台，后面发现会有进程暂停的问题，不建议。
具体而言，就是设置webhook，来让Telegram触发阿里云函数计算，但是当我回复response的时候，函数计算会暂停进程，导致一些异步消息无法发送。当Telegram再次调用时，函数计算会重新启动进程，这样就会带来消息的延迟。
可以通过设置短暂的延迟返回response，来避免这个问题，但毕竟不是一个好办法。万一异步回调处理时间过长，就会导致消息发不出去。

## heroku
heroku是一个免费的云平台，可以用来部署nodejs应用。但是，heroku的免费版有一些限制，比如每个月只能运行550个小时，每个月只能有1000个请求，每个月只能有10GB的数据传输。这些限制对于一个普通的机器人来说，是完全够用的。
~~(以上是Copilot自动补全的结果，不保证数据的准确性，有可能是Copilot脑补的结果)~~
但是heroku要收费了！！那就不好意思，再见！
heroku不会出现函数计算那样的问题，heroku虽然也会冻结进程，但是他会在进程不活跃30分钟后，才冻结进程。
30分钟足够处理完所有的异步消息了。而且不需要在代码上做多余的修改。
美中不足的就是不能定时任务，定时推送消息。要定时推送还得外部调用来唤醒应用。

## fly.io
所有的不足都能得到弥补，因为平台不会冻结进程。程序会24h不间断运行，也有提供免费的ssl证书和域名。
最终我选择的是fly.io。但要看未来的免费政策会不会变化。

# 一些对Telegram Bot API的看法
整体来说Telegram Bot API还是很好用的。文档详细，也方便各个编程语言的社区提供了SDK。
官方也支持！自由度很大！
但目前对于图片、视频、音频还有些大小限制，不方便我愉快的爬视频。
我觉得机器人适合那些不会写WEB前端，又希望自己写些小工具来与自己后端交互的人。

# 后话
不得不说`Github Copilot`真的是个好东西，我写这篇文章的时候，`Copilot`给了超多的提示，让我写的更加快捷，也更加规范。
上面这句话都是`Copilot`写的，王婆卖瓜，自卖自夸！就是逻辑上还有待改进。

# 参考资料
* [Telegram Bot API](https://core.telegram.org/bots/api)
* [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)