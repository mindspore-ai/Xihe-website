<script setup>
import { ref, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import IconBack from '~icons/app/back.svg';
import { ElMessage } from 'element-plus';
import IconNecessary from '~icons/app/necessary.svg';
import IconPoppver from '~icons/app/popover.svg';

import { useFileData } from '@/stores';
import { createTrainProject, getProjectData } from '@/api/api-project';

const route = useRoute();
const router = useRouter();

const filePath = ref('');
const isShow = ref(false);
const form = reactive({
  job_name: '',
  code_dir: '',
  frameworks: { framework_type: '', framework_version: '' },
  log_url: '',
  inputs: '',
  hypeparameters: '',
  SDK: '',
  boot_file: '',
  train_instance_type: '',
  job_description: '',
  outputs: '',
  env_variables: '',
});
const rules = reactive({
  name: [
    { required: true, message: '请输入训练实例名称', trigger: 'blur' },
    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
  ],
});
// 当前项目的详情数据
// const detailData = computed(() => {
//   return useFileData().fileStoreData;
// });
const detailData = ref({});
// 返回训练页面
function goTrain() {
  router.push({
    name: 'projectTrain',
  });
}
// 获得项目详情数据
function getDetailData() {
  try {
    getProjectData({
      name: route.params.name,
      owner_name: route.params.user,
    }).then((res) => {
      if (res.results.status === 200) {
        detailData.value = res.results.data[0];
        // console.log(detailData.value);
      }
    });
  } catch (error) {
    console.error(error);
  }
}
getDetailData();
// 跳转到选择文件创建训练实例页
function goSelectFile() {
  router.push({
    path: `/projects/${detailData.value.owner_name.name}/${detailData.value.name}/selectfile`,
    query: {
      id: detailData.value.id,
    },
  });
}
// 确认创建训练实例
function confirmCreating() {
  // let params = { config_path: filePath.value };
  let input = {},
    output = {};
  try {
    input = JSON.parse(JSON.stringify(form.inputs));
    output = JSON.parse(JSON.stringify(form.outputs));
  } catch (e) {
    console.error(e);
  }
  let params = form;
  params.inputs = input;
  params.outputs = output;
  createTrainProject(params, route.query.id).then((res) => {
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: '创建训练实例成功',
        center: true,
      });
      setTimeout(() => {
        router.push({
          name: 'projectTrainList',
        });
      }, 500);
    } else {
      ElMessage({
        type: 'error',
        message: '训练实例创建失败，请修改json文件中的job_name',
        center: true,
      });
    }
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
          <el-form
            :model="form"
            :rules="rules"
            label-width="80px"
            label-position="left"
          >
            <div class="createfile-form-left">
              <div class="createfile-form-item">
                <div class="item-title">
                  <icon-necessary></icon-necessary><span>训练名称</span>
                </div>
                <el-form-item prop="name">
                  <el-input
                    v-model="form.job_name"
                    placeholder="请输入训练名"
                  />
                </el-form-item>
              </div>
              <div class="createfile-form-item">
                <div class="item-title">
                  <icon-necessary></icon-necessary><span>代码目录</span>
                </div>

                <el-form-item placeholder="请输入末尾带/的文件夹格式目录">
                  <el-input v-model="form.code_dir" placeholder="MindSpore" />
                </el-form-item>
              </div>
              <div class="createfile-form-item">
                <div class="item-title">
                  <icon-necessary></icon-necessary><span>框架版本</span>
                </div>
                <el-form-item placeholder="请输入内容">
                  <el-input
                    v-model="form.frameworks.framework_type"
                    style="width: 30%; margin-right: 18px"
                    placeholder="MindSpore"
                  />
                  <el-input
                    v-model="form.frameworks.framework_version"
                    style="width: 66%"
                    placeholder="MindSpore"
                  />
                </el-form-item>
                <!-- <el-form-item class="versions">
                  <el-select
                    v-model="form.framework_type"
                    placeholder="please select your zone"
                    style="width: 160px; margin-right: 20px"
                  >
                    <el-option label="Zone one" value="shanghai" />
                    <el-option label="Zone two" value="beijing" />
                  </el-select>
                  <el-select
                    v-model="form.framework_version"
                    placeholder="please select your zone"
                    style="width: 340px"
                  >
                    <el-option label="Zone one" value="shanghai" />
                    <el-option label="Zone two" value="beijing" />
                  </el-select>
                </el-form-item> -->
              </div>
              <div class="createfile-form-item">
                <div class="item-title">
                  <icon-necessary></icon-necessary><span>日志路径</span>
                </div>
                <el-form-item placeholder="请输入训练日志输出路径">
                  <el-input
                    v-model="form.log_url"
                    placeholder="请输入训练日志输出路径"
                  />
                </el-form-item>
              </div>
              <div class="createfile-form-item">
                <div class="item-title">
                  <span class="item-title-text">输入</span>
                  <el-popover
                    placement="bottom-start"
                    :width="372"
                    trigger="hover"
                    :teleported="false"
                  >
                    <template #reference>
                      <o-icon style="font-size: 18px"
                        ><icon-poppver></icon-poppver
                      ></o-icon>
                    </template>
                    <template #>
                      <div>
                        输入数据配置：在您的算法代码中需要解析的输入参数，比如预训练模型的路径，训练数据集的路径等。
                      </div>
                    </template>
                  </el-popover>
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
                  <span class="item-title-text">超参</span>
                  <el-popover
                    placement="bottom-start"
                    :width="372"
                    trigger="hover"
                    :teleported="false"
                  >
                    <template #reference>
                      <o-icon style="font-size: 18px"
                        ><icon-poppver></icon-poppver
                      ></o-icon>
                    </template>
                    <template #>
                      <div>
                        在您的算法代码中除了输入、输出和日志参数，其它需传入的参数，比如学习率、迭代次数等，此参数将会用于自动评估中上下文信息的显示。
                      </div>
                    </template>
                  </el-popover>
                </div>
                <el-form-item prop="desc">
                  <el-input
                    v-model="form.hypeparameters"
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
                <!-- <el-form-item>
                  <el-select v-model="form.SDK" placeholder="ModelArts">
                    <el-option label="Zone one" value="shanghai" />
                    <el-option label="Zone two" value="beijing" />
                  </el-select>
                </el-form-item> -->
                <el-form-item prop="desc">
                  <el-input v-model="form.SDK" placeholder="ModelArts" />
                </el-form-item>
              </div>
              <div class="createfile-form-item">
                <div class="item-title">
                  <icon-necessary></icon-necessary><span>启动文件</span>
                </div>
                <el-form-item placeholder="请输入文件名">
                  <el-input v-model="form.boot_file" placeholder="MindSpore" />
                </el-form-item>
              </div>
              <div class="createfile-form-item">
                <div class="item-title">
                  <icon-necessary></icon-necessary><span>计算资源</span>
                </div>
                <!-- <el-form-item>
                  <el-select
                    v-model="form.train_instance_type"
                    placeholder="MPI | mindspore_1.3.0-cuda_10.1-py_3.7-ubuntu_1804-x86_64"
                  >
                    <el-option label="Zone one" value="shanghai" />
                    <el-option label="Zone two" value="beijing" />
                  </el-select>
                </el-form-item> -->
                <el-form-item placeholder="">
                  <el-input
                    v-model="form.train_instance_type"
                    placeholder="MindSpore"
                  />
                </el-form-item>
              </div>
              <div class="createfile-form-item">
                <div class="item-title">
                  <span>描述</span>
                </div>
                <el-form-item placeholder="请输入描述">
                  <el-input
                    v-model="form.job_description"
                    placeholder="请输入描述"
                  />
                </el-form-item>
              </div>
              <div class="createfile-form-item">
                <div class="item-title">
                  <span class="item-title-text">输出</span>
                  <el-popover
                    placement="bottom-start"
                    :width="372"
                    trigger="hover"
                    :teleported="false"
                  >
                    <template #reference>
                      <o-icon style="font-size: 18px"
                        ><icon-poppver></icon-poppver
                      ></o-icon>
                    </template>
                    <template #>
                      <div>
                        输出数据配置：在您的算法代码中需要解析的输出参数，比如保存预训练模型的路径等。
                      </div>
                    </template>
                  </el-popover>
                </div>
                <el-form-item prop="desc">
                  <el-input
                    v-model="form.output"
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
                    v-model="form.env_variables"
                    type="textarea"
                    placeholder="请输入内容，格式为[{'',''},{'',''}]"
                  />
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>

        <div class="createfile-content-action">
          <o-button class="confim" type="primary" @click="confirmCreating"
            >确认</o-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// .el-popover.el-popper {
//   padding: 24px 16px 16px 16px;
//   font-size: 12px;
//   line-height: 16px;
//   color: #656565;
//   .remind {
//     color: #f13b35;
//   }
// }
.createfile {
  max-width: 100%;
  height: 100%;
  margin-top: 80px;
  background-color: #f5f6f8;
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
          .createfile-form-item {
            .item-title {
              position: absolute;
              transform: translateY(40%);
              display: flex;
              align-items: center;
              .item-title-text {
                vertical-align: middle;
                margin-right: 8px;
              }
              // .o-icon .el-tooltip__trigger{
              //   font-size: 30px;
              // }
            }
          }
        }
        .createfile-form-right {
          .createfile-form-item {
            .item-title {
              position: absolute;
              transform: translateY(40%);
              display: flex;
              align-items: center;
              .item-title-text {
                vertical-align: middle;
                margin-right: 8px;
              }
            }
          }
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
  font-size: 14px;
  color: #555;
  .el-form-item {
    margin-bottom: 24px;
    width: 560px;
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
