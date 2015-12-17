title: 【NOIP】剑与魔法(dragons)
tags: [题解,原创]
---
Description
--
万老师听说某大国很流行穿越，于是他就想写一个关于穿越的剧本。

闲话休提。话说老师穿越到了某一个剑与魔法的大陆。因为如此这般，所以老师从维娜艾那里得到了预言。老师一共被告知了若干件按顺序结算的事件。这些事件分为两类：战役事件（CASE）、穿越回去事件（END）。战役事件可以选择是否参加，参加了之后会获得一定的金钱。每个END事件发生需要至少参加一定数量的战役事件。特别的是，END事件如果满足要求就会强制发生。老师希望在大陆玩个够，所以他要求只有最后一个END事件会发生。老师希望获得最多的金钱，所以求助于你。   

Input
--
第一行一个数N，表示输入文件有多少行。

接下来每一行用空格隔开一个字符和一个整数。字符为“c”表示战役事件，接下来的整数表示这次涨RP顺带有多少钱；字符为“e”表示穿越回去事件，接下来的整数代表至少要涨多少RP。最后一个事件保证是END事件。   
Output
--
第一行一个整数，最多金钱数目。

若不可能则输出-1。
Sample Input
--

```
5
c 10
c 12
e 2
c 1
e 2
```

Sample Output
--

```
13
```

Data Constraint
--
30%的数据满足 N<=20

60%的数据满足 N<=1,000

100%的数据满足 N<=200,000

每次涨RP事件赏金不超过10,000

穿越事件的要求不超过200,000   
Analysis
--
显然可以用堆来统计答案，一开始想用大根堆来统计答案，但是会发现有各种难以判断的地方。
所以正难则反，我们可以维护一个小根堆。首先我们要把最后一个END事件去掉，在统计答案的过程中是没有用的。从前往后坐，每次遇到CASE事件，都将对应的金钱push进堆中，每次遇到END事件都将大于END时间限制个数的金钱pop，答案就是做到最后堆中剩余金钱的总和。最后再看看堆中的元素个数是否大于最后一个END的限制值。(然而我并没有判(^__^)嘻嘻)

Code
--

```
const	maxn=200000;oo=100000000;
var	i,j,n,size,last,t:longint;
	h:array[1..maxn] of longint;
	a:array[0..maxn,1..2] of longint;
	b:array[0..maxn] of longint;
	ch:char;
	ans:int64;
procedure swap(var x,y:longint);
var	t:longint;
begin
	t:=x;
	x:=y;
	y:=t;
end;
procedure down(x:longint);
var	y:longint;
begin
	y:=2*x;
	while ((y<=size) and (h[x]>h[y])) or ((y+1<=size) and (h[x]>h[y+1])) do
	begin
		if (y+1<=size) and (h[y+1]<h[y]) then inc(y);
		swap(h[x],h[y]);
		x:=y;
		y:=2*x;
	end;
end;
procedure up(x:longint);
begin
	while (x>1) and (h[x]<h[x>>1]) do begin
		swap(h[x],h[x>>1]);
		x:=x>>1;
	end;
end;
procedure pop;
begin
	h[1]:=h[size];
	h[size]:=oo;
	dec(size);
	down(1);
end;
procedure push(x:longint);
var	i:longint;
begin
	inc(size);
	h[size]:=x;
	up(size);
end;
begin
	readln(n);
	for i:=1 to n do begin
		readln(ch,a[i,2]);
		if ch='c' then a[i,1]:=1 else a[i,1]:=2;
	end;
	
	for i:=1 to n-1 do begin
		if a[i,1]=1 then push(a[i,2])
		else begin
			t:=a[i,2]-1;
			while size>t do pop;
		end;
	end;
	ans:=0;
	for i:=1 to size do inc(ans,h[i]);
	writeln(ans);
end.
```