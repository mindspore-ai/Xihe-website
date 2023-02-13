<script setup>
import { ref, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import IconBack from '~icons/app/back.svg';
import IconNecessary from '~icons/app/necessary.svg';
import IconPoppver from '~icons/app/popover.svg';
import IconAddList from '~icons/app/add-list';
import IconRemove from '~icons/app/remove';
import warningImg from '@/assets/icons/warning.png';

import { ElMessage } from 'element-plus';
import { ElDialog } from 'element-plus';
import { createTrainProject } from '@/api/api-project';
import { getRepoDetailByName } from '@/api/api-gitlab';

import { useUserInfoStore } from '@/stores';
import OButton from '@/components/OButton.vue';

import TrainModel from '@/views/project/train/TrainModel.vue';
import TrainDataset from '@/views/project/train/TrainDataset.vue';
import TrainHyperparams from '@/views/project/train/TrainHyperparams.vue';
import TrainEnvironment from '@/views/project/train/TrainEnvironment.vue';
import TrainDirectory from '@/views/project/train/TrainDirectory.vue';

const userInfoStore = useUserInfoStore();

// 是否是访客
const isAuthentic = computed(() => {
  return route.params.user === userInfoStore.userName;
});
const route = useRoute();
const router = useRouter();
const tips = ref(false); //控制创建训练弹窗
const queryRef = ref(null);
const detailData = ref([]);
const showDir = ref(false);
const codeDir = ref(''); // 代码目录
const bootFile = ref(''); //启动文件
const codeDirInt = ref(null); //代码目录输入框
const bootFileInt = ref(null); //启动文件输入框
const option = ref(''); // 选择类型
const showbtn = ref(false); //是否弹窗确定按钮

// 用于获取子组件元素
const model = ref([]);
const dataset = ref([]);
const hyperparams = ref([]);
const environment = ref([]);

const modelId = ref(0);
const datasetId = ref(0);
const hyperparamsId = ref(0);
const environmentId = ref(0);

const modelList = reactive([]); //模型列表
const datasetList = reactive([]); //数据集列表
const hyperparamsList = reactive([]); //超参列表
const environmentList = reactive([]); //环境变量列表

const form = reactive({
  name: '',
  SDK: 'ModelArts',
  code_dir: '',
  boot_file: '',
  enable_aim: false,
  enable_output: true,
  compute: {
    type: 'MPI',
    version: 'mindspore_1.3.0-cuda_10.1-py_3.7-ubuntu_1804-x86_64',
    flavor: 'modelarts.p3.large.public',
  },
  datasets: [],
  hyperparameter: [],
  env: [],
  models: [],
  desc: '',
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
        name: 'mindspore_1.7.0-cann_5.1.0-py_3.7-euler_2.8.3-aarch64',
        content: 'mindspore_1.7.0-cann_5.1.0-py_3.7-euler_2.8.3-aarch64',
      },
      /* {30日注释
        value: 'B2',
        name: 'mindspore_1.5.1-cann_5.0.3-py_3.7-euler_2.8.3-aarch64',
        content: 'mindspore_1.5.1-cann_5.0.3-py_3.7-euler_2.8.3-aarch64',
      }, */
    ],
  },
  com3: {
    A1: [
      {
        value: 'A11',
        name: 'GPU:1*NVIDIA-V100(32GB)|CPU:8核 64GB 3200 GB',
        content: 'modelarts.p3.large.public',
      },
      /* {
        value: 'A12',
        name: 'GPU:8*NVIDIA-V100(32GB)|CPU:72核 512GB 3200 GB',
        content: 'modelarts.p3.8xlarge.public',
      }, */
    ],
    B1: [
      /* {
        value: 'B11',
        name: 'Ascend: 8*Ascend 910(32GB) | ARM: 192核 768GB 3200GB',
        content: 'modelarts.kat1.8xlarge.public',
      }, */
      {
        value: 'B12',
        name: 'Ascend: 1*Ascend 910(32GB) | ARM: 24核 96GB 3200GB',
        content: 'modelarts.kat1.xlarge.public',
      },
    ],
    B2: [
      /* {
        value: 'B21',
        name: 'Ascend: 8*Ascend 910(32GB) | ARM: 192核 768GB 3200GB',
        content: 'modelarts.kat1.8xlarge.public',
      }, */
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
    form.compute.type = a.content;
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
    form.compute.version = b.content;

    selectData.com3 = optionData.com3[val][0].value;
    let c = optionData.com3[selectData.com2].find((item) => {
      return item.value === selectData.com3;
    });
    form.compute.flavor = c.content;
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
    getRepoDetailByName({
      user: route.params.user,
      repoName: route.params.name,
      modular: 'project',
    }).then((res) => {
      detailData.value = res.data;
    });
  } catch (error) {
    console.error(error);
  }
}
getDetailData();
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
  tips.value = false;
  // 如果表单为空，返回
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      // 获取模型数据
      model.value.forEach((element) => {
        form.models.push(element.modelData);
      });
      dataset.value.forEach((element) => {
        form.datasets.push(element.datasetData);
      });
      // 获取超参数据
      hyperparams.value.forEach((element) => {
        form.hyperparameter.push(element.hyperparamsData);
      });
      // 获取环境变量数据
      environment.value.forEach((element) => {
        form.env.push(element.environmentData);
      });

      let params = {
        name: form.name,
        SDK: form.SDK,
        code_dir: form.code_dir,
        boot_file: form.boot_file,
        enable_aim: form.enable_aim,
        enable_output: form.enable_output,
        compute: {
          type: form.compute.type,
          version: form.compute.version,
          flavor: form.compute.flavor,
        },
        models: form.models,
        datasets: form.datasets,
        desc: form.desc,
        env: form.env,
        hyperparameter: form.hyperparameter,
      };
      createTrainProject(params, detailData.value.id)
        .then(() => {
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
        })
        .catch((error) => {
          if (error.response.data.msg === "can't find repo id") {
            ElMessage({
              type: 'warning',
              message: '用户名和仓库不对应',
              center: true,
            });
          } else if (error.response.data.msg === 'empty key') {
            ElMessage({
              type: 'warning',
              message: '请填写引用参数',
              center: true,
            });
          } else if (error.response.data.msg === 'invalid user name') {
            ElMessage({
              type: 'warning',
              message: '请填写用户名',
              center: true,
            });
          } else {
            ElMessage({
              type: 'warning',
              message: '请填写仓库名,且长度为3-50个字符',
              center: true,
            });
          }
          model.value = [];
          dataset.value = [];
        });
    } else {
      return false;
    }
  });
  await verify(
    formEl,
    'name',
    '训练名称为5-50位且只包含大小写字母、数字、下划线格式,请重新输入'
  );
  await verify(
    formEl,
    'code_dir',
    '代码目录为文件夹格式，末尾必须带/，请重新输入'
  );
  await verify(
    formEl,
    'boot_file',
    '启动文件名只能包含数字，字母，下划线，斜杠，且为.py文件,请重新输入'
  );
}

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
  name: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    },
    {
      pattern: /^[a-zA-Z0-9_]{5,50}$/,
      message: '请输入一个5-50位且只包含大小写字母、数字、下划线的名称',
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
  desc: [
    {
      pattern: /^[\u4e00-\u9fa5-_，,。 .a-zA-Z0-9]+$/,
      message:
        '仅支持中英文、数字，且允许字符为：下划线_、中划线-、空格 、逗号，、句号。',
      trigger: 'blur',
    },
  ],
});

