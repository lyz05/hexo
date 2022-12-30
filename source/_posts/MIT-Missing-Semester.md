---
title: MIT-Missing-Semester
tags:
  - 教程
categories:
  - 互联网
  - 原创
mathjax: true
date: 2022-12-27 15:37:08
---
# 计算机教育中缺失的一课
我将针对这门课中的课后作业，和薄弱的部分做个记录，以便日后复习。
# 课程概览与 shell
这一部分没啥难得。
## 课后作业
1. 本课程需要使用类Unix shell，例如 Bash 或 ZSH。如果您在 Linux 或者 MacOS 上面完成本课程的练习，则不需要做任何特殊的操作。如果您使用的是 Windows，则您不应该使用 cmd 或是 Powershell；您可以使用Windows Subsystem for Linux或者是 Linux 虚拟机。使用echo $SHELL命令可以查看您的 shell 是否满足要求。如果打印结果为/bin/bash或/usr/bin/zsh则是可以的。
``` bash
$ echo $SHELL
/bin/bash
```
2. 在 /tmp 下新建一个名为 missing 的文件夹。
``` bash
$ mkdir /tmp/missing
$ cd /tmp/missing
```
3. 用 man 查看程序 touch 的使用手册。
``` bash
$ man touch
```
4. 用 touch 在 missing 文件夹中新建一个叫 semester 的文件。
``` bash
$ touch semester
```
5.  将以下内容一行一行地写入 semester 文件：
``` bash
$ echo '#!/bin/sh' >> semester
$ echo "curl --head --silent https://missing.csail.mit.edu" >> semester
$ cat semester
#!/bin/sh
curl --head --silent https://missing.csail.mit.edu
```
6.  尝试执行这个文件。例如，将该脚本的路径（./semester）输入到您的shell中并回车。如果程序无法执行，请使用 ls 命令来获取信息并理解其不能执行的原因。
``` bash
$ ./semester
-bash: ./semester: Permission denied
$ ls -l semester
-rw-r--r-- 1 root root 58 Dec 27 15:37 semester
```
7. 查看 chmod 的手册(例如，使用 man chmod 命令)
``` bash
$ man chmod
```
8. 使用 chmod 命令改变权限，使 ./semester 能够成功执行，不要使用 sh semester 来执行该程序。您的 shell 是如何知晓这个文件需要使用 sh 来解析呢？更多信息请参考：shebang
``` bash
$ chmod u+x semester
$ ./semester
HTTP/2 200 
server: GitHub.com
content-type: text/html; charset=utf-8
last-modified: Mon, 05 Dec 2022 15:59:23 GMT
access-control-allow-origin: *
etag: "638e155b-1f37"
expires: Tue, 27 Dec 2022 08:01:51 GMT
cache-control: max-age=600
x-proxy-cache: MISS
x-github-request-id: 2438:49BD:428E8A:4BB4EE:63AAA417
accept-ranges: bytes
date: Tue, 27 Dec 2022 07:51:51 GMT
via: 1.1 varnish
age: 0
x-served-by: cache-qpg1229-QPG
x-cache: MISS
x-cache-hits: 0
x-timer: S1672127512.608152,VS0,VE232
vary: Accept-Encoding
x-fastly-request-id: 70cc3b726240ab87a0f03dd3c8383ddf7f72b9c5
content-length: 7991
```
9. 使用 | 和 > ，将 semester 文件输出的最后更改日期信息，写入主目录下的 last-modified.txt 的文件中
``` bash
$ ./semester | grep last-modified | cut -d ' ' -f 2- > ~/last-modified.txt
$ cat ~/last-modified.txt
Mon, 05 Dec 2022 15:59:23 GMT
```
10. 写一段命令来从 /sys 中获取笔记本的电量信息，或者台式机 CPU 的温度。注意：macOS 并没有 sysfs，所以 Mac 用户可以跳过这一题。

没有温度相关信息，跳过。

