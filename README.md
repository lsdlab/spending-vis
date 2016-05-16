# spend-vis

Visualize my daily spend data to some charts.(WIP)

可视化我的日常支出数据。

## Packages:

- Visualization charts: [Chart.js](https://github.com/nnnick/Chart.js)

## Changelog：
### 2016/05/09

xlrd 读取，取出四列有用的信息，分类、日期、金额、备注，备注是中文，应该是 `unicode` 编码再 `encode("utf-8")`，竟然不行，`gb2312`、`gbk` 试了一圈编码格式，都不能转成中文，最后半手动的方式全转成了中文（别问我是怎么转的，反正挺搓的），半年不写 Python 连个编码都搞不定了，💊。

现在是单个 JSON 文件全是每个月的原始信息，直接 Node.js 读，统计一下，用  [Chart.js](https://github.com/nnnick/Chart.js) 画几个基础的图形，先把这个做出来，然后再做 App。我也想了做成一个 App 的几个卖点，自我感觉挺不错，希望明年年前能做出来……

### 2016/05/16

Express 脚手架搭好了，模板引擎换成 Swig，Jade 不好用，Handlebars 不自带继承，都是自定义的文件后缀。一切不用双花括号的模板引擎都不用，一切要用自定义文件后缀的模板引擎都不用。

直接读文件再统计好像还是不太好，还是存到数据库里好点，然后开始做 Web App，然后做 API。到这边先用 Node.js 做，要涉及到 Word Cloud、依据关键字自动分类进一步分析预测的化就要换成 Python 做了，反正基础的部分可以先用 Node.js 做，iOS App 也可以先做个简单的出来。要做更高级的数据分析，要先学学统计学，再把 Python 补一补（重学一遍……）

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


