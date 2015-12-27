---
title: 图形变换(transform)
date: 2015-08-21 10:39:00
tags:
  - 题解
  - 矩阵乘法
categories:
  - 信息学
  - 原创
---
Description
--
对一个由n个点组成的图形连续作平移、缩放、旋转变换。相关操作定义如下：

Trans(dx,dy) 表示平移图形，即把图形上所有的点的横纵坐标分别加上dx和dy；

Scale(sx,sy) 表示缩放图形，即把图形上所有点的横纵坐标分别乘以sx和sy；

Rotate(θ,x0,y0) 表示旋转图形，即把图形上所有点的坐标绕(x0,y0)顺时针旋转θ角度

由于某些操作会重复运行多次，还定义了循环指令：

Loop(m)

… 

End 

表示把Loop和对应End之间的操作循环执行m次，循环可以嵌套。

Input
--
第一行一个整数n(n<=100)表示图形由n个点组成；

接下来n行，每行空格隔开两个实数xi，yi表示点的坐标；

接下来一直到文件结束，每行一条操作指令。保证指令格式合法，无多余空格。
Output
--
输出有n行，每行两个空格隔开实数xi，yi表示对应输入的点变换后的坐标。

本题采用Special Judge判断，只要你输出的数值与标准答案误差不能超过1即可。

Sample Input
--

```
3
0.5 0
2.5 2
-4.5 1
Trans(1.5,-1)
Loop(2)
Trans(1,1)
Loop(2)
Rotate(90,0,0)
End
Scale(2,3)
End
```

Sample Output
--

```
10.0000 -3.0000
18.0000 15.0000
-10.0000 6.0000
```

Data Constraint
--
保证操作中坐标值不会超过double范围，输出不会超过int范围；

指令总共不超过1000行；

对于所有的数据,所有循环指令中m<=1000000；

对于60%的数据,所有循环指令中m<=1000；