# Shell 工具和脚本
## source命令
source命令是一个内置的shell命令，用于从当前shell会话中的文件读取和执行命令。source命令通常用于保留、更改当前shell中的环境变量。简而言之，source一个脚本，将会在当前shell中运行execute命令。source命令的语法如下：
source命令可用于：
 - 刷新当前的shell环境
 - 在当前环境使用source执行Shell脚本
 - 从脚本中导入环境中一个Shell函数
 - 从另一个Shell脚本中读取变量
``` bash
source filename
```
或者
``` bash
. filename
```
## 特殊变量
 - !! - 完整的上一条命令，包括参数。常见应用：当你因为权限不足执行命令失败时，可以使用 sudo !!再尝试一次。
 - $$ - 当前脚本的进程识别码
 - $_ - 上一条命令的最后一个参数。如果你正在使用的是交互式 shell，你可以通过按下 Esc 之后键入 . 来获取这个值。

## 传递文件而非stdin
`<( CMD )` 会执行 CMD 并将结果输出到一个临时文件中，并将 <( CMD ) 替换成临时文件名。这在我们希望返回值通过文件而不是STDIN传递时很有用。例如， `diff <(ls foo) <(ls bar)` 会显示文件夹 foo 和 bar 中文件的区别。
`<( CMD )` 会执行 CMD 并将结果输出到一个临时文件中，并将 `<( CMD )` 替换成临时文件名。

## shell的通配
 - 花括号{} - 当你有一系列的指令，其中包含一段公共子串时，可以用花括号来自动展开这些命令。这在批量移动或转换文件时非常方便。

下面是一些例子：
``` bash
convert image.{png,jpg}
# 会展开为
convert image.png image.jpg

# 也可以结合通配使用
mv *{.py,.sh} folder
# 会移动所有 *.py 和 *.sh 文件
```
## shebang行
shebang行是一个特殊的行，它告诉操作系统这个脚本应该使用哪个解释器来执行。
在 shebang 行中使用 env 命令是一种好的实践，它会利用环境变量中的程序来解析该脚本，这样就提高来您的脚本的可移植性。env 会利用我们第一节讲座中介绍过的PATH 环境变量来进行定位。 例如，使用了env的shebang看上去时这样的`#!/usr/bin/env python`。

## 查找shell命令
除了传统的`history`命令，还有一些更好的方法来查找shell命令。
对于大多数的shell来说，您可以使用 Ctrl+R 对命令历史记录进行回溯搜索。敲 Ctrl+R 后您可以输入子串来进行匹配，查找历史命令行。

## 课后作业
1. 阅读 man ls ，然后使用ls 命令进行如下操作：
 - 所有文件（包括隐藏文件）
 - 文件打印以人类可以理解的格式输出 (例如，使用454M 而不是 454279954)
 - 文件以最近访问顺序排序
 - 以彩色文本显示输出结果
``` bash
$ ls -a
$ ls -lh
$ ls -t
$ ls --color
```

2. 编写两个bash函数 marco 和 polo 执行下面的操作。 每当你执行 marco 时，当前的工作目录应当以某种形式保存，当执行 polo 时，无论现在处在什么目录下，都应当 cd 回到当时执行 marco 的目录。 为了方便debug，你可以把代码写在单独的文件`marco.sh`中，并通过`source marco.sh`命令，（重新）加载函数。
``` bash marco.sh
marco() {
    pwd > /tmp/marco
}
polo() {
    cd $(cat /tmp/marco)
}
```

3.假设您有一个命令，它很少出错。因此为了在出错时能够对其进行调试，需要花费大量的时间重现错误并捕获输出。 编写一段bash脚本，运行如下的脚本直到它出错，将它的标准输出和标准错误流记录到文件，并在最后输出所有内容。 加分项：报告脚本在失败前共运行了多少次。
``` bash shell.sh
 #!/usr/bin/env bash

 n=$(( RANDOM % 100 ))

 if [[ n -eq 42 ]]; then
    echo "Something went wrong"
    >&2 echo "The error was using magic numbers"
    exit 1
 fi

 echo "Everything went according to plan"
```
``` bash mycode.sh
count=0

while true; do
    ./shell.sh &>>out.log
    if [ $? -ne 0 ]; then
        cat out.log
        echo "Failed after $count runs"
        break
    fi
    count=$((count+1))
done
```

