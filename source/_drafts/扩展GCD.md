---
title: 扩展GCD

tags:
  - GCD
  
categories:
  - 信息学
  - 原创
---
# 同余
  - 两个整数a，b，若它们除以正整数m所得的余数相等，则称a，b对于模m同余
  - 记作 a ≡ b(mod m)
- 若a，b对于模m同余，则a-b一定是m的倍数。

a ≡ b(mod m) $\longleftrightarrow$ a = b + k * m (k∈z) $\longleftrightarrow$ a - b = k * m (k∈z)

# 扩展GCD
## 目的
扩展GCD是用来求解满足以下条件的一组整数解x,y：
$ a\*x+b\*y = d$ 且 (d | gcd(a,b))
当前仅当满足(d | gcd(a,b))才有整数解x,y，且这样的整数解有无限多个。
求解x,y的过程与求解GCD(a,b)同步进行。
设g = GCD(a,b)