对于30%的数据不含嵌套循环。
Analysis
--
看到这道题，首先想到的肯定是模拟。平移和缩放都是很简单的操作，比较麻烦的是旋转操作。据说有一个公式可以求任意点绕着原点逆时针旋转θrad的公式。
![绕原点旋转公式](http://img.blog.csdn.net/20150821112509577)
因为题目要求的是顺时针我们将角度取反再加上2πrad就好了。对于绕着任一点旋转，我们可以平移所有的点，使得给定的点与原点重合，套用公式计算，再把所有的平移回去。这样就可以通过暴力模拟拿到30%的分了。

因为循环的次数非常大，而给出的指令又比较少，所以我们应该想办法将循环之间的状态保存下来然后快速的做n次。因为我们注意到题目中的变换是对于两个变量的线性递推，所以可以用矩阵来实现。而每做一次相当于矩阵自乘一次。因为矩阵具有结合律，所以自乘的操作通过快速幂来实现就好了。

我们可以将每一种操作用矩阵表示出来，O(M)的扫一遍整个指令后将每个矩阵相乘，即可得到做完所有操作后的最终矩阵。然后，我们O(N)的将每一个点都与这个矩阵相乘就能得到这个点经过M次操作后的最终结果了。

接下来就是如何构造矩阵的问题了。平移，缩放的矩阵构造相对简单。基本上是通过系数于变量相乘和相加而得，具体可看程序实现。(可以自己手动模拟模拟矩阵乘法的工作过程)
比较难得就是旋转的矩阵构造。
我们不需要将一个旋转命令拆成几个命令，这样子太麻烦。可以一步构造矩阵实现平移与绕远点旋转。
我们假设图形中的一个点为(x,y)，绕(x0,y0)这个点顺时针旋转θrad(可以通过取反再加上一圈转换)，那么举例说明x'是如何得到的。
x' = (x-x0)cosθ-(y-y0)sinθ+x0=cosθx-sinθy+sinθy0-cosθx0+x0
y' = 同理可得
最后的矩阵就是这样的：
| --|1 | 2 | 3 |
| --|:-:| :|
| 1 | cosθ | sinθ | 0
| 2 | -sinθ | cosθ |0
| 3 | sinθ*y0-cosθ*x0+x0 | cosθ*y0-sin*x0+y0 |1
对于每一个点构造矩阵：
| --|1 | 2 | 3 |
| --|:-:| :|
| 1 | x | y | 0
| 2 | 0 | 0 |0
| 3 | 0 | 0 |0
最后就可以在O(M)的时间过啦~~~
Code
--

```
#include <cstdio>
#include <cstring>
#include <cmath>
#define pi M_PI
#define rad(x) x*pi/180
using namespace std;

const int N = 105 , M = 1005;
typedef double matrix[4][4];
struct node
{
	double x,y,angle;
	int type,time;
} a[M];
struct point
{
	double x,y;
} p[N];
int n,m,top,stack[M],end[M];
matrix H;
char ch;

void mul(matrix &a,matrix b)
{
	matrix c;
	memset(c,0,sizeof c);
	for (int k=1;k<=3;k++)
		for (int i=1;i<=3;i++)
			for (int j=1;j<=3;j++)
				c[i][j] += a[i][k]*b[k][j];
	memcpy(a,c,sizeof c);
}
void pow(matrix &a,int y)
{
	matrix c;
	memset(c,0,sizeof c);
	for (int i=1;i<=3;i ++) c[i][i]=1;
	while (y>0)
	{
		if (y & 1 == 1) mul(c,a);
		mul(a,a);
		y >>= 1;
	}
	memcpy(a,c,sizeof c);
}
void work(int st,int en)
{
	if (st>en) return;
	matrix F,G;
	memset(F,0,sizeof F);
	for (int i=1;i<=3;i++) F[i][i] = 1;
	for (int i=st;i<=en;i++)
	{
		memset(G,0,sizeof G);
		if (a[i].type==1)
		{
			G[1][1] = 1;
			G[2][2] = 1;
			G[3][1] = a[i].x;
			G[3][2] = a[i].y;
			G[3][3] = 1;
			mul(F,G);
		}
		if (a[i].type==2)
		{
			G[1][1] = a[i].x;
			G[2][2] = a[i].y;
			G[3][3] = 1;
			mul(F,G);
		}
		if (a[i].type==3)
		{
			a[i].angle = 360 - a[i].angle;
			double co=cos(rad(a[i].angle)),si=sin(rad(a[i].angle));
			G[1][1] = co;
			G[1][2] = si;
			G[2][1] = -si;
			G[2][2] = co;
			G[3][1] = si*a[i].y-co*a[i].x+a[i].x;
			G[3][2] = -co*a[i].y-si*a[i].x+a[i].y;
			G[3][3] = 1;
			mul(F,G);
		}
		if (a[i].type==4)
		{
			work(i+1,end[i]-1);
			pow(H,a[i].time);
			mul(F,H);
			i = end[i];
		}

	}
	memcpy(H,F,sizeof F);
}
int main()
{
	freopen("transform.in","r",stdin);
	freopen("transform.out","w",stdout);
	scanf("%d\n",&n);
	for (int i=1;i<=n;i++) scanf("%lf%lf\n",&p[i].x,&p[i].y);
	while (scanf("%c",&ch) != EOF)
	{
		m ++;
		if (ch=='T') a[m].type = 1,scanf("rans(%lf,%lf)\n",&a[m].x,&a[m].y);
		if (ch=='S') a[m].type = 2,scanf("cale(%lf,%lf)\n",&a[m].x,&a[m].y);
		if (ch=='R') a[m].type = 3,scanf("otate(%lf,%lf,%lf)\n",&a[m].angle,&a[m].x,&a[m].y);
		if (ch=='L') a[m].type = 4,scanf("oop(%d)\n",&a[m].time);
		if (ch=='E') a[m].type = 5,scanf("nd\n");
	}

	int top = 0;
	for (int i=1;i<=m;i++)
	{
		if (a[i].type == 4) stack[++ top] = i;
		if (a[i].type == 5) end[stack[top --]] = i;
	}
	work(1,m);
	for (int i=1;i<=n;i++)
	{
		matrix F;
		memset(F,0,sizeof F);
		F[1][1] = p[i].x , F[1][2] = p[i].y , F[1][3] = 1;
		mul(F,H);
		printf("%.4lf %.4lf\n",F[1][1],F[1][2]);
	}
	return 0;
}
```