# spendingviz
![Language](https://img.shields.io/badge/language-Node.js-brightgreen.svg) ![License](https://img.shields.io/badge/license-MIT-blue.svg)

Visualize my daily spending data to tables some charts.(WIP)

可视化我的日常支出数据，尝试产品化，搭建具有数据分析功能的后端平台，以及 iOS App。

## Packages:

- Tables: [DataTables Table plug-in for jQuery](https://www.datatables.net/)

- Visualization charts: [Chart.js](https://github.com/nnnick/Chart.js)

## Changelog：
### 2016/7/16
前后端先都用 Node.js 做，webpack   还要研究下到底怎么搞。

### 2016/7/26
用 datatables 的表格基本完成了。

![表格](https://breakwire.me/images/tables.png)

### 2016/8/6
以年、月为单位的统计条形图和折线图基本完成了，处理数据的地方写死了在里面，虽然也不慢，但代码太丑，需要重写。要不就凑合用着，等第一版完成后用 Python 重写的时候再考虑数据该怎么存的问题。

下一步就是要加上消费分类占比的饼图，消费指数的雷达图和关键词词云了，刚看Chart.js 还提供一个散点图，可以把记录每天记录条数给做成散点图展示，还有就是消费类别也能做成散点图。

Webpack 还是没研究出来，抽空好好看看。

![年](http://o81quvr4u.bkt.clouddn.com/charts-year.png)
![月](http://o81quvr4u.bkt.clouddn.com/charts-month.png)

### 2016/8/14
分类饼图做了一点，但是 Charts.JS 不能直接在饼图每个部分上显示文字，搜了一些办法都不行，准备饼图用 ECharts 单独做，雷达图和散点图还是用 Charts.JS 做。

![年分类](https://breakwire.me/images/charts-category-year.png)
![季度分类](https://breakwire.me/images/charts-category-quarter.png)

### 2016/9/25

概要页面完成
![概要](https://breakwire.me/images/brief1.png)
![概要](https://breakwire.me/images/brief3.png)


## LICENSE

The MIT License (MIT)
Copyright (c) 2016 Chen Jian

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
OR OTHER DEALINGS IN THE SOFTWARE.


