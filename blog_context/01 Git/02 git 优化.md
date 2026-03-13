---
title: git 优化
date: 2026-03-012 10:0:0
permalink: /git/git_optimize
categories:
  - git
is_vip: true
---


# git优化

## 1.开启颜色显示
```shell
git config --global color.ui true
```
---

## 2.关闭路径转义(Git 中设置中文文件名不乱码)
```shell
git config core.quotepath false
```
---

## 3.处理换行符 (CRLF)
```shell
# Windows 使用 CRLF，Linux/Mac 使用 LF。为了避免跨平台协作时出现换行符差异的警告或问题
# 提交时转换为 LF，检出时转换为 CRLF（Windows 推荐）
git config --global core.autocrlf true

# 提交时转换为 LF，检出时不转换（Mac/Linux 推荐）
git config --global core.autocrlf input

```