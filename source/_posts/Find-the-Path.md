---
title: Find the Path
date: 2015-08-17 09:41:00
tags:
  - 题解
  - floyd算法
categories:
  - 信息学
  - 原创
mathjax: true
---
Description
--
Scofield刚从监狱里面跑出来，现在他要在进行大逃亡.

你也知道, 逃亡是非常不容易的, 现在Scofield遇到了一些困难, 你可以帮助他吗?

Scofield面前的是一个美国的交通图, 图里面有一些城市, 有些城市之间有路连接. 路的长度scofield是知道的, 但是有些城市里面的警察很多, 所以scofield对这个问题很头疼. 他现在要安排一些逃亡路线, 所以他要对你做一些询问, 询问是这样的:某两个城市之间的最短路是什么? 但是这个最短路有个前提, 那就是路径上的每个城市里的警察不得超过k个. 起点和终点除外.

Input
--
有多组测试数据, 数据第一行是一个整数T表示测试数据的个数。每组测试数据以二个整数N，M 开始。N是城市个数，M是道路数。
下面一行有n个数, 表示每个城市里面的警察的个数Ci.
再下面m行, 每行有三个数, u, v, w.
再下面有一个整数Q
下面有Q行, 每行三个整数u, v, k表示,查询的内容为从u到v的警察数不超过k的最短路.(u, v上的警察不用计算在内).

Technical Specification
1. T <= 20
2. 2 <= N <= 200, 0 <= M <= n * (n – 1) / 2
3. 0 <= Ci <= 1000,000,000
4. 0 <= u, v < N, 0 <= w <= 1000, 0 <= k <= 1000,000,000
5. 0<= Q <= 100000
6. 没有多重边和自环边
7. 对于每一个询问，u！= v。
8. 输入数据后面有一个空行。

Output
--
对于每一个询问，输出一行，表示最短路是什么，如果不存在的话就输出-1.
每一个测试数据后面加一个空行。

Sample Input
--
```
1
4 4
100 2 3 100
0 1 1
0 2 1
1 3 2
2 3 3
2
0 3 2
0 3 1
```
Sample Output 
--
```
3
-1
```
Analysis
--
这题是要我们求最短路，但是最短路有一定的要求，就是最短路上的警察要不超过k个。再看看数据范围，N非常的小，组数也不多。再求最短路的诸多算法中，floyd算法虽然慢，但是他在处理一些特殊问题(带条件)时却能发挥它的重要作用。
我们都知道floyd算法，是通过枚举中间点，进而求出最短路。在枚举中间点的时候，未枚举到的中间点，并不在所求的最短路内。所以根据这个特性，我们就可以再求最短路的同时，进而保证警察数k在一个范围内，然后在回答每一个问题。
实现起来可能略微复杂，首先我们将原先图上的点进行重编号。按照点的警察数从小到大排序，顺次编号。现在对于图上编号为i的点，在[1..i-1]中的点他们的警察数k都比i点的警察数k小。在对新图做一次floyd最短路。对于后面的每个询问，将询问的<u,v>转化为新图的<u,v>。再从满足警察数<=k个中选出一个最小的答案，作为此次询问的答案。整道题的算法复杂度为O((N^3+QN)*T)。其实复杂度还是蛮高的。

Code
--
```
#include <cstdio>
#include <algorithm>
#include <cstring>

using namespace std;
typedef long long LL;
const long long INF = 1042521604759584125;
const int N = 200+10;
LL map[N][N][N];
int pos[N];

struct node
{
	int num,id;
	bool operator < (node a) const
	{
		return num < a.num;
	}
}cos[N];

int main()
{
	//freopen("1061.in","r",stdin);
	
	int T;
	scanf("%d",&T);
	while (T --)
	{
		int n,m;
		scanf("%d%d",&n,&m);
		for (int i = 0 ; i < n ; i ++)
		{
			scanf("%d",&cos[i].num);
			cos[i].id = i;
		}
		sort(cos,cos + n);
		for (int i = 0 ; i < n ; i ++)\
		{
			pos[cos[i].id] = i+1;
		}
		for(int i=1;i<=n;i++)
			for(int j=1;j<=n;j++)
				map[i][j][0]=INF;
		for (int i = 1 ; i <= m ; i ++)
		{
			int x,y,z;
			scanf("%d %d %d",&x,&y,&z);
			map[pos[x]][pos[y]][0] = z;
			map[pos[y]][pos[x]][0] = z;
		}
		for (int k = 1;k <= n; k ++)
		{
			for (int i = 1 ; i <= n ; i ++)
			for (int j = 1 ; j <= n ; j ++)
				map[i][j][k] = map[i][j][k - 1];
			for (int i = 1 ; i <= n ; i ++)
			for (int j = 1 ; j <= n ; j ++)
				map[i][j][k] = min(map[i][j][k],map[i][k][k-1]+map[k][j][k-1]);
			
		}
		int Q;
		scanf("%d",&Q);
		while (Q --)
		{
			int x,y,z;
			scanf("%d%d%d",&x,&y,&z);
			LL ans = map[pos[x]][pos[y]][0];
			for (int i = n-1 ; i >= 0; i --)
			{
				if (cos[i].num <= z) {
					ans = map[pos[x]][pos[y]][i+1];
					break;
				}
			}
			if (ans == INF) puts("-1"); else printf("%lld\n",ans);
		}
		printf("\n");
	}
			
	return 0;
}
```