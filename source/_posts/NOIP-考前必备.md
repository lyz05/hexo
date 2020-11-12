---
title: '【NOIP】考前必备'
date: 2015-11-03 17:26:00
tags:
categories:
  - 信息学
  - 原创
mathjax: true
---
考试前首先要调整好自己的心态，忘却之前发生的任何事情。

<strong>考试前(调试机子)
==
首先做好所有文件名后缀的关联，将.in，.out的文件关联至Notepad ++。
将.cpp，.pas关联至gvim。
在_vimrc中敲入下面配置信息
****
```vim
syntax on
set nu!
colorscheme darkblue

imap <F2> <esc>:w<cr>i
imap <F9> <F2><esc>:!fpc -g %<cr>i
imap <F10> <F2><esc>:!g++ -Wall -g % -o %:r<cr>i
imap <F11> assign(input,'.in');reset(input);
imap <F12> freopen(".in","r",stdin);
```
****
在notepad ++中设置
****
 1. 将窗口界面调小
 2. 配色方案选择blackboard
 3. 在首选项中设置自动更新文件
****
打好对拍程序
****
对拍
```bat
@echo off
:loop
	data.exe>data.in
	2.exe<data.in>1.out
	22.exe<data.in>11.out
fc "1.out" "11.out"
if not errorlevel 1 goto loop
pause
goto loop
```
单测
```bat
@echo off
:loop
	data.exe>data.in
	1.exe<data.in
	echo .............
	echo.
goto loop
```
****
打好文件输入输出
****
cpp版本

```cpp
#include <cstdio>
#include <algorithm>
#include <cstring>
#include <cmath>
using namespace std;

int main()
{
	freopen(".in","r",stdin);
	//freopen(".out","w",stdout);

	return 0;
}
```
pascal版本

```pascal
var	i,j,k,m,n:longint;
begin
	assign(input,'.in');reset(input);
	assign(output,'.out');rewrite(output);
	
	close(input);close(output);
end.
```

****
对拍数据生成例程
```cpp
#include <ctime>
#include <iostream>
#include <windows.h>
using namespace std;

int random(int x,int y)			//在int范围下生成区间为[x,y]的随机整数
{
	int ret = rand()*rand();
	return ret%(y-x+1)+x;
}

int main()
{
	srand(time(NULL));
	while(1)
	{
		cout << random(1,100) << endl;
		Sleep(100);
	}
	return 0;
} 
```
测试一下g++,fpc,gdb是否可用，若不可用，将环境变量设置一下。

<strong>考试中
==
考试时间3.5小时，有三道题目，注意分配好时间。
1. 先浏览三道题目，确保充分理解题目意思，并且能够模拟出样例数据。自己在心中评出试题的难度等级(一般题目顺序就是难度顺序)。最好能够在15分钟完成这部分内容。
2. 对每一道题目重新理解后，对照着数据范围想一个暴力可过好打的程序。(作为对拍的标程)，然后尽自己所能想一个最好的算法。
	
 - 在样例数据可以过的情况下，手动出一些小数据和一些一般性数据。然后用data生成大数据测试。
 - 在暴力确保正确性，且不超过暴力程序的数据范围的情况下，对拍“标程”。

3.在完成并测试过第一题的时间最好在比赛开始后的1个小时内(方便准备后面的题目)
4.第二三题尽量在1个小时之内完成。
5.在考试后的最后10分钟内，停止正在做的题目，将所有的程序文件输入输出改对，去掉调试代码。还有时间在争取能否做完其他题目。

<strong>考试后
==
1. 跟同学讨论一下试题，调整好心态，忘掉当天发生的任何事。
2. 如果心理素质较好写个总结也是可以的

<strong>NOIP知识点
==
[NOIP提高组复赛考察点详细分析(新浪)](http://blog.sina.com.cn/s/blog_6b249a4f0100uvu1.html)
[noip需要准备哪些方面的基础知识.复赛需要做哪些类型的题目（提高组）(作业帮)](http://www.zybang.com/question/924e718b7ff691252820f49ddec9e792.html)
