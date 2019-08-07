---
title: Road
tags:
  - 题解
categories:
  - 信息学
  - 原创
date: 2015-12-20 18:07:30
mathjax: true
---

**Description**
--
给你一棵有N个结点的数。这N个结点都有一个权值为$C[i]$。
询问你两个结点u、v，在这两个结点的最短路径上，选取两个点i、j，且i靠近结点u，j靠近结点v。让你计算$Max(c[j]-c[i],0)$

**Input**
--
输入第一行有一个整数N(1≤n≤50000)
接下来有N 行，每行一个整数Ci(1≤Ci≤50000)
再接下来有N-1 行，每行两个整数x,y(1≤x,y≤50000)，表示x 和y 之间有一条边。
接下来有一个整数M，表示有M 个询问。
然后M 行，每行两个整数，x,y(1≤x,y≤50000)询问$Max(c[j]-c[i],0)$
**Output**
--
对于每次询问,输出对应最大值结果

**Sample Input**
--

```
4 
1 
2 
3
4
1 2
1 4
2 3
3
1 3
3 1
1 4
```

**Sample Output**
--

```
2
0
3
```

**Data Constraint**
--
对于30%的数据, 1≤N,M≤100
对于60%的数据，1≤N,M≤1000
对于100%的数据，1≤N,M≤50000

**Analysis**
--
因为是一棵树，所以任意两点的最短路径是唯一的。
**1°30%　＆＆　60％的数据**

 - 对于每一个询问我们可以O(N)的扫一遍整副图，直到找到终点v。并记录下此时经过路径的结点。然后在O(3*N)的扫一遍得到从结点u到结点i的最小值$(\sum\_{i=u}^v A[i] = Min(C[i]))$，以及从结点i到结点v的最大值$(\sum\_{i=v}^u B[i] = Max(C[i]))$，最后只需要每一个结点对应扫一遍就行了计算最大值即可。$(\sum\_{i=u}^v Ans = Max(B[i]-A[i]))$。这样做的时间复杂度就是$O（MN）$。

 - 还有一种是这种算法的改进。
就是充分利用树的特点，先dfs预处理一遍所有结点到根节点的深度，在一步步向上跳。直到调到他们的LCA。后续的答案计算和前面一样。时间复杂度虽然也是$O（MN）$，可是当数据是随机生成的时候很有可能会优化到$O(2*M*log(N))$。

详情请见代码1......

****
**2°100％的数据**
这种涉及到路径的问题肯定会与LCA有关，LCA最快的在线做法就是倍增。
但是倍增在计算是需要合并两个块，所以我们可以考虑一下，怎样合并两个块。
对于一个块就是一个有顺序的结点集合，它需要存放四个值，即：
1. 块中所有结点的最小值 (buy)
2. 块中所有结点的最大值 (sell)
3. 先最小值后最大值的差的绝对值的最大值(Max(bs))
4. 先最大值后最小值的差的绝对值的最大值(Min(sb))
****
我们发现当维护了这四个值后我们就可以进行块合并操作了。
假设要合并的块分别为A和B，合并后的块为C。
1. $C.buy = Min(A.buy,B.buy)$
2. $C.sell = Max(A.sell,B.sell)$
3. $C.bs = Max(A.bs,B.bs,B.sell-A.buy)$
4. $C.sb = Max(A.sb,B.sb,A.sell-B.buy)$

然后倍增的到LCA后我们只需要知道$\sum\_{i=u}^{LCA}$的块与$\sum\_{i=v}^{LCA}$的块合并后即可知道答案。
同理我们也可以用tarjan离线LCA的方法来解决这个问题，这样时间复杂度就是$O（N）$。
详情请见代码2......
****
**下面说一下具体的程序实现的小问题**
对于离线的tarjan算法，因为用到了并查集，所以我们可以对每一个节点，维护它向上的块，维护的大小取决于当前并查集的大小，这样就能完成从$\sum\_{i=u}^{LCA}$的块维护，对于另一边我们可以在(u,v)的LCA上打一个标记，当tarjan遍历回到了LCA后。在进行合并。
可以对照这篇博客中的图看一看：http://blog.csdn.net/hnust_xiehonghao/article/details/9109295
****
**Code**
--
代码1：

