# 羲和平台

## 协作开发

1. Fork 本仓库
2. 新建 Feat_xxx 分支
3. 提交代码
4. 新建 Pull Request

## 构建

1. `pnpm install`
2. `pnpm dev`
3. `pnpm build`

## 命名形式

1. `camelCase`（驼峰式 ）
2. `kebab-case`（短横线连接式）
3. `PascalCase`（帕斯卡命名式）
4. `Snake`（下划线连接式）

## 命名规则

1. 文件夹以及除 vue 以外的文件采用`kebab-case`
2. Vue 文件命名使用`PascalCase`
3. SFC 中使用 Vue 组件使用`PascalCase`
4. Vue 组件`emit`事件使用`kebab-case`
5. 变量以及函数命名使用`camelCase`，使用`Snake`表明 zh/en，light/dark，`eg: userInfo_zh`
6. css 使用`kebab-case`命名
7. Icon 组件引入时增加 Icon 前缀，eg:`import IconDownload from '~icons/app/download'`
8. 变量命名做到见名知义，eg: `import warningImg from '@/assets/icons/warning.png`