// 添加输入模型
function addModel() {
  let item = { id: modelId.value, key: 'key值', value: 'value值' };
  modelList.push(item);
  modelId.value++;
}

// 添加输入数据集
function addDataset() {
  let item = { id: datasetId.value, key: 'key值', value: 'value值' };
  datasetList.push(item);
  datasetId.value++;
}
// 添加超参
function addHyperparams() {
  let item = { id: hyperparamsId.value, key: 'key值', value: 'value值' };
  hyperparamsList.push(item);
  hyperparamsId.value++;
}
// 添加环境变量
function addEnvironment() {
  let item = { id: environmentId.value, key: 'key值', value: 'value值' };
  environmentList.push(item);
  environmentId.value++;
}

// 删除输入模型
function deleteModel(item) {
  let index = modelList.indexOf(item);
  modelList.splice(index, 1);
  if (modelList.length === 0) {
    form.models = [];
  }
}
// 删除数据集
function deleteDataset(item) {
  let index = datasetList.indexOf(item);
  datasetList.splice(index, 1);
  if (datasetList.length === 0) {
    form.datasets = [];
  }
}
// 删除超参
function deleteHyperparams(item) {
  let index = hyperparamsList.indexOf(item);
  hyperparamsList.splice(index, 1);
  if (hyperparamsList.length === 0) {
    form.hyperparameter = [];
  }
}
// 删除环境变量
function deleteEnvironment(item) {
  let index = environmentList.indexOf(item);
  environmentList.splice(index, 1);
  if (environmentList.length === 0) {
    form.env = [];
  }
}