```
uses	math;
const	maxn=50002;
type	node=record
		y,next:longint;
	end;
var	i,j,k,m,n,tot,x,y,ans:longint;
	v,e,dep,fa:array[1..maxn] of longint;
	h:array[1..2*maxn] of node;
	a,a1,a2,b,c:array[0..maxn] of longint;
	flag:array[1..maxn] of boolean;
procedure add(x,y:longint);
begin
	inc(tot);
	h[tot].y:=y;
	h[tot].next:=e[x];
	e[x]:=tot;
end;
procedure dfs(x:longint);
var	i:longint;
begin
	if flag[x] then exit;
	flag[x]:=true;
	i:=e[x];
	while i<>0 do begin
		if flag[h[i].y] then begin
			i:=h[i].next;
			continue;
		end;
		dep[h[i].y]:=dep[x]+1;
		fa[h[i].y]:=x;
		dfs(h[i].y);
		i:=h[i].next;
	end;
end;
procedure up(var x:longint;y:longint);
begin
	if odd(y) then begin
		inc(a1[0]);
		a1[a1[0]]:=x;
	end else begin
		inc(a2[0]);
		a2[a2[0]]:=x;
	end;
	x:=fa[x];
end;
procedure link;
var	i:longint;
begin
	for i:=1 to a1[0] do a[i]:=a1[i];
	a[0]:=a1[0];
	for i:=a2[0] downto 1 do begin
		inc(a[0]);
		a[a[0]]:=a2[i];
	end;
end;
procedure work(x,y:longint);
var	i:longint;
begin
	a1[0]:=0;a2[0]:=0;ans:=0;
	while dep[x]>dep[y] do up(x,1);
	while dep[x]<dep[y] do up(y,2);
	while x<>y do begin
		up(x,1);up(y,2);
	end;
	inc(a1[0]);
	a1[a1[0]]:=x;
	link;
	b[0]:=1000000007;c[a[0]+1]:=0;
	for i:=1 to a[0] do b[i]:=min(b[i-1],v[a[i]]);
	for i:=a[0] downto 1 do c[i]:=max(c[i+1],v[a[i]]);
	for i:=1 to a[0] do ans:=max(ans,c[i]-b[i]);
	{
	for i:=1 to a[0] do begin
		for j:=i+1 to a[0] do begin
			ans:=max(ans,v[a[j]]-v[a[i]]);
		end;
	end;
	}
end;
begin
	//assign(input,'1230.in');reset(input);
	//assign(output,'1230.out');rewrite(output);

	readln(n);
	for i:=1 to n do read(v[i]);
	for i:=1 to n-1 do begin
		readln(x,y);
		add(x,y);
		add(y,x);
	end;
	dep[1]:=1;fa[1]:=0;
	dfs(1);
	readln(m);
	for i:=1 to m do begin
		readln(x,y);
		work(x,y);
		writeln(ans);
	end;
end.
```

****
代码2：

```
#include <cstdio>
#include <algorithm>
#include <cstring>
#include <cmath>
using namespace std;

const int N = 50000+5,M = N*3;

struct node
{
	int fa,buy,sell,bs,sb;
	node (int A=0,int B=0,int C=0,int D=0,int E=0)
	{
		fa = A,buy = B,sell = C,bs = D,sb = E;
	}
} f[N];

struct Edge
{
	int y,next;
} h[3][M];

int e[3][N],tot[3],b[N][2],ans[N],a[N];
int n,m;
bool vis[N];

void add(int x,int y,int kind)
{
	h[kind][++ tot[kind]].y = y;
	h[kind][tot[kind]].next = e[kind][x];
	e[kind][x] = tot[kind];
}

node gf(int x)
{
	node t;
	if (f[x].fa != x)
	{
		t = gf(f[x].fa);
		f[x] = node(t.fa,min(f[x].buy,t.buy),max(f[x].sell,t.sell),max(t.sell-f[x].buy,max(f[x].bs,t.bs)),max(f[x].sell-t.buy,max(f[x].sb,t.sb)));
	}
	return f[x];
}

void tarjan(int x,int fa)
{
	vis[x] = 1;
	for (int i=e[0][x];i;i=h[0][i].next)
	{
		int y = h[0][i].y;
		if (y==fa) continue; 
		tarjan(y,x);
		f[y].fa = x;
	}
	for (int i=e[1][x];i;i=h[1][i].next)
	{
		int j = h[1][i].y,y = b[j][b[j][0] == x];//Υµ½Αν»µγ
		if (!vis[y]) continue;
		if (gf(y).fa != x) 
			add(f[y].fa,j,2);
	}
	for (int i=e[2][x];i;i = h[2][i].next)
	{
		int j=h[2][i].y,x=b[j][0],y=b[j][1];
		gf(x),gf(y);
		ans[j] = max(ans[j],f[x].bs);
		ans[j] = max(ans[j],f[y].sb);
		ans[j] = max(ans[j],f[y].sell-f[x].buy);
	}
}


int main()
{
	//freopen("1230.in","r",stdin);
	//freopen("1230.out","w",stdout);

	scanf("%d",&n);
	for (int i=1;i<=n;i ++)
	{
		scanf("%d",&a[i]);
		f[i] = node(i,a[i],a[i],0,0);
	}
	for (int i=1;i<n;i ++)
	{
		int x,y;
		scanf("%d%d",&x,&y);
		add(x,y,0),add(y,x,0);
	}
	scanf("%d",&m);
	for (int i=1;i<=m;i ++)
	{
		scanf("%d%d",&b[i][0],&b[i][1]);
		add(b[i][0],i,1);add(b[i][1],i,1);
	}
	tarjan(1,0);
	for (int i=1;i<=m;i ++) printf("%d\n",ans[i]);
	return 0;
}
```