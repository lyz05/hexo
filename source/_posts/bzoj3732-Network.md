---
title: bzoj3732 Network
date: 2015-08-11 21:13
tags:
  - 题解
  - LCA
  - RMQ
categories:
  - 信息学
  - 原创
mathjax: true
---
Description
==
题目来源
[bzoj3732](http://www.lydsy.com/JudgeOnline/problem.php?id=3732)


Analysis
==
这题给的输入是一个无向连通图，说明图中会有环和一些树枝。对于一个询问在环上的两个点，有两条可以联通的道路。
一条中的边权最大值是整个环的最大值（舍弃），
另一条的边权最大值是整个环的次大值（需要）。
所以只有次大值才是我们想要的！因此，我们想到了最小生成树，将这些环中的最大边权值所属的边删掉。
最小生成树的求法就是，先让边权从小到大排序，然后依次添加并用并查集维护即可。（Kruskal算法）

所以，现在问题就转化成在一棵树中，求任意两点A，B路径上边权的最大值。

此时我们就需要求LCA了，并维护两点到LCA边权的最大值，在做LCA的时候使用倍增算法，再配上RMQ问题中的st算法即可解决问题。

code
==

```cpp
#include <cstdio>
#include <algorithm>
using namespace std;
const int N=30000+100,M=30000+100;

struct node{int x,y,d;}c[N];
struct node1{int y,v,next;}h[2*M];
int n,m,k,u,v,tot,e[N],fw[N][16],fv[N][16],fa[N],dep[N];

bool cmp(node a, node b) {return a.d<b.d;}

int gf(int x)
{
	if (fa[x] == x) return x;
	return fa[x] = gf(fa[x]);
}

void add(int x,int y,int z)
{
	tot ++;
	h[tot].y = y;
	h[tot].v = z;
	h[tot].next=e[x];
	e[x] = tot;
}

void dfs(int x ,int fat)
{
	for (int i = e[x];i;i = h[i].next)
		if (h[i].y!=fat)
		{
			dep[h[i].y] = dep[x]+1;
			dfs(h[i].y,x);
			fv[h[i].y][0] = h[i].v;
			fw[h[i].y][0] = x;
		}
}

int move(int &x,int d)
{
	int i,t=0;
	while (dep[fw[x][0]]!=d)
	{
		for (i = 0;dep[fw[x][i]]>d;i++);
		t = max(t,fv[x][i-1]);
		x = fw[x][i-1];
	}
	t = max(t,fv[x][0]);
	x = fw[x][0];
	return t;
}

int lca(int u,int v)
{
	int i,t = 0;
	if (dep[u]>dep[v]) t = move(u,dep[v]);
	else if (dep[u]<dep[v]) t = move(v,dep[u]);
	while (fw[u][0]!=fw[v][0])
	{
		for (i = 0;fw[u][i] != fw[v][i];i ++);
		t = max(t,max(fv[u][i-1],fv[v][i-1]));
		u = fw[u][i-1];
		v = fw[v][i-1];
	}
	if (u!=v)
	t = max(max(fv[u][0],fv[v][0]),t);
	return t;
}

int main()
{
	//freopen("1738.in","r",stdin);

	scanf("%d%d%d",&n,&m,&k);
	for (int i=1;i <= m ; i ++)
	scanf("%d%d%d",&c[i].x,&c[i].y,&c[i].d);
	sort(c+1,c+1+m,cmp);
	for (int i=1 ; i <= n ; i ++) fa[i]=i;
	for (int i=1 ; i <= m ; i ++)
	{
		if (gf(c[i].x)!=gf(c[i].y))
		{
			add(c[i].x,c[i].y,c[i].d);
			add(c[i].y,c[i].x,c[i].d);
			fa[fa[c[i].x]] = fa[fa[c[i].y]];
		}
	}
	dep[1] = 1;
	dfs(1,0);
	for (int j=1 ; j <= 14; j ++)
	for (int i=1 ;i<=n;i ++)
	if (fw[fw[i][j-1]][j-1] != 0)//limit excepeted
	{
		fw[i][j] = fw[fw[i][j-1]][j-1];
		fv[i][j] = max(fv[i][j-1],fv[fw[i][j-1]][j-1]);
	}
	for (int i = 1 ; i <= k ; i ++)
	{
		int u,v;
		scanf("%d%d",&u,&v);
		printf("%d\n",lca(u,v));
	}	

	return 0;
}
```

Tips
==
[Kruskal算法](http://baike.baidu.com/link?url=0x-xezmCp5Fud_PyEPvp6gBHGzdU2tnG-6zEg42g5f6jL7QCCOygSbY8CwqnDalzqb9Ol-36JJJVrw2UBaN5x_#4_1)
[LCA 倍增算法](http://www.tuicool.com/articles/N7jQV32)
[RMQ st算法](http://www.cnblogs.com/Missa/archive/2012/10/01/2709686.html)

