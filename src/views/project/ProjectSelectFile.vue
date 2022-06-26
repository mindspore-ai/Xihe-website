<script setup>
import IconBack from '~icons/app/back.svg';

import { ref } from 'vue';
const textarea = ref('');

const filePath = ref('');
</script>
<template>
  <div class="selectfile">
    <div class="selectfile-wrap">
      <div class="selectfile-back">
        <o-icon class="right-icon"><icon-back /> </o-icon>
        <span> 返回训练 </span>
      </div>
      <div class="selectfile-content">
        <div class="selectfile-content-title">
          <div class="selectfile-content-title-left">创建训练实例</div>
          <div class="selectfile-content-title-right">
            <div class="createfile-option">创建配置文件</div>
            <div class="selectfile-option">选择配置文件</div>
          </div>
        </div>
        <div class="selectfile-content-tip">
          若你已有配置文件，你可以输入配置文件路径参数进行创建，相关文档参考创建训练实例。
        </div>
        <div class="selectfile-content-path">
          <el-input
            v-model="filePath"
            class="file-select-int"
            placeholder="直接输入json文件名读取"
          >
          </el-input>
          <o-button class="file-select-btn">确认</o-button>
        </div>
        <div class="selectfile-content-textarea">
          <el-input
            v-model="textarea"
            class="file-select-textarea-int"
            type="textarea"
          />
        </div>
        <div class="selectfile-content-action">
          <!-- TODO:centerDialogVisible -->
          <o-button class="cancel" @click="showTrainInstance = false"
            >取消</o-button
          >
          <o-button class="confim" type="primary" @click="confirmCreating"
            >确认</o-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.selectfile {
  max-width: 100%;
  height: 100%;
  margin-top: 80px;
  // margin-bottom: 49px;
  background-color: #f5f6f8;

  // display: flex;
  // justify-content: center;
  // align-items: center;
  &-wrap {
    max-width: 1440px;
    height: 100%;
    padding: 50px;
    margin: 0 auto;
    .selectfile-back {
      font-size: 16px;
      color: #555;
      margin-bottom: 49px;
      display: flex;
      align-items: center;
      .right-icon {
        margin-right: 4px;
        cursor: pointer;
      }
      span {
        cursor: pointer;
      }
    }
    .selectfile-content {
      padding: 16px 32px;
      background-color: #fff;

      // background-color: blue;
      &-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 48px;
        line-height: 48px;
        margin-bottom: 16px;
        &-left {
          font-size: 18px;
          color: #000;
          cursor: pointer;
        }
        &-right {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #555;
          font-size: 16px;
          cursor: pointer;
          .selectfile-option {
            margin-left: 40px;
            color: #0d8dff;
            border-bottom: 1px solid #0d8dff;
          }
        }
      }
      &-tip {
        height: 22px;
        line-height: 22px;
        font-size: 14px;
        color: #999;
      }
      &-path {
        margin: 24px 0;
        // margin-bottom: 24px;
        display: flex;
        justify-content: space-between;
        .file-select-int {
          max-width: 1200px;
          width: 87%;
        }
        .file-select-btn {
          height: 36px;
          padding: 0;
          // width: 10%;
          // margin-left: 8px;
        }
      }
      &-textarea {
        // .el-textarea {
        //   max-width: 100% !important;
        // }
        .file-select-textarea-int {
          width: 100% !important;
          // height: 500px;
          :deep .el-textarea__inner {
            // height: 71.4%;
            height: 600px;
          }
        }
      }
      &-action {
        display: flex;
        justify-content: center;
        margin-top: 48px;
        margin-bottom: 32px;
        .cancel {
          margin-right: 24px;
        }
      }
    }
  }
}
</style>