4. 本节课我们讲解的 find 命令中的 -exec 参数非常强大，它可以对我们查找的文件进行操作。但是，如果我们要对所有文件进行操作呢？例如创建一个zip压缩文件？我们已经知道，命令行可以从参数或标准输入接受输入。在用管道连接命令时，我们将标准输出和标准输入连接起来，但是有些命令，例如tar 则需要从参数接受输入。这里我们可以使用xargs 命令，它可以使用标准输入中的内容作为参数。 例如 ls | xargs rm 会删除当前目录中的所有文件。

您的任务是编写一个命令，它可以递归地查找文件夹中所有的HTML文件，并将它们压缩成zip文件。注意，即使文件名中包含空格，您的命令也应该能够正确执行
创建所需文件
```bash
mkdir html_root
cd html_root
touch {1..10}.html
mkdir html
cd html
touch xxx.html
```
```bash
find . -type f -name "*.html" | xargs -d '\n'  tar -cvzf html.tar.gz
```

5. （进阶）编写一个命令或脚本递归的查找文件夹中最近使用的文件。更通用的做法，你可以按照最近的使用时间列出文件吗？
``` bash
find . -type f | xargs -d '\n' ls -lt | head -5
```

# 编辑器 (Vim)
跳过此章节

# 数据整理
跳过此章节

# 命令行环境
讲解了下fg、bg将当前进程置与前台与后台，nohup等工具忽略SIGHUP信号。
& 后缀可以让命令在直接在后台运行。
## 终端多路复用
因为我不是一个生活在纯终端下的人，所以tmux对于我来说用处不大，我更倾向于使用screen，来使用与切换多个终端。
## 别名
与后文的配置文件（Dotfiles）可以联动，配置专属于自己的工作环境，来简化命令的操作。
## 配置文件（Dotfiles）
准备一份Dotfiles文件仓库，将自己常用的软件配置文件放在里面，方便在不同的机器上使用。
通过符号链接链接到Git版本库中
## SSH中的端口转发
本地端口转发：将远程服务器的监听端口转发到本地
远程端口转发：将本地监听端口转发到远程服务器

# 版本控制（Git）
跳过此章节

# 调试及性能分析
代码不能完全按照您的想法运行，它只能完全按照您的写法运行，这是编程界的一条金科玉律。
## 调试
printf调试大法，高端一点可以用日志记录。
像gdb这样的调试器进行调试
静态代码分析工具，在不运行代码的情况下，发现代码中隐藏的问题。
## 性能分析工具
 - 通用监控：top
 - I/O 操作：iotop
 - 磁盘使用：df
 - 内存使用：free
 - 打开文件：lsof
 - 网络连接和配置：ss、ip
 - 网络使用：iftop

# 元编程
## 依赖管理
主版本号.次版本号.补丁号。相关规则有：

如果新的版本没有改变 API，请将补丁号递增；
如果您添加了 API 并且该改动是向后兼容的，请将次版本号递增；
如果您修改了 API 但是它并不向后兼容，请将主版本号递增。

# 安全和密码学
跳过此章节

# 大杂烩
## 常见命令行标志参数及模式
 - 基本所有的工具支持使用 `--verbose` 或者 `-v` 标志参数来输出详细的运行信息。多次使用这个标志参数，比如 `-vvv`，可以让工具输出更详细的信息（经常用于调试）。同样，很多工具支持 `--quiet` 标志参数来抑制除错误提示之外的其他输出。
 - 大多数工具中，使用 - 代替输入或者输出文件名意味着工具将从标准输入（standard input）获取所需内容，或者向标准输出（standard output）输出结果。
