<script setup>
import { ref, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import IconBack from '~icons/app/back.svg';
import IconNecessary from '~icons/app/necessary.svg';
import IconPoppver from '~icons/app/popover.svg';

import { ElMessage } from 'element-plus';
import { createTrainProject, getProjectData } from '@/api/api-project';

import { useUserInfoStore } from '@/stores';

const userInfoStore = useUserInfoStore();

// 是否是访客
const isAuthentic = computed(() => {
  return route.params.user === userInfoStore.userName;
});
const route = useRoute();
const router = useRouter();
const queryRef = ref(null);
const detailData = ref({});
// const isloading = ref(true);

const form = reactive({
  job_name: '',
  code_dir: '',
  frameworks: {
    framework_type: 'MPI',
    framework_version: 'mindspore_1.3.0-cuda_10.1-py_3.7-ubuntu_1804-x86_64',
  },
  log_url: '',
  inputs: '',
  hypeparameters: '',
  SDK: 'ModelArts',
  boot_file: '',
  train_instance_type: 'modelarts.p3.large.public',
  job_description: '',
  outputs: '',
  env_variables: '',
});
// 三级联动数据
const selectData = reactive({
  com1: 'MindSpore',
  com2: 'mindspore_1.3.0-cuda_10.1-py_3.7-ubuntu_1804-x86_64',
  com3: 'GPU:1*NVIDIA-V100(32GB)|CPU:8核 64GB 3200 GB',
});
const optionData = reactive({
  com1: [
    { value: 'A', name: 'MindSpore', content: 'MPI' },
    { value: 'B', name: 'Ascend', content: 'Ascend-Powered-Engine' },
  ],
  com2: {
    A: [
      {
        value: 'A1',
        name: 'mindspore_1.3.0-cuda_10.1-py_3.7-ubuntu_1804-x86_64',
        content: 'mindspore_1.3.0-cuda_10.1-py_3.7-ubuntu_1804-x86_64',
      },
    ],
    B: [
      {
        value: 'B1',
        name: 'mindspore_1.3.0-cann_5.0.2-py_3.7-euler_2.8.3-aarch64',
        content: 'mindspore_1.3.0-cann_5.0.2-py_3.7-euler_2.8.3-aarch64',
      },
      {
        value: 'B2',
        name: 'mindspore_1.5.1-cann_5.0.3-py_3.7-euler_2.8.3-aarch64',
        content: 'mindspore_1.5.1-cann_5.0.3-py_3.7-euler_2.8.3-aarch64',
      },
    ],
  },
  com3: {
    A1: [
      {
        value: 'A11',
        name: 'GPU:1*NVIDIA-V100(32GB)|CPU:8核 64GB 3200 GB',
        content: 'modelarts.p3.large.public',
      },
      {
        value: 'A12',
        name: 'GPU:8*NVIDIA-V100(32GB)|CPU:72核 512GB 3200 GB',
        content: 'modelarts.p3.8xlarge.public',
      },
    ],
    B1: [
      {
        value: 'B11',
        name: 'Ascend: 8*Ascend 910(32GB) | ARM: 192核 768GB 3200GB',
        content: 'modelarts.kat1.8xlarge.public',
      },
      {
        value: 'B12',
        name: 'Ascend: 1*Ascend 910(32GB) | ARM: 24核 96GB 3200GB',
        content: 'modelarts.kat1.xlarge.public',
      },
    ],
    B2: [
      {
        value: 'B21',
        name: 'Ascend: 8*Ascend 910(32GB) | ARM: 192核 768GB 3200GB',
        content: 'modelarts.kat1.8xlarge.public',
      },
      {
        value: 'B22',
        name: 'Ascend: 1*Ascend 910(32GB) | ARM: 24核 96GB 3200GB',
        content: 'modelarts.kat1.xlarge.public',
      },
    ],
  },
});

function change1(val) {
  if (val) {
    let a = optionData.com1.find((item) => {
      return item.value === val;
    });
    form.frameworks.framework_type = a.content;
    selectData.com2 = optionData.com2[val][0].value; //根据第一个控件所选项确定第二个控件下拉内容的对象数组，并使默认为第一个数组项
    change2(); //控件2手动改变时会自动触发该方法，但是被动改变时不会触发，所以手动加上去
  } else {
    selectData.com2 = ''; //若前一个控件清空则后一个控件所选内容也清空
    change2();
  }
}

function change2() {
  let val = selectData.com2;
  if (val) {
    let b = optionData.com2[selectData.com1].find((item) => {
      return item.value === val;
    });
    form.frameworks.framework_version = b.content;

    selectData.com3 = optionData.com3[val][0].value;
    let c = optionData.com3[selectData.com2].find((item) => {
      return item.value === selectData.com3;
    });
    form.train_instance_type = c.content;
  } else {
    selectData.com3 = '';
  }
}

// 进入页面判断是否是自己的项目，不是则返回首页
function goHome() {
  if (!isAuthentic.value) {
    router.push('/');
  }
}
goHome();
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
// 按顺序校验表单数据是否校验通过
function verify(node, code, message) {
  return new Promise((resolve, reject) => {
    node.validateField(code, (valid) => {
      if (!valid) {
        ElMessage({
          type: 'error',
          message,
          duration: 4000,
          center: true,
        });
        reject('未通过');
      } else {
        resolve();
      }
    });
  });
}
// 确认创建训练实例
async function confirmCreating(formEl) {
  // 如果表单为空，返回
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      let inputs = {},
        outputs = {},
        hypeparameters = {},
        env_variables = {};
      try {
        inputs = JSON.parse(form.inputs);
        outputs = JSON.parse(form.outputs);
        hypeparameters = JSON.parse(form.hypeparameters);
        env_variables = JSON.parse(form.env_variables);
      } catch (e) {
        // console.error(e);
      }
      let params = {
        job_name: form.job_name,
        code_dir: form.code_dir,
        frameworks: {
          framework_type: form.frameworks.framework_type,
          framework_version: form.frameworks.framework_version,
        },
        log_url: form.log_url,
        inputs: inputs,
        hypeparameters: hypeparameters,
        SDK: form.SDK,
        boot_file: form.boot_file,
        train_instance_type: form.train_instance_type,
        job_description: form.job_description,
        outputs: outputs,
        env_variables: env_variables,
      };
      // params.inputs = inputs;
      // params.outputs = outputs;
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
            message: res.msg,
            duration: 5000,
            center: true,
          });
        }
      });
    } else {
      return false;
    }
  });
  await verify(
    formEl,
    'job_name',
    '训练名称为1-8位且只包含大小写字母、数字、下划线格式,请重新输入'
  );
  await verify(
    formEl,
    'code_dir',
    '代码目录为文件夹格式，末尾必须带/，请重新输入'
  );
  await verify(
    formEl,
    'boot_file',
    '启动文件名只能包含数字，字母，下划线，且为.py文件,请重新输入'
  );
  await verify(formEl, 'log_url', '日志路径为以 / 结尾的路径格式，请重新输入');
}

