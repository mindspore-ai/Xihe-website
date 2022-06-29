<script setup>
import { ref, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import IconBack from '~icons/app/back.svg';
import { ElMessage } from 'element-plus';
import IconNecessary from '~icons/app/necessary.svg';

import { useUserInfoStore, useFileData } from '@/stores';

const route = useRoute();
const router = useRouter();

const filePath = ref('');
const isShow = ref(false);
const form = reactive({
  name: '',
  catalog: '',
  versions: '',
  logPath: '',
  input: '',
  superParams: '',
});
const form2 = reactive({
  platform: '',
  file: '',
  resource: '',
  desc: '',
  output: '',
  variate: '',
});
// 当前项目的详情数据
const detailData = computed(() => {
  return useFileData().fileStoreData;
});
// 返回训练页面
function goTrain() {
  router.push({
    name: 'projectTrain',
  });
}
// 跳转到选择文件创建训练实例页
function goSelectFile() {
  router.push({
    path: `/projects/${detailData.value.owner_name.name}/${detailData.value.name}/selectfile`,
    query: {
      projectId: detailData.value.id,
    },
  });
}
</script>
<template>
  <div class="createfile">
    <div class="createfile-wrap">
      <div class="createfile-back" @click="goTrain">
        <o-icon class="right-icon"><icon-back /> </o-icon>
        <span> 返回训练 </span>
      </div>
      <div class="createfile-content">
        <div class="createfile-content-title">
          <div class="createfile-content-title-left">创建训练实例</div>
          <div class="createfile-content-title-right">
            <div class="createfile-option">创建配置文件</div>
            <div class="selectfile-option" @click="goSelectFile">
              选择配置文件
            </div>
          </div>
        </div>
        <div class="createfile-content-tip">
          为训练实例选择对应的配置，若你已有配置文件，也可通过选择相应配置文件进行创建。
        </div>
        <div class="createfile-form-wrap">
          <el-form :model="form" label-width="80px" label-position="left">
            <div class="createfile-form-left">
              <div class="item-title">
                <icon-necessary></icon-necessary><span>训练名称</span>
              </div>
              <el-form-item>
                <el-input v-model="form.name" placeholder="请输入训练名" />
              </el-form-item>
              <div class="createfile-form-item">
                <div class="item-title">
                  <icon-necessary></icon-necessary><span>代码目录</span>
                </div>

                <el-form-item placeholder="请输入末尾带/的文件夹格式目录">
                  <el-input v-model="form.catalog" placeholder="MindSpore" />
                </el-form-item>
              </div>
              <div class="createfile-form-item">
                <div class="item-title">
                  <icon-necessary></icon-necessary><span>框架版本</span>
                </div>
                <el-form-item class="versions">
                  <el-select
                    v-model="form.versions"
                    placeholder="please select your zone"
                    style="width: 160px; margin-right: 20px"
                  >
                    <el-option label="Zone one" value="shanghai" />
                    <el-option label="Zone two" value="beijing" />
                  </el-select>
                  <el-select
                    v-model="form.versions"
                    placeholder="please select your zone"
                    style="width: 340px"
                  >
                    <el-option label="Zone one" value="shanghai" />
                    <el-option label="Zone two" value="beijing" />
                  </el-select>
                </el-form-item>
              </div>
              <div class="createfile-form-item">
                <div class="item-title">
                  <icon-necessary></icon-necessary><span>日志路径</span>
                </div>
                <el-form-item placeholder="请输入训练日志输出路径">
                  <el-input
                    v-model="form.name"
                    placeholder="请输入训练日志输出路径"
                  />
                </el-form-item>
              </div>
              <div class="createfile-form-item">
                <div class="item-title">
                  <span>输入</span>
                </div>
                <el-form-item prop="desc">
                  <el-input
                    v-model="form.input"
                    type="textarea"
                    placeholder="请输入内容，格式为[{'',''},{'',''}]"
                  />
                </el-form-item>
              </div>
              <div class="createfile-form-item">
                <div class="item-title">
                  <span>超参</span>
                </div>
                <el-form-item prop="desc">
                  <el-input
                    v-model="form.output"
                    type="textarea"
                    placeholder="请输入内容，格式为{'':'',},为json格式"
                  />
                </el-form-item>
              </div>
            </div>
            <div class="createfile-form-right">
              <div class="createfile-form-item">
                <div class="item-title">
                  <icon-necessary></icon-necessary><span>训练平台</span>
                </div>
                <el-form-item required>
                  <el-select v-model="form2.platform" placeholder="ModelArts">
                    <el-option label="Zone one" value="shanghai" />
                    <el-option label="Zone two" value="beijing" />
                  </el-select>
                </el-form-item>
              </div>
              <div class="createfile-form-item">
                <div class="item-title">
                  <icon-necessary></icon-necessary><span>启动文件</span>
                </div>
                <el-form-item placeholder="请输入文件名">
                  <el-input v-model="form2.file" placeholder="MindSpore" />
                </el-form-item>
              </div>
              <div class="createfile-form-item">
                <div class="item-title">
                  <icon-necessary></icon-necessary><span>计算资源</span>
                </div>
                <el-form-item>
                  <el-select
                    v-model="form2.resource"
                    placeholder="MPI | mindspore_1.3.0-cuda_10.1-py_3.7-ubuntu_1804-x86_64"
                  >
                    <el-option label="Zone one" value="shanghai" />
                    <el-option label="Zone two" value="beijing" />
                  </el-select>
                </el-form-item>
              </div>
              <div class="createfile-form-item">
                <div class="item-title">
                  <span>描述</span>
                </div>
                <el-form-item placeholder="请输入描述">
                  <el-input v-model="form2.desc" placeholder="请输入描述" />
                </el-form-item>
              </div>
              <div class="createfile-form-item">
                <div class="item-title">
                  <span>输出</span>
                </div>
                <el-form-item prop="desc">
                  <el-input
                    v-model="form2.output"
                    type="textarea"
                    placeholder="请输入内容，格式为[{'',''},{'',''}]"
                  />
                </el-form-item>
              </div>
              <div class="createfile-form-item">
                <div class="item-title">
                  <span>环境变量</span>
                </div>
                <el-form-item prop="desc">
                  <el-input
                    v-model="form2.variate"
                    type="textarea"
                    placeholder="请输入内容，格式为[{'',''},{'',''}]"
                  />
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>

        <div class="createfile-content-action">
          <!-- @click="confirmCreating" -->
          <o-button class="confim" type="primary">确认</o-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.item-title {
  position: absolute;
  transform: translateY(40%);
}
.createfile {
  max-width: 100%;
  height: 100%;
  margin-top: 80px;
  // margin-bottom: 49px;
  background-color: #f5f6f8;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  .createfile-wrap {
    max-width: 1440px;
    height: 100%;
    padding: 50px;
    margin: 0 auto;
    .createfile-back {
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
    .createfile-content {
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
          .createfile-form-item {
            .item-title {
              position: absolute;
              transform: translateY(50%);
            }
            // display: flex;
            // align-items: center;
          }
        }
        &-right {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #555;
          font-size: 16px;
          cursor: pointer;
          .createfile-option {
            margin-right: 40px;
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
        margin-bottom: 24px;
      }
      .createfile-form-wrap {
        .el-form {
          display: flex;
          justify-content: space-between;
        }
        .createfile-form-left {
          // width: 50%;
          // height: 800px;
          // background-color: #bfa;
        }
        .createfile-form-right {
          // width: 50%;
          // height: 400px;
          // background-color: #bfa;
        }
      }
      &-action {
        display: flex;
        justify-content: center;
        margin-top: 48px;
        margin-bottom: 32px;
      }
    }
  }
}

:deep .el-form {
  .el-form-item {
    margin-bottom: 24px;
    width: 600px;
    // .item-title {
    //   position: absolute;
    //   transform: translateY(50%);
    // }
    .el-form-item__content {
      width: 80%;
      .el-input {
        width: 100%;
      }
      .el-select {
        width: 100%;
      }
      .el-textarea {
        width: 100% !important;
      }
    }
  }
}
</style>
