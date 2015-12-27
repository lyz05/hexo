---
date: 2015-08-16 20:54:00
title: 【NOIP】独立集(bubble)
tags:
  - 题解
  - 线段树
categories:
  - 信息学
  - 原创
---
Tips
--
题目来源：http://www.luo.hustoj.com/problem.php?id=1287

Analysis
--
从这个顺(dou)旺(bi)基同学的代码中，我们发现他的算法实际上是给逆序对连边，而独立集所在的集合中，任意两个都不存在连边(即不是逆序对)，那就是顺序的。并且题目要求我们要找出一个最大的独立集，求出他的长度，那就是要我们求最长不下降子序列，而因为给出的n个数是全排列。所以就是求最长上升子序列。这个可以用(nlogn)的二分查找求出。最关键的就是怎么求第二问最长上升子序列中那些点是必选的。

首先我们从左往右做一遍最长上升子序列，并得到他的数组f。f[i]表示以i结尾在[1..i]中的最长下上升子序列的长度
同样我们从右往左最一遍最长下降子序列，并得到他的数组g。g[i]表示以i为结尾的在[i..n]中的最长下降子序列。

ans1表示第一个答案（即最长上升子序列）的值
当f[i]+g[i]-1=ans1时，就说明这个点在其中一个最长上升子序列中（但不是第二题的合法位置）。所以我们要从这些点中找出唯一的点。如果在ans2的数组中发现一个位置有两个人已经使用过了，那么这个位置的答案就是不合法的。

我们来看一下下面这个例子：


**i      1  2  3  4  5**
**a[i]  5  1  3  2  4**
**f[i]   1  1  2  2  3**
**g[i]  1  3  2  2  1**

ans1=3
其中，2 3 4 5都是任意最长上升子序列中的一部分，但是因为2 与 3 的f值重复了，所以这两个点就不是答案了。

现在还有一个问题就是如何快速的得到f和g数组。然而网上的O(N log N)只支持求长度而不能得到每一个f或g的值。而O(N^2)的算法又太慢了。因为这道题有一个关键的条件那就是：
	输入的数据是全排列
所以我们可以从左往右求f值，将每一个f值塞入到线段数的叶子[a[i],a[i]]中然后维护线段树的最大值，当计算下一个f[i]的值时，就询问线段书[1,a[i]]的区间中的最大值,将得到的最大值+1就是当前的f[i]值，重复这样的操作就的合法的f序列。正确性显然。
当你从左往右添加时，由于在右边的f[i]值并没有塞入线段数中，所以询问[1,a[i]]时并不会得到那些f值，只有已经在i前面的f值才能得到，并且这些f值所对应的a[j]都要比a[i]小。就与O(n^2)的算法转移类似。具体实现可看代码。
Code
--
然而此题并不需要如此复杂的线段树，只要支持单点修改和区间查询最大值即可。当然如果你有能力完全可以写树状数组。
```
uses	math;
const	maxn=100000;
var	i,n,maxx:longint;
	h:array[1..4*maxn,1..2] of longint;
	a,g,f,ans:array[1..maxn] of longint;
procedure change(x,l,r,st,en,val:longint);
var	mid:longint;
begin
	if (l=st) and (r=en) then begin
		inc(h[x,1],val);inc(h[x,2],val);
	end else begin
		inc(h[x+x,1],h[x,2]);inc(h[x+x,2],h[x,2]);
		inc(h[x+x+1,1],h[x,2]);inc(h[x+x+1,2],h[x,2]);
		h[x,2]:=0;
		mid:=(l+r)>>1;
		if en<=mid then change(x+x,l,mid,st,en,val)
		else if st>mid then change(x+x+1,mid+1,r,st,en,val)
		else begin
			change(x+x,l,mid,st,mid,val);
			change(x+x+1,mid+1,r,mid+1,en,val);
		end;
		h[x,1]:=max(h[x+x,1],h[x+x+1,1]);
	end;
end;
function quary(x,l,r,st,en:longint):longint;
var	mid:longint;
begin
	if (l=st) and (r=en) then begin
		exit(h[x,1]);
	end else begin
		inc(h[x+x,1],h[x,2]);inc(h[x+x,2],h[x,2]);
		inc(h[x+x+1,1],h[x,2]);inc(h[x+x+1,2],h[x,2]);
		h[x,2]:=0;
		mid:=(l+r)>>1;
		if en<=mid then exit(quary(x+x,l,mid,st,en))
		else if st>mid then exit(quary(x+x+1,mid+1,r,st,en))
		else
		exit(max(quary(x+x,l,mid,st,mid),quary(x+x+1,mid+1,r,mid+1,en)));
	end;
end;
begin
	//assign(input,'3485.in');reset(input);

	readln(n);
	for i:=1 to n do read(a[i]);

	maxx:=0;
	fillchar(h,sizeof(h),0);
	for i:=1 to n do begin
		f[i]:=quary(1,1,n,1,a[i])+1;
		change(1,1,n,a[i],a[i],f[i]);
		maxx:=max(maxx,f[i]);
	end;
	fillchar(h,sizeof(h),0);
	for i:=n downto 1 do begin
		g[i]:=quary(1,1,n,a[i],n)+1;
		change(1,1,n,a[i],a[i],g[i]);
	end;
	for i:=1 to n do begin
		if (f[i]+g[i]-1=maxx) then begin
			if (ans[f[i]]>0) or (ans[f[i]]=-1) then 
				ans[f[i]]:=-1 
			else ans[f[i]]:=i;
		end;
	end;
	writeln(maxx);
	for i:=1 to maxx do 
		if ans[i]>0 then write(ans[i],' ');
	writeln;
end.

```