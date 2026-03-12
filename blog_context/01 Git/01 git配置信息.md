---
title: git配置信息
date: 2026-03-012 10:0:0
permalink: /git/git_config
categories:
  - git

---

# 增

# 增加用户名和邮箱配置
```shell
git config  user.name "Hina-Amano"
git config  user.email "cpythonic@gmail.com"
```

---

# 删
# 删除用户名和邮箱配置
```shell
git config  --unset user.name
git config  --unset user.email
```
---

# 改
# 修改用户名和邮箱配置
```shell
git config  user.name "Hina-Amano"
git config  user.email "cpythonic@gmail.com"
```

## 直接打开配置文件进行编辑（默认是本地配置）
```shell
git config -e
```

---

# 查

## 查看所有配置（显示生效的配置）
```shell
git config --list

```

## 查看某个特定键的值
```shell
git config user.name
```
