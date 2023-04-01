---
title: LaTeX使用笔记
tags:
  - 教程
categories:
  - 互联网
  - 原创
mathjax: true
date: 2023-04-01 16:17:51
---
# 前言
终究是逃不掉的，开始了LaTeX的学习之旅。
这里记录一下学习过程中的一些笔记，以便日后查阅。

# 安装
## TexLive
听说Tex的发行版有很多，但是绝大多数人都是用的TexLive，那就跟个风，也用TexLive吧。
官方站点是：[https://tug.org/texlive/](https://tug.org/texlive/)
下载安装镜像：[http://mirror.ctan.org/systems/texlive/Images/texlive2023.iso](http://mirror.ctan.org/systems/texlive/Images/texlive2023.iso)
安装过程就不说了，一路next就好了。
安装时记得勾选安装前端TeXworks，这是一个很简介的编辑器，可以用来写与编译LaTeX文件。安装后可以用它来测试安装效果。
安装过程长达一个小时之久，占用空间大约8G。~~是真的占用空间，都快要追上Matlab了~~

## Overleaf
Overleaf是一个在线的LaTeX编辑器，可以直接在网页上编辑与编译LaTeX文件。
官方站点：[https://www.overleaf.com/](https://www.overleaf.com/)
注册后可以直接使用，也可以使用GitHub账号登录。
虽然不知道免费额度有多少，但是胜在方便快速，免去安装的麻烦。
记得在Menu中将编译器改为XeLaTeX，用以支持中文。
下载PDF后不知为何，用pdf.js渲染无法显示中文，但是用浏览器自带的PDF阅读器可以正常显示。

# 数学公式支持
为了使用 AMS-LaTeX 提供的数学功能，我们需要在导言区加载 amsmath 宏包：
```latex
\usepackage{amsmath}
```

## 行内模式 (inline) 
行文中使用`$ ... $`可以插入行内公式。

## 行间模式 (display)
行文中使用`\[ ... \]`可以插入行间公式。如果需要对行间公式进行编号，则可以使用 equation 环境：
```latex
\begin{equation}
...
\end{equation}
``` 
一个简单的示例代码，包含了上述两种模式：
```latex
\documentclass{article}
\usepackage{amsmath}
\begin{document}
Einstein 's $E=mc^2$.

\[ E=mc^2. \]

\begin{equation}
E=mc^2.
\end{equation}
\end{document}
```
一些使用到的特殊数学符号，就上网搜吧，太多不罗列了。

# 辅助工具
[https://mathpix.com/](https://mathpix.com/) 能够通过热键呼出截屏，而后将截屏中的公式转换成 LaTeX 数学公式的代码。
看网站介绍有chrome插件和客户端。好像还能转换pdf到latex，但是我没试过。

# 前端工具
刚刚安装了TexLive，自带的TeXworks编辑器较为简陋，用起来不太方便。所以选择了万能的VSCODE作为前端编辑器。
VSC应该默认就能提供对tex的语法高亮，我们还需要再扩展中安装一个`LaTeX Workshop`插件，这个插件提供了编译、预览、自动补全等功能。
我安装好之后貌似就能实现保存文件的时候自动编译了。
并且附带了一个VSC内置的PDF阅读器，可以直接在VSC中预览PDF。

# 模板
## hello world
纯英文hello world模板，可以用来测试LaTeX是否准备就绪。
```latex helloworld.tex
\documentclass{article}
% 这里是导言区
\begin{document}
Hello, world!
\end{document}
```
中文版hello world模板，可以用来测试中文支持。
```latex helloworld-chinese.tex
\documentclass[UTF8]{ctexart}
\begin{document}
你好，world!
\end{document}
```
一个完善的带有作者、标签、日期等信息的模板。
```latex helloworld-complete.tex
\documentclass[UTF8]{ctexart}
\title{你好，world!}
\author{Liam}
\date{\today}
\begin{document}
\maketitle
你好，world!
\end{document}
```
## 作业模板
作业模板，可以用来写作业，有固定的题目描述和解答部分。
包含三大部分，题目、解答、注记。
```latex homework.tex
\documentclass[12pt, a4paper, oneside]{ctexart}
\usepackage{amsmath, amsthm, amssymb, bm, graphicx, hyperref, mathrsfs}

\title{\textbf{课程作业}}
\author{Dylaaan}
\date{\today}
\linespread{1.5}
\newcounter{problemname}
\newenvironment{problem}{\stepcounter{problemname}\par\noindent\textbf{题目\arabic{problemname}. }}{\\\par}
\newenvironment{solution}{\par\noindent\textbf{解答. }}{\\\par}
\newenvironment{note}{\par\noindent\textbf{题目\arabic{problemname}的注记. }}{\\\par}

\begin{document}

\maketitle

\begin{problem}
    这里是题目. 
\end{problem}

\begin{solution}
    这里是解答. 
\end{solution}

\begin{note}
    这里是注记. 
\end{note}

\end{document}
```

## 实验报告模板（含目录）
包含基本的标题、作者、日期、目录等信息。有一级、二级、三级标题。
需要**编译两次**，才能看到最终含目录信息的效果。
两个换行（一个空行）才能实现真正的换行，LaTeX将一个换行当做是一个简单的空格来处理。
```latex
\documentclass[UTF8]{ctexart}
\title{你好，world!}
\author{Liam}
\date{\today}
\begin{document}
\maketitle
\tableofcontents
\section{你好中国}
中国在East Asia.
\subsection{Hello Beijing}
北京是capital of China.
\subsubsection{Hello Dongcheng District}
\paragraph{Tian'anmen Square}
is in the center of Beijing
\subparagraph{Chairman Mao}
is in the center of 天安门广场。
\subsection{Hello 山东}
\paragraph{山东大学} is one of the best university in 山东。
\end{document}
```