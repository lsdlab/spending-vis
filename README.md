# spendingviz

[![dependencies Status](https://david-dm.org/lsdlab/spendingviz/status.svg?style=flat-square)](https://david-dm.org/lsdlab/spendingviz)
[![devDependencies Status](https://david-dm.org/lsdlab/spendingviz/dev-status.svg?style=flat-square)](https://david-dm.org/lsdlab/spendingviz?type=dev)
![Language](https://img.shields.io/badge/language-Node.js-brightgreen.svg?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)

## Deprecated

Visualize my daily spending data to tables some charts.

可视化我的日常支出数据，尝试产品化，搭建具有数据分析功能的后端平台，以及 iOS App。

## Packages:
- Tables: [DataTables Table plug-in for jQuery](https://www.datatables.net/)
- Visualization charts: [Chart.js](https://github.com/nnnick/Chart.js)
- Pie chart [ECharts](https://github.com/ecomfe/echarts)
- Typeahead [Bootstrap-3-Typeahead](https://github.com/bassjobsen/Bootstrap-3-Typeahead)

## Changelog

### 2016/7/26
用 datatables 的表格基本完成了。


### 2016/8/6
以年、月为单位的统计条形图和折线图基本完成了，处理数据的地方写死了在里面，虽然也不慢，但代码太丑，需要重写。要不就凑合用着，等第一版完成后用 Python 重写的时候再考虑数据该怎么存的问题。
下一步就是要加上消费分类占比的饼图，消费指数的雷达图和关键词词云了，刚看Chart.js 还提供一个散点图，可以把记录每天记录条数给做成散点图展示，还有就是消费类别也能做成散点图。
Webpack 还是没研究出来，抽空好好看看。


### 2016/8/14
分类饼图做了一点，但是 Charts.JS 不能直接在饼图每个部分上显示文字，搜了一些办法都不行，准备饼图用 ECharts 单独做，雷达图和散点图还是用 Charts.JS 做。


### 2016/9/25
概要页面完成


### 2016/11/12
新记录页面完成，暂时就现在网页上添加记录；关键词词云页面完成，把饼图全用 echarts 渲染，好看多了，也差不多了，现在可以自己用用，然后用 Python + Flask + Vue 重写，加上数据处理的功能，自然语言搜索统计出我要的结果，不用写死这些固定的统计项目，这个地方要多花点时间，然后再考虑做 iOS 应用。


### 2016/11/20
暂时先做这么多，接下来就先部署到 VPS 上凑合用用，然后换 Python 写，其实我已经有点感觉不想用 Node.JS 了，Promise 用着也不太方便，还是用 Python 靠点谱，MongoDB 也弃用了，太难用了。


![new](https://breakwire.me/images/spendingviz/new.png)
![this-month-brief](https://breakwire.me/images/spendingviz/this-month-brief.png)
![last-month-brief-0](https://breakwire.me/images/spendingviz/last-month-brief-0.png)
![last-month-brief-1](https://breakwire.me/images/spendingviz/last-month-brief-1.png)
![charts-year-0](https://breakwire.me/images/spendingviz/charts-year-0.png)
![charts-year-1](https://breakwire.me/images/spendingviz/charts-year-1.png)
![keyword-wordcloud](https://breakwire.me/images/spendingviz/keyword-wordcloud.png)


### 2016/11/23
先就这么凑合自己用用，接下来就准备用 Python 重写了，还需要看看统计的书，用上 NLP 让备注能够自动分类，要能用上些简单的机器学习就更好了，预测支出生成报告，这个估计就要花点时间了，要能把这两年点做出来就开始做 iOS 应用，大不了多花点时间，反正到现在为止我是没有找到最适合我用的记账应用，还是我自己给自己做一个吧。

### 2017/02/15
改了些 Bug，还是有个问题，不改了，后面的计划是用 Django 重写。

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


