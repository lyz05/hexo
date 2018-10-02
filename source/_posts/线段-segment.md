---
title: 线段(segment)
date: 2015-08-18 22:25:00
tags:
  - 题解
  - 线段树
  - hash
  - 快速幂
categories:
  - 信息学
  - 原创
---
Description
--
数轴上有很多单位线段，一开始时所有单位线段的权值都是1。有两种操作，第一种操作将某一区间内的单位线段权值乘以w，第二种操作将某一区间内的单位线段权值取w次幂。并且你还需要回答一些询问，每个询问需要求出某一区间的单位线段权值之积。由于答案可能很大，你只需要求出答案 mod (10^9+7)的值。

Input
--
第一行一个整数n，表示操作数量。

接下来n行，每行第一个整数表示操作类型，0表示第一种操作，1表示第二种操作，2表示询问，如果第一个数是0或1，则接下来3个数，表示操作区间和w，否则接下来两个数，表示询问区间。

Output
--
对于每组询问，输出一行，表示所求答案。

Sample Input
--

```
7
0 0 2 3
1 1 3 2
2 1 3
0 0 3 2
1 1 3 2
2 1 3
2 0 3
```

Sample Output
--

```
9
1296
7776
```

Data Constraint
--
下表中的“线段权值”表示“单位线段经过各种w处理后的权值范围”
![下表中的“线段权值”表示“单位线段经过各种w处理后的权值范围”](\images\线段\0.png)
Analysis
--
看完标题和题目，就给人一种提醒，此题要用线段树。仔细观察可以发现这题类似于线段树维护区间和。所以同理能用线段树解决。只是将这道题改成了区间积和增加了对区间取幂次方的修改。因为有两种修改，所以我们要维护两个下传标记。但是区间的范围却非常大，这显然是要爆空间的节奏啊！！
细心的我们发现，此题n很小，可是区间范围却很大，我们何不考虑一下离散化呢？这样子整个线段的长度就只有2n了。在做乘积的时候还需要用到快速幂。接下来就是怎么实现的问题了。
实现过程还是挺复杂的！！首先我们把读入的数据离线掉，并将各个区间的值排序后塞入hash表中，在hash表中存入旧位置及新位置对应的匹配。这样我们就能很快的从旧的位置找到新的位置。
剩下的问题就是如何去维护标记。我打了两个标记，一个是标记第一种操作在区间中乘了多少个w（没有他的L次幂，因为每个区间的L都有可能不同）。第二个标记是记录第二个操作（即这个区间乘了多少次方）。只用了这两个标记。剩下的就是线段树的实现了。
Code
--