// 校验输入框里的内容是否为json格式
const checkJson = (rule, value, callback) => {
  if (value === '') {
    callback();
  } else {
    try {
      JSON.parse(value);
      callback();
    } catch (e) {
      callback(new Error('请输入正确的json格式内容'));
    }
  }
};

const checkBootfile = (rule, value, callback) => {
  if (value === '') {
    callback();
  } else {
    // 判断数组的第一个元素只含有数字，字母，下划线
    let arr = value.split('.');
    if (arr[0].match(/^[a-zA-Z0-9_/]+$/) && arr[1] === 'py') {
      callback();
    } else {
      callback(
        new Error('启动文件名只能包含数字，字母，下划线，斜杠，且为.py文件')
      );
    }
  }
};

const rules = reactive({
  job_name: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
    {
      pattern: /^[a-zA-Z0-9_]{0,8}$/,
      message: '请输入一个1-8位且只包含大小写字母、数字、下划线的名称',
      trigger: 'blur',
    },
  ],
  SDK: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
  ],
  code_dir: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
    { pattern: /\/$/, message: '请输入以 / 结尾的路径格式', trigger: 'blur' },
  ],
  boot_file: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
    { validator: checkBootfile, trigger: 'blur' },
  ],
  // frameworks: [
  //   {
  //     required: true,
  //     message: '必填项',
  //     trigger: 'blur',
  //   },
  // ],
  log_url: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
    { pattern: /\/$/, message: '请输入以 / 结尾的路径格式', trigger: 'blur' },
  ],
  // train_instance_type: [
  //   {
  //     required: true,
  //     message: '必填项',
  //     trigger: 'blur',
  //   },
  // ],
  inputs: [
    {
      validator: checkJson,
      trigger: 'blur',
    },
  ],
  outputs: [
    {
      validator: checkJson,
      trigger: 'blur',
    },
  ],
  // hypeparameters: [
  //   {
  //     validator: checkJson,
  //     trigger: 'blur',
  //   },
  // ],
  // env_variables: [
  //   {
  //     validator: checkJson,
  //     trigger: 'blur',
  //   },
  // ],
});
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
            <div class="selectfile-option" @click="goSelectFile">
              选择配置文件
            </div>
            <div class="createfile-option">创建配置文件</div>
          </div>
        </div>
        <div class="createfile-content-tip">
          你可以通过表单方式创建训练实例，若你是第一次创建训练实例，系统会默认在train/config.json下生成配置文件。详情参考
          <a href="#" style="color: #0d8dff">表单方式-创建训练实例</a>
        </div>
        <div class="createfile-form-wrap">
          <el-form
            ref="queryRef"
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
                <el-form-item prop="job_name">
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

                <el-form-item prop="code_dir">
                  <el-input
                    v-model="form.code_dir"
                    placeholder="请输入训练代码目录"
                  />
                </el-form-item>
              </div>
              <div class="createfile-form-item">
                <div class="item-title">
                  <icon-necessary></icon-necessary><span>框架版本</span>
                </div>
                <el-form-item prop="frameworks">
                  <el-select
                    v-model="selectData.com1"
                    placeholder="请选择"
                    style="width: 30%; margin-right: 3%"
                    @change="change1"
                  >
                    <el-option
                      v-for="x in optionData.com1"
                      :key="x.value"
                      :value="x.value"
                      :label="x.name"
                    ></el-option>
                  </el-select>
                  <el-select
                    v-model="selectData.com2"
                    placeholder="请选择"
                    style="width: 67%"
                    @change="change2"
                  >
                    <el-option
                      v-for="x in optionData.com2[selectData.com1]"
                      :key="x.value"
                      :value="x.value"
                      :label="x.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="createfile-form-item">
                <div class="item-title">
                  <icon-necessary></icon-necessary><span>日志路径</span>
                </div>
                <el-form-item
                  placeholder="请输入训练日志输出路径"
                  prop="log_url"
                >
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
                    :teleported="true"
                  >
                    <template #reference>
                      <o-icon style="font-size: 18px"
                        ><icon-poppver></icon-poppver
                      ></o-icon>
                    </template>
                    <div>
                      输入数据配置：在您的算法代码中需要解析的输入参数，比如预训练模型的路径，训练数据集的路径等。
                      <br />格式为：
                      <div style="color: red">
                        [{ <br />&nbsp;&nbsp;&nbsp;&nbsp;"input_url":
                        &lt;解析参数对应的值1&gt;, <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;"name":&lt;解析参数名称1&gt;
                        <br />&nbsp;&nbsp;},{
                        <br />&nbsp;&nbsp;&nbsp;&nbsp;"input_url":
                        &lt;解析参数对应的值2&gt;,
                        <br />&nbsp;&nbsp;&nbsp;&nbsp;"name":
                        &lt;解析参数名称2&gt; <br />}, ... ]
                      </div>
                      注意{}末尾不能有逗号
                    </div>
                  </el-popover>
                </div>
                <el-form-item prop="inputs">
                  <el-input
                    id="inputs"
                    v-model="form.inputs"
                    type="textarea"
                    placeholder="请输入内容，格式为[{'':''},{'':''}]"
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
                    :teleported="true"
                  >
                    <template #reference>
                      <o-icon style="font-size: 18px"
                        ><icon-poppver></icon-poppver
                      ></o-icon>
                    </template>
                    <div>
                      在您的算法代码中除了输入、输出和日志参数，其它需传入的参数，比如学习率、迭代次数等，此参数将会用于自动评估中上下文信息的显示。
                      <br />格式为：
                      <div style="color: red">
                        [{ <br />&nbsp;&nbsp;&nbsp;&nbsp;"name":
                        &lt;解析参数对应的值1&gt;, <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;"value":&lt;解析参数名称1&gt;
                        <br />&nbsp;&nbsp;},{
                        <br />&nbsp;&nbsp;&nbsp;&nbsp;"name":
                        &lt;解析参数对应的值2&gt;,
                        <br />&nbsp;&nbsp;&nbsp;&nbsp;"value":
                        &lt;解析参数名称2&gt; <br />}, ... ]
                      </div>
                      注意{}末尾不能有逗号
                    </div>
                  </el-popover>
                </div>
                <el-form-item>
                  <el-input
                    v-model="form.hypeparameters"
                    type="textarea"
                    placeholder="请输入内容，格式为[{'':''},{'':''}]"
                  />
                </el-form-item>
              </div>
            </div>
            <div class="createfile-form-right">
              <div class="createfile-form-item">
                <div class="item-title">
                  <icon-necessary></icon-necessary><span>训练平台</span>
                </div>
                <el-form-item prop="SDK">
                  <el-select v-model="form.SDK" placeholder="请选择">
                    <el-option label="ModelArts" value="ModelArts" />
                  </el-select>
                </el-form-item>
                <!-- <el-form-item>
                  <el-input v-model="form.SDK" placeholder="请输入训练平台" />
                </el-form-item> -->
              </div>
              <div class="createfile-form-item">
                <div class="item-title">
                  <icon-necessary></icon-necessary><span>启动文件</span>
                </div>
                <el-form-item prop="boot_file">
                  <el-input
                    v-model="form.boot_file"
                    placeholder="请输入文件名"
                  />
                </el-form-item>
              </div>
              <div class="createfile-form-item">
                <div class="item-title">
                  <icon-necessary></icon-necessary><span>计算资源</span>
                </div>
                <el-form-item prop="train_instance_type">
                  <el-select v-model="selectData.com3" placeholder="请选择">
                    <el-option
                      v-for="x in optionData.com3[selectData.com2]"
                      :key="x.value"
                      :value="x.value"
                      :label="x.name"
                    ></el-option>
                  </el-select>
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
                    :teleported="true"
                  >
                    <template #reference>
                      <o-icon style="font-size: 18px"
                        ><icon-poppver></icon-poppver
                      ></o-icon>
                    </template>
                    <div>
                      输出数据配置：在您的算法代码中需要解析的输出参数，比如保存预训练模型的路径等。
                      <br />格式为：
                      <div style="color: red">
                        [{ <br />&nbsp;&nbsp;&nbsp;&nbsp;"output_dir":
                        &lt;解析参数对应的值1&gt;, <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;"name":&lt;解析参数名称1&gt;
                        <br />&nbsp;&nbsp;},{
                        <br />&nbsp;&nbsp;&nbsp;&nbsp;"output_dir":
                        &lt;解析参数对应的值2&gt;,
                        <br />&nbsp;&nbsp;&nbsp;&nbsp;"name":
                        &lt;解析参数名称2&gt; <br />}, ... ]
                      </div>
                      注意{}末尾不能有逗号
                    </div>
                  </el-popover>
                </div>
                <el-form-item prop="outputs">
                  <el-input
                    v-model="form.outputs"
                    type="textarea"
                    placeholder="请输入内容，格式为[{'':''},{'':''}]"
                  />
                </el-form-item>
              </div>
              <div class="createfile-form-item">
                <div class="item-title">
                  <span class="item-title-text">环境变量</span>
                  <el-popover
                    placement="bottom-start"
                    :width="372"
                    trigger="hover"
                    :teleported="true"
                  >
                    <template #reference>
                      <o-icon style="font-size: 18px"
                        ><icon-poppver></icon-poppver
                      ></o-icon>
                    </template>
                    <div>
                      格式为：
                      <div style="color: red">
                        { <br />&nbsp;&nbsp;&nbsp;&nbsp;"环境变量1":
                        &lt;"环境变量值1"&gt;, <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;...<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;"环境变量n":&lt;"环境变量值n"&gt;
                        <br />&nbsp;&nbsp;}
                      </div>
                      注意{}末尾不能有逗号,且只能是双引号
                    </div>
                  </el-popover>
                </div>
                <el-form-item>
                  <el-input
                    v-model="form.env_variables"
                    type="textarea"
                    placeholder="请输入内容，格式为{'':''},为json格式"
                  />
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>

        <div class="createfile-content-action">
          <o-button
            v-if="
              form.job_name &&
              form.code_dir &&
              form.frameworks &&
              form.log_url &&
              form.SDK &&
              form.train_instance_type &&
              form.boot_file
            "
            class="confim"
            type="primary"
            loading
            @click="confirmCreating(queryRef)"
            >创建</o-button
          >
          <o-button v-else class="confim2" disabled>创建</o-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.createfile {
  max-width: 100%;
  // height: 100%;
  min-height: calc(100vh - 200px);
  margin-top: 80px;
  background-color: #f5f6f8;
  .createfile-wrap {
    max-width: 1440px;
    height: 100%;
    padding: 50px 90px 64px;
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
          .selectfile-option {
            border-bottom: 1px solid transparent;
          }
          .createfile-option {
            color: #0d8dff;
            margin-left: 40px;
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
          // display: grid;
          justify-content: space-between;
        }
        .createfile-form-left {
          .createfile-form-item {
            position: relative;
            .item-title {
              position: absolute;
              transform: translateY(60%);
              display: flex;
              align-items: center;
              .item-title-text {
                vertical-align: middle;
                margin-right: 4px;
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
              transform: translateY(60%);
              display: flex;
              align-items: center;
              .item-title-text {
                vertical-align: middle;
                margin-right: 4px;
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
        .confim2 {
          background: #cee8ff;
          color: #fff;
          border: none;
        }
      }
    }
  }
}

:deep(.el-form) {
  font-size: 14px;
  color: #555;
  // display: grid;
  .el-form-item {
    margin-bottom: 26px;
    width: 560px;
    @media (max-width: 1440px) {
      width: 500px;
    }
    // width: 39%;
    .el-form-item__content {
      width: 80%;
      .el-form-item__error {
        white-space: nowrap;
        // transform: translateY(-50%);
        top: calc(100% + 9px);
        left: 0;
      }
      .el-input {
        width: 100%;
      }
      .el-select {
        width: 100%;
      }
      .el-textarea {
        width: 100% !important;
        height: 276px;
        .el-textarea__inner {
          height: 100%;
        }
      }
    }
  }
}
</style>
