<script setup>
import IconPoppver from '~icons/app/popover.svg';
</script>

<template>
  <div class="o-popper">
    <el-popover
      placement="bottom-start"
      :width="372"
      trigger="hover"
      content="this is content, this is content, this is content"
      :teleported="false"
    >
      <template #reference>
        <o-icon><icon-poppver></icon-poppver></o-icon>
      </template>
      <div>
        <div>- 仓库名目前只支持英文</div>
        <div>
          - 仓库名不能以英文句号(<span class="remind">.</span
          >)开头或结尾，且不能包含以下字符<span class="remind"
            >>&nbsp;:&nbsp;/&nbsp;\:*?'&lt;&gt;|</span
          >
        </div>
        <div>- 仓库名不能连续两个及以上中划线（-）或下划线（_）</div>
        <div>
          -&nbsp;仓库名建议简短
          <span class="remind">(3-35个字符)</span>
          ，仓库下的文件或文件夹绝对路径长度<span class="remind"
            >不能超过1000字符</span
          >，例如：仓库下的文件file_name，文件名长度是按照project_name/folder_name/file_name的字符计算
        </div>
      </div>
    </el-popover>
  </div>
</template>
<style lang="scss" scoped>
.o-popper {
  position: absolute;
  right: -32px;
  top: 5px;
  .o-icon {
    font-size: 24px;
  }
  :deep(.el-popover.el-popper) {
    padding: 16px 16px 16px 16px;
    font-size: 12px;
    line-height: 16px;
    color: #656565;
    .remind {
      color: #f13b35;
    }
  }
}
</style>