// 子组件点击
function handleClick(item) {
  if (option.value === 'directory') {
    codeDir.value = item;
  } else {
    bootFile.value = item;
    showbtn.value = true;
  }
}

// 确定选择
function confirmSelect(type) {
  showDir.value = false;
  if (type === 'directory') {
    form.code_dir = codeDir.value;
    codeDirInt.value.focus();
  } else {
    showbtn.value = false;
    form.boot_file = bootFile.value;
    bootFileInt.value.focus();
  }
}

// 选择目录
function selectDir(item) {
  option.value = item;
  showDir.value = true;
}
// 选择文件
function selectFile(item) {
  option.value = item;
  showDir.value = true;
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
          </div>
        </div>
        <div class="createfile-content-tip">
          你可以通过表单方式创建训练实例，详情请参考
          <a
            href="https://xihe-docs.mindspore.cn/zh/tutorial/train/"
            target="_blank"
            style="color: #0d8dff"
            >表单方式-创建训练实例</a
          >
        </div>
        <div class="createfile-form-wrap">
          <el-form
            ref="queryRef"
            :model="form"
            :rules="rules"
            label-width="100px"
            label-position="left"
            hide-required-asterisk
          >
            <!-- 表单上侧 -->
            <div class="form-wrap-top">
              <div class="form-top">
                <div class="createfile-form-item">
                  <div class="item-title">
                    <o-icon><icon-necessary></icon-necessary></o-icon>
                  </div>
                  <el-form-item prop="name" label="训练名称">
                    <el-input v-model="form.name" placeholder="请输入训练名" />
                  </el-form-item>
                </div>
                <div class="createfile-form-item">
                  <div class="item-title">
                    <o-icon><icon-necessary></icon-necessary></o-icon>
                  </div>
                  <el-form-item prop="SDK" label="训练平台">
                    <el-select v-model="form.SDK" placeholder="请选择">
                      <el-option label="ModelArts" value="ModelArts" />
                    </el-select>
                  </el-form-item>
                </div>
                <div class="createfile-form-item">
                  <div class="item-title">
                    <o-icon><icon-necessary></icon-necessary></o-icon>
                  </div>
                  <el-form-item prop="code_dir" label="代码目录">
                    <div class="option">
                      <el-input
                        ref="codeDirInt"
                        v-model="form.code_dir"
                        placeholder="请选择代码目录"
                      />
                      <o-button @click="selectDir('directory')">选择</o-button>
                    </div>
                  </el-form-item>
                </div>
                <div class="createfile-form-item">
                  <div class="item-title">
                    <o-icon><icon-necessary></icon-necessary></o-icon>
                  </div>
                  <el-form-item prop="boot_file" label="启动文件">
                    <div class="option">
                      <el-input
                        ref="bootFileInt"
                        v-model="form.boot_file"
                        placeholder="请选择启动文件（.py结尾的文件）"
                      />
                      <o-button @click="selectFile('file')">选择</o-button>
                    </div>
                  </el-form-item>
                </div>
                <div class="createfile-form-item frameworks">
                  <div class="item-title">
                    <icon-necessary></icon-necessary>
                  </div>
                  <!-- prop="compute" -->
                  <el-form-item label="框架版本">
                    <div class="version">
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
                    </div>
                    <div class="resource">
                      <span class="item-title">
                        <icon-necessary></icon-necessary><span>计算资源</span>
                      </span>
                      <el-select v-model="selectData.com3" placeholder="请选择">
                        <el-option
                          v-for="x in optionData.com3[selectData.com2]"
                          :key="x.value"
                          :value="x.value"
                          :label="x.name"
                        ></el-option>
                      </el-select>
                    </div>
                  </el-form-item>
                </div>
                <div class="createfile-form-item">
                  <el-form-item prop="desc" label="描述">
                    <el-input
                      v-model="form.desc"
                      style="height: 98px"
                      type="textarea"
                      placeholder="请输入描述"
                    />
                  </el-form-item>
                </div>
              </div>
            </div>
            <!-- 表单下侧 -->
            <div class="form-wrap-bottom">
              <div class="form-bottom">
                <div class="createfile-form-item">
                  <div class="item-icon">
                    <el-popover
                      placement="bottom-start"
                      :width="372"
                      trigger="hover"
                      :teleported="true"
                    >
                      <template #reference>
                        <o-icon style="font-size: 20px"
                          ><icon-poppver></icon-poppver
                        ></o-icon>
                      </template>
                      <div>
                        <span style="color: red">引用参数: </span>
                        用户要引用这个模型的参数。<br />
                        <span style="color: red">用户名: </span>
                        模型仓库的拥有者。<br />
                        <span style="color: red">模型名: </span>
                        模型仓库的名称。<br />
                        <span style="color: red">文件路径: </span>
                        模型仓库的文件路径。<br />
                      </div>
                    </el-popover>
                  </div>
                  <el-form-item class="model" label="输入模型">
                    <div
                      v-for="item in modelList"
                      :key="item.id"
                      class="model-list"
                    >
                      <TrainModel ref="model"></TrainModel>
                      <div class="delete-btn" @click="deleteModel(item)">
                        <o-icon class="train-icon"
                          ><icon-remove></icon-remove
                        ></o-icon>
                      </div>
                    </div>
                    <div class="addModel" @click="addModel">
                      <o-icon> <icon-add-list></icon-add-list> </o-icon>
                      <span>添加训练输入模型</span>
                    </div>
                  </el-form-item>
                </div>
                <div class="createfile-form-item">
                  <div class="item-icon">
                    <el-popover
                      placement="bottom-start"
                      :width="372"
                      trigger="hover"
                      :teleported="true"
                    >
                      <template #reference>
                        <o-icon style="font-size: 20px"
                          ><icon-poppver></icon-poppver
                        ></o-icon>
                      </template>
                      <div>
                        <span style="color: red">引用参数: </span>
                        用户要引用这个数据集的参数。<br />
                        <span style="color: red">用户名: </span>
                        数据集仓库的拥有者。<br />
                        <span style="color: red">数据集名: </span>
                        数据集仓库的名称。<br />
                        <span style="color: red">文件路径: </span>
                        数据集仓库的文件路径。<br />
                      </div>
                    </el-popover>
                  </div>
                  <el-form-item class="dataset" label="输入数据集">
                    <div
                      v-for="item in datasetList"
                      :key="item.id"
                      class="model-list"
                    >
                      <TrainDataset ref="dataset"></TrainDataset>
                      <div class="delete-btn" @click="deleteDataset(item)">
                        <o-icon class="train-icon"
                          ><icon-remove></icon-remove
                        ></o-icon>
                      </div>
                    </div>
                    <div class="addModel" @click="addDataset">
                      <o-icon>
                        <icon-add-list></icon-add-list>
                      </o-icon>
                      <span>添加训练输入数据集</span>
                    </div>
                  </el-form-item>
                </div>
                <div class="createfile-form-item">
                  <el-form-item label="训练输出">
                    <div class="form-item-btn">
                      <el-switch v-model="form.enable_output" />
                      <span style="line-height: 22px" class="btn-text"
                        >若你要支持训练输出，需在训练代码中指定参数名为output_path，并将训练生成的文件保存在该参数路径下。</span
                      >
                    </div>
                  </el-form-item>
                </div>
                <div class="createfile-form-item">
                  <el-form-item label="自定义评估" class="form-item-btn">
                    <div class="form-item-btn">
                      <el-switch v-model="form.enable_aim" />
                      <span style="line-height: 22px" class="btn-text"
                        >默认为标准评估，打开此按钮则支持自定义评估，且需在训练代码中指定解析参数名为aim_repo，并将aim生成的仓库保存在该参数路径下。
                      </span>
                    </div>
                  </el-form-item>
                </div>
                <div class="createfile-form-item">
                  <div class="item-icon">
                    <el-popover
                      placement="bottom-start"
                      :width="372"
                      trigger="hover"
                      :teleported="true"
                    >
                      <template #reference>
                        <o-icon style="font-size: 20px"
                          ><icon-poppver></icon-poppver
                        ></o-icon>
                      </template>
                      <div>
                        在您的算法代码中除了模型、数据集等参数，其它需传入的参数，比如学习率、迭代次数等，此参数将会用于自动评估中上下文信息的显示。
                        <br />
                      </div>
                    </el-popover>
                  </div>
                  <el-form-item label="超参" class="hyperparams">
                    <div
                      v-for="item in hyperparamsList"
                      :key="item.id"
                      class="model-list"
                    >
                      <TrainHyperparams ref="hyperparams"></TrainHyperparams>
                      <div class="delete-btn" @click="deleteHyperparams(item)">
                        <o-icon class="train-icon">
                          <icon-remove></icon-remove>
                        </o-icon>
                      </div>
                    </div>
                    <div class="addModel" @click="addHyperparams">
                      <o-icon> <icon-add-list></icon-add-list> </o-icon>
                      <span>添加超参</span>
                    </div>
                  </el-form-item>
                </div>
                <div class="createfile-form-item">
                  <div class="item-icon">
                    <el-popover
                      placement="bottom-start"
                      :width="372"
                      trigger="hover"
                      :teleported="true"
                    >
                      <template #reference>
                        <o-icon style="font-size: 20px"
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
                  <el-form-item label="环境变量" class="environment">
                    <div
                      v-for="item in environmentList"
                      :key="item.id"
                      class="model-list"
                    >
                      <TrainEnvironment ref="environment"></TrainEnvironment>
                      <div class="delete-btn" @click="deleteEnvironment(item)">
                        <o-icon class="train-icon">
                          <icon-remove></icon-remove>
                        </o-icon>
                      </div>
                    </div>
                    <div class="addModel" @click="addEnvironment">
                      <o-icon> <icon-add-list></icon-add-list> </o-icon>
                      <span>添加环境变量</span>
                    </div>
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-form>
        </div>

        <div class="createfile-content-action">
          <o-button
            v-if="form.name && form.code_dir && form.boot_file && form.compute"
            class="confim"
            type="primary"
            loading
            @click="tips = true"
            >创建</o-button
          >
          <o-button v-else class="confim2" disabled>创建</o-button>
        </div>
      </div>
    </div>
  </div>
  <!-- 训练在24小时后终止提示弹窗 -->
  <el-dialog
    v-model="tips"
    width="640px"
    :show-close="false"
    center
    align-center
  >
    <template #header="{ titleId, titleTitle }">
      <div :id="titleId" :class="titleTitle">
        <img :src="warningImg" alt="" />
      </div>
    </template>
    <div
      class="dlg-body"
      style="color: #555; font-size: 18px; text-align: center"
    >
      <div style="margin-bottom: 10px">
        亲爱的用户您好，为保证用户使用体验，
      </div>
      <div>
        单次训练时长最大为<span style="color: #0d8dff">24小时</span
        >，请您注意使用时长哦~
      </div>
    </div>
    <template #footer>
      <div class="dlg-actions" style="display: flex; justify-content: center">
        <o-button style="margin-right: 16px" @click="tips = false"
          >取消</o-button
        >
        <o-button type="primary" @click="confirmCreating(queryRef)"
          >继续
        </o-button>
      </div>
    </template>
  </el-dialog>

  <!-- 代码目录、启动文件弹窗 -->
  <el-dialog
    v-model="showDir"
    :show-close="false"
    center
    width="800px"
    align-center
  >
    <template #header="{ titleId, titleTitle }">
      <div :id="titleId" :class="titleTitle">
        <div v-if="option === 'directory'">代码目录</div>
        <div v-else>启动文件</div>
      </div>
    </template>
    <TrainDirectory
      v-if="detailData.id"
      :repo-detail="detailData"
      :option-type="option"
      @handle="handleClick"
    ></TrainDirectory>
    <template #footer>
      <div class="dlg-actions" style="display: flex; justify-content: center">
        <div v-if="option === 'directory'">
          <o-button style="margin-right: 16px" @click="showDir = false"
            >取消</o-button
          >
          <o-button type="primary" @click="confirmSelect(option)"
            >确定</o-button
          >
        </div>
        <div v-if="option === 'file'">
          <o-button style="margin-right: 16px" @click="showDir = false"
            >取消</o-button
          >
          <o-button v-if="showbtn" type="primary" @click="confirmSelect(option)"
            >确定</o-button
          >
          <o-button v-else disabled type="secondary">确定</o-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.train-icon {
  &:hover {
    color: #0d8dff;
  }
}
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
        // 表单上侧
        .form-wrap-top {
          padding-bottom: 14px;
          border-bottom: 1px solid #d8d8d8;
          .form-top {
            width: 70%;
            margin: 0 auto;
            .createfile-form-item {
              position: relative;
              .item-title {
                position: absolute;
                top: 50%;
                transform: translateY(-40%);
                font-size: 8px;
              }
              .option {
                width: 100%;
                height: 36px;
                display: flex;
                .o-button {
                  min-width: 80px;
                  padding: 5px 28px;
                  margin-left: 8px;
                }
              }
            }
            .frameworks {
              position: relative;
              .item-title {
                position: absolute;
                top: 0;
                transform: translateY(75%);
                span {
                  margin-left: 2px;
                }
              }
              .version {
                margin-bottom: 26px;
              }
              .resource {
                width: 100%;
                .item-title {
                  position: absolute;
                  top: 50%;
                  left: -140px;
                  transform: translateY(50%);
                  span {
                    margin-left: 2px;
                    font-size: 14px;
                  }
                }
              }
            }
          }
        }
        // 表单下侧
        .form-wrap-bottom {
          margin-top: 40px;
          .form-bottom {
            width: 70%;
            margin: 0 auto;
            .createfile-form-item {
              position: relative;
              margin-top: 27px;
              .item-icon {
                position: absolute;
                top: 5px;
                left: 85px;
                // transform: translateY(-50%);
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
  width: 100%;
  .el-form-item {
    margin-bottom: 26px;
    margin-left: 10px;
    .el-form-item__content {
      // width: 100%;
      width: 546px;
      max-width: 546px;
      margin-left: 27px;
      .o-icon {
        font-size: 16px;
      }
      .el-form-item__error {
        white-space: nowrap;
        top: calc(100% + 12px);
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
        height: 284px;
        .el-textarea__inner {
          height: 100%;
        }
      }
    }
    .el-form-item__label::before {
      width: 18px;
      height: 18px;
    }
  }
  // 输出、评估按钮
  .form-item-btn {
    display: flex;
    align-items: center;
    .btn-text {
      margin-left: 16px;
    }
  }
  // 输入模型、数据集、超参、环境变量
  .model,
  .dataset,
  .hyperparams,
  .environment {
    margin-bottom: 0px;

    .el-form-item__content {
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      .addModel {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #000;
        cursor: pointer;
        &:hover {
          color: #0d8dff;
        }
        span {
          margin-left: 4px;
        }
      }
      .model-list {
        width: 100%;
        position: relative;
        .delete-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-80%);
          right: -30px;
          display: flex;
          cursor: pointer;
          .o-icon {
            font-size: 24px;
          }
        }
      }
    }
  }
}

/* :deep(.el-dialog) {
  .el-dialog__header{
    padding-bottom: 24px !important;
  }
  .el-dialog__body{
    background-color: red;

  }
} */
</style>
