---
title: 无题noname
tags:
  - 题解
categories:
  - 信息学
  - 原创
---
Description
--
给定一个N，求出所有1到N之间的x，使得x^2=1(mod N)。
Input
--
一行一个正整数，没有多余字符，表示N。
Output
--
从小到大输出所有的x，一行一个。
Sample Input
--
```
7
```
Sample Output
--
```
1
6
```
Data Constraint
--
【数据范围】 　
    30%的数据N<=20000；
    100%的数据N<=2000000000。

Analysis
--
这道题有两种解题方法
***
第一种方法(扩展GCD)
$x^2\equiv1 (mod N)\longleftrightarrow x^2-1=N\*T\longleftrightarrow (x+1)(x-1) = a\*b\*x0\*(-y0)$
将N分解为a*b，$T\in N$ 将T分解为x0*(-y0),这样可以得到两个等式。
$$ \left\\{
\begin{aligned}
x+1 = a\*x0 \quad①\\\
x-1 = b\*(-y0) \quad②\\\
\end{aligned}
\right.
$$
$a\*x0+b\*y0=2 \qquad ③=①-②$
***
下面是扩展GCD的一些知识
③可以用扩展GCD解得一组特解x0,y0，然后能通过特解的出一般解。
一般解为
$$ \left\\{
\begin{aligned}
x0 + \frac {b}{p}\*k \quad①\\\
y0 - \frac {a}{p}\*k \quad②\\\
\end{aligned}
\right.
$$
***
扩展GCD$a\*x+b\*y=d$解得一组整数解x,y的充分必要条件是gcd（a,b）| d。
所以我们可以通过解出x，y，从而计算x的值
$2\*x = a\*x0-b\*y0\qquad ④=①+②$
$x = \frac {a\*x0-b\*y0}{2}$
将$x$化为一般解，即：
$x = \frac {a\*(x0 + \frac {b}{p}\*k)-b\*(y0- \frac {a}{p}\*k)}{2}$
因为 $1\leq x\leq N$
所以可以得到k的取值范围
![取值范围](http://img.blog.csdn.net/20160217224540556)
最后所求的x可化为：
$x = \frac {a\*x0-b\*y0}{2}+\frac {a\*b\*k}{p}$
详情代码1
***
第二种方法(中国剩余定理)
详情请参见References列表中的链接
详情代码2
Code
--
代码1
```
#include <cstdio>
#include <algorithm>
#include <cstring>
#include <cmath>
using namespace std;

typedef long long LL;
LL n,k,tmp,x3,y3,a,b,p;
int ans[1000];

LL gcd(LL a,LL b)
{
	if (!b)
	{
		x3 = 2/a;
		y3 = 0;
		return a;
	}
	LL ret = gcd(b,a%b),t = x3;
	x3 = y3;
	y3 = t-a/b*y3;
	return ret;
}
void work(LL a,LL b)
{
	p = gcd(a,b);
	if (2%p!=0) return;
	LL x = a*x3-b*y3;
	if (x%2==1) return;
	LL t = 2*a*b/p;
	double kmin = 1.0*(2-a*x3+b*y3)/t,
	       kmax = 1.0*(2*n-a*x3+b*y3)/t;
       	for (int k=ceil(kmin);k<=floor(kmax);k ++)
	{
		ans[++ ans[0]] = x/2+a*b*k/p;
	}
}

int main()
{
	//freopen("1460.in","r",stdin);
	//freopen("1460.out","w",stdout);

	scanf("%lld",&n);
	if (n==1) return 0;
	for (int i=1;i<=sqrt(n);i ++)
	{
		if (n%i==0)
		{
			a = i;b = n/i;
			work(a,b);work(b,a);
		}
	}
	sort(ans+1,ans+1+ans[0]);

	printf("%d\n",ans[1]);
	for (int i=2;i<=ans[0];i ++) 
		if (ans[i]!=ans[i-1]) printf("%d\n",ans[i]);
	return 0;
}
```
***
代码2
```
var n,m,t,t1,t2,tt,tt2,i,j:longint;
    mo:int64;
    b,d,g,mm:array[0..10001] of int64;
    c:array[0..10001,0..4] of int64;
    p:array[0..100001] of boolean;
function exgcd(x,y:longint;var tx,ty:longint):longint;
var t1:int64;
begin
	if y=0 then begin
		tx:=1;ty:=0;
		exit(x);
	end;
	exgcd:=exgcd(y,x mod y,tx,ty);
	t1:=tx;tx:=ty;ty:=t1-(x div y)*ty
end;
procedure qsort(x,y:longint);
var i,j,k:longint;
begin
	i:=x;j:=y;
	k:=g[(i+j) div 2];
	while i<=j do begin
		while g[i]<k do inc(i);
		while g[j]>k do dec(j);
		if i<=j then begin
			g[0]:=g[i];g[i]:=g[j];g[j]:=g[0];
			inc(i);dec(j);
		end;
	end;
	if i<y then qsort(i,y);
	if x<j then qsort(x,j);
end;
procedure sy;
var i:longint;
    ans:int64;
begin
	ans:=0;
	for i:=1 to tt do begin
		exgcd(mm[i],b[i],t1,t2);
		ans:=(ans+((d[i]*t1) mod mo*mm[i]) mod mo+mo*10) mod mo;
	end;
	inc(tt2);
	g[tt2]:=ans;
end;
procedure dfs(x:longint);
var i:longint;
begin
	if x=tt+1 then begin
		sy;
		exit;
	end;
	for i:=1 to c[x,0] do begin
		d[x]:=c[x,i];
		dfs(x+1);
	end;
end;
begin
	readln(n);
	mo:=n;
	t:=trunc(sqrt(n));
	tt:=0;
	m:=n;
	for i:=2 to t do
		if not p[i] then begin
			if m mod i=0 then begin
				inc(tt);
				t2:=i;
				b[tt]:=1;
				while m mod i=0 do begin
					m:=m div i;
					b[tt]:=b[tt]*t2;
				end;
			end;
			j:=i;
			while j<=t do begin
				p[j]:=true;
				j:=j+i;
			end;
		end;
	if m<>1 then begin
		inc(tt);
		b[tt]:=m;
	end;
	for i:=1 to tt do begin
		if b[i] mod 2=0 then begin
			if b[i]=2 then begin
				c[i,0]:=1;
				c[i,1]:=1;
			end else if b[i]=4 then begin
				c[i,0]:=2;
				c[i,1]:=1;
				c[i,2]:=3;
			end else begin
				c[i,0]:=4;
				c[i,1]:=1;
				c[i,2]:=b[i] div 2-1;
				c[i,3]:=b[i] div 2+1;
				c[i,4]:=b[i]-1;
			end;
		end else begin
			c[i,0]:=2;
			c[i,1]:=1;
			c[i,2]:=b[i]-1;
		end;
	end;
	for i:=1 to tt do mm[i]:=n div b[i];
	dfs(1);
	qsort(1,tt2);
	for i:=1 to tt2 do writeln(g[i]);
end.
```
References
--
代码2来源lzy
[算法导论-----数论-----计算x^2=1(mod n) 在区间[1,n-1]的解](http://www.cnblogs.com/inpeace7/archive/2012/03/17/2403283.html)
[中国剩余定理](http://baike.baidu.com/link?url=kS4zX4FdjG9v8oFdMowWSI24Dfck0mlqT_s7VmFZpXJGGuRAJnKq4i1VleGHHNiRFxeIVtGMgN_3AfBrVINAsUnxs4wAEJTRjWq9yEldfYFQjqUSsBd78Z23BAW5tfbB7qF48FPxQuezJkjl1cn3LTnvZoeR-hC58J6nIFL01jTxxWKPte8Pg_h4d_uVwa5y8T8eTTmk7T0YW-GyBHAcz_)
[扩展GCD](http://baike.baidu.com/link?url=wNmpz64aCdtSnjQ8D2oD-kXpCmR8ijMOz7lgdNzOflp6PQ-0wPChMUa2TKsruvqo-U0T0xu75nHaClZfHUZ2OK)