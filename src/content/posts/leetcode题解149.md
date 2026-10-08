---
title: leetcode题解149：直线上最多的点数
date: 2023-11-26 12:09:19
tags:
    - 哈希表
    - 数学
categories: 算法
mathjax: true
---

## 描述

该题来自于[力扣第149题](https://leetcode.cn/problems/max-points-on-a-line/description/)

<!--more-->

## 分析

一种比较容易想到的方法`O(n^3)`时间复杂度，由于任意两2点成一条直线，所以可以基于两个点为基准，遍历剩下的点，看是否在这2个点构成的直线上。

比较难以想到的`O(n^2)`时间复杂度的方法，就是利用点斜式。以某个点`A`为基准，遍历所有其它的点，记录与点`A`的斜率，然后用一个map统计该斜率上的点的数量。简单说就是统计经过点`A`，并斜率为`k`的直线上的点的个数。

最重要的问题怎么表示斜率呢？数学上当然很简单，比如$0/3=0, 2/6=1/3, 2/0=\infty$，但是编程里面要保证表示精确。我们可以用一个元组记录斜率`(x,y)`，为了用哈希表（map）存储，要保证斜率唯一表示。首先约分肯定是必要的，然后正负号标准也要统一，确保以下几点：
1. 如果分子是0，那么斜率为无穷，统一用`(0,1)`表示
2. 如果分母是0，那么斜率为0，统一用`(1,0)`表示
3. 让分母保持为正数，如果分母为负数，分子分母同时乘上-1即可
4. 最简分式，分子分母约分，求最大公约数`gcd(x,y)`，然后约分即可

以上四点就可以保证斜率表示唯一了。

当用上述方法完成算法后，还是有几点细节可以优化的：
1. 当点`A`已经统计完后，表明过`A`的直线都已经统计完了，所以在统计点`B`的情况时，可以不考虑已 经统计过的点。用代码来说就是（`n`是总点数）
    ```c++
    for(int i = 0; i < n; i++) {  // 统计点i的情况
        for (int j = i+1; j < n; j++) // 只需遍历后面的点
    }
    ```
2. 当遍历到`index=i`的点时，表明前面`i`个点已经遍历完成，所有后面最多只有`n-i`个点在同一条直线上，所以如果当前统计的最多点`m`已经超过（包括等于）了`n-i`，那最终结果就已经是当前的值了，不用后续遍历了。
3. 如果当前统计的最多点`m`超过了总点数的一半`n/2`，那么另一条直线上的点必不可能超过`m`，可以反证法，如果超过了，那么这两条直线必然是同一条，否则由于不同的直线的交点最多只能有一个，从而会导致总点数大于`n`

## 代码
```python
from typing import List

class Solution:
    def maxPoints(self, points: List[List[int]]) -> int:
        n = len(points)
        if n <= 2:
            return n
        ret = 0
        for i in range(n):
            if ret >= n - i or ret > n / 2:
                break

            slopes = {}
            for j in range(i+1, n):
                delta_x = points[j][0] - points[i][0]
                delta_y = points[j][1] - points[i][1]
                if delta_y == 0:
                    delta_x = 1
                elif delta_x == 0:
                    delta_y = 1
                else:
                    if delta_y < 0:
                        delta_x = -delta_x
                        delta_y = -delta_y
                    d = self.gcd(abs(delta_x), abs(delta_y))
                    delta_x /= d
                    delta_y /= d
                slopes[(delta_x, delta_y)] = slopes.get((delta_x, delta_y), 0) + 1
            for v in slopes.values():
                ret = max(ret, v + 1)
        return ret

    def gcd(self, x, y):
	    return x if y == 0 else self.gcd(y, x % y)··
```