```
const	maxn=20000+2;mo=1000000007;hamo=200000+2;
type	node=record
		v,ad,ad2:longint;
	end;
	arr=array[1..2*maxn] of longint;
var	i,n,sum,ret,x,y,z,t,kk:longint;
	q:array[1..maxn,1..4] of longint;
	h:array[1..hamo] of node;
	a:arr;
	len,d:array[1..hamo] of longint;
	hash:array[0..hamo,1..2] of longint;
procedure times(var x:longint;y:longint);
begin
	x:=(int64(x) * (y mod mo)) mod mo;
end;
function pow(x:int64;y:longint):int64;
begin
	pow:=1;
	while y<>0 do begin
		if odd(y) then pow:=(pow*x) mod mo;
		x:=(x*x) mod mo;
		y:=y>>1;
	end;
end;
procedure qsort(var a1:arr;l,r:longint);
var	m,i,j,t:longint;
begin
	m:=a1[(l+r) div 2];
	i:=l;j:=r;
	repeat
		while a1[i]<m do inc(i);
		while a1[j]>m do dec(j);
		if i<=j then begin
			t:=a1[i];
			a1[i]:=a1[j];
			a1[j]:=t;
			inc(i);dec(j);
		end;
	until i>j;
	if l<j then qsort(a1,l,j);
	if i<r then qsort(a1,i,r);
end;

procedure maketree(x,l,r:longint);
var	mid:longint;
begin
	if (l=r) then begin
		h[x].v:=1;
		h[x].ad:=1;
		h[x].ad2:=1;
		d[x]:=len[l];
	end else begin
		mid:=(l+r) >> 1;
		maketree(x*2,l,mid);
		maketree(x*2+1,mid+1,r);
		h[x].v:=1;
		d[x]:=d[x*2]+d[x*2+1];
		h[x].ad:=1;
		h[x].ad2:=1;
	end;
end;
procedure change(x,l,r:longint);
begin
        h[x*2].v	:=pow(h[x*2].v,h[x].ad2);
        h[x*2+1].v	:=pow(h[x*2+1].v,h[x].ad2);
        h[x*2].ad	:=pow(h[x*2].ad,h[x].ad2);
        h[x*2+1].ad	:=pow(h[x*2+1].ad,h[x].ad2);
        h[x*2].ad2	:=(int64(h[x*2].ad2) * h[x].ad2) mod (mo-1);
        h[x*2+1].ad2	:=(int64(h[x*2+1].ad2) * h[x].ad2) mod (mo-1);
        h[x].ad2	:=1;

        times(h[x*2].v,pow(h[x].ad,d[x*2]));
        times(h[x*2].ad,h[x].ad);
	times(h[x*2+1].v,pow(h[x].ad,d[x*2+1]));
        times(h[x*2+1].ad,h[x].ad);
        h[x].ad := 1;
end;
procedure modify1(x,l,r,st,en,w:longint);
var	mid:longint;
begin
	if (st<=l) and (r<=en) then begin
		times(h[x].v,pow(w,d[x]));
		times(h[x].ad,w);
	end else begin
		change(x,l,r);
		mid:=(l+r) >> 1;
		if en<=mid then modify1(x*2,l,mid,st,en,w)
		else if st>mid then modify1(x*2+1,mid+1,r,st,en,w)
		else begin
			modify1(x*2,l,mid,st,mid,w);
			modify1(x*2+1,mid+1,r,mid+1,en,w);
		end;
		h[x].v:=(int64(h[x*2].v) * h[x*2+1].v) mod mo;
	end;
end;
procedure modify2(x,l,r,st,en,w:longint);
var	mid:longint;
begin
	if (st<=l) and (r<=en) then begin
                h[x].v := pow(h[x].v,w);
                h[x].ad := pow(h[x].ad,w);
                h[x].ad2 := (int64(h[x].ad2) * w) mod (mo-1);
	end else begin
		change(x,l,r);
		mid:=(l+r) >> 1;
		if en<=mid then modify2(x*2,l,mid,st,en,w)
		else if st>mid then modify2(x*2+1,mid+1,r,st,en,w)
		else begin
			modify2(x*2,l,mid,st,mid,w);
			modify2(x*2+1,mid+1,r,mid+1,en,w);
		end;
		h[x].v:=(int64(h[x*2].v) * h[x*2+1].v) mod mo;
	end;
end;
procedure query(x,l,r,st,en:longint);
var	mid:longint;
begin
	if (st<=l) and (r<=en) then begin
		times(ret,h[x].v);
	end else begin
		change(x,l,r);
		mid:=(l+r) >> 1;
		if en<=mid then query(x*2,l,mid,st,en)
		else if st>mid then query(x*2+1,mid+1,r,st,en)
		else begin
			query(x*2,l,mid,st,mid);
			query(x*2+1,mid+1,r,mid+1,en);
		end;
		h[x].v:=(int64(h[x*2].v) * h[x*2+1].v) mod mo;
	end;
end;

procedure enter(x,i:longint);
var	y:longint;
begin
	y:=abs(x) mod hamo;
	while hash[y,1]<>0 do y:=(y+1) mod hamo;
	hash[y,1]:=i;
	hash[y,2]:=x
end;
function ha(x:longint):longint;
var	y:longint;
begin
	y:=abs(x) mod hamo;
	while hash[y,2]<>x do y:=(y+1) mod hamo;
	exit(hash[y,1]);
end;
begin
	readln(n);
	for i:=1 to n do begin
		read(q[i,1],q[i,2],q[i,3]);
		if q[i,1]<>2 then read(q[i,4]);
		inc(t); a[t]:=q[i,2];
		inc(t); a[t]:=q[i,3];
	end;
	qsort(a,1,t);
	kk:=a[1];
	for i:=2 to t do begin
		if kk<>a[i] then begin
			inc(sum);
			enter(kk,sum);
			len[sum]:=a[i]-kk;
			kk:=a[i];
		end;
	end;
	inc(sum); enter(a[t],sum); dec(sum);
	maketree(1,1,sum);

	for i:=1 to n do begin
		x:=ha(q[i,2]);
		y:=ha(q[i,3])-1;
		case q[i,1] of
			0:begin
				z:=q[i,4];
				modify1(1,1,sum,x,y,z);
			end;
			1:begin
				z:=q[i,4];
				modify2(1,1,sum,x,y,z);
			end;
			2:begin
				ret:=1;
				query(1,1,sum,x,y);
				writeln(ret);
			end;
		end;
	end; 
end.
```