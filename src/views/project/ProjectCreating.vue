<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
// import { fromPath } from '@/routers/index';

import protocol from '../../../config/protocol';
import { trainSdk, inferSdk, projectPhoto } from '../../../config/protocol';
import { getModelTags, setNewProject, checkNames } from '@/api/api-project.js';

import { useUserInfoStore } from '@/stores';

import IconPopver from '~icons/app/popover.svg';
import IconNecessary from '~icons/app/necessary.svg';
// import OButton from '@/components/OButton.vue';
import { ElMessage } from 'element-plus';
import { ArrowRight } from '@element-plus/icons-vue';

const userInfo = useUserInfoStore();
const router = useRouter();
// const option = ref('');
/* fromPath === '/projects'
  ? (option.value = '项目')
  : (option.value = '个人主页'); */
const i18n = {
  create: '新建项目',
  owner: '拥有者',
  pro_name: '项目名称',
  input_proName: '请填写项目名称',
  pro_img: '项目封面',
  desc: '描述',
  input_text: '请输入内容',
  licenses: '协议',
  train_sdk: '训练平台',
  infer_sdk: '项目类型',
  view: '仓库属性',
  submit: '提交',
};

// 表单信息
const proList = reactive({
  owner: null,
  cover_id: '1',
  name: null,
  desc: null,
  protocol: null,
  training: null,
  type: null,
  repo_type: null,
});

const ruleFormRef = ref(null);
const rules = reactive({
  name: [
    { required: true, message: '必填项', trigger: 'blur' },
    // 后端5-42
    {
      pattern: /^[^\u4e00-\u9fa5]{5,30}$/g,
      message: '暂不支持中文字符，且长度为5-30个字符',
      trigger: 'blur',
    },
    {
      // 不能含有:;*?\<>|等特殊字符
      // pattern: /^[^\*/?\\<>|:;]$/g,
      pattern: /^[^\*/?\\<>|:;]*$/g,
      message: '不能含有:/\\*;?<>|等特殊字符',
      trigger: 'blur',
    },
    {
      pattern: /^[^.].*[^.]$/,
      message: '不能以.开头或结尾',
      trigger: 'blur',
    },
    {
      pattern: /^(?!.*(-)\1+).*$/,
      message: '不能连续两个及以上中划线',
      trigger: 'blur',
    },
    { validator: checkName, trigger: 'blur' },
  ],
  desc: [
    // { required: true, message: '必填项', trigger: 'blur' },
    { min: 1, max: 100, message: '内容不能为空', trigger: 'blur' },
  ],
});
function checkName(rule, value, callback) {
  checkNames({ name: value, owner: userInfo.userName })
    .then((res) => {
      console.log(res);
      callback();
    })
    .catch((err) => {
      callback(new Error('该名称已存在'));
    });
}

const nameList = ref([]);
const projectPhotos = ref(projectPhoto);
// const trainSdk = ref([]);
// const inferSdk = ref([]);
// const protocol = ref([]);

nameList.value.push(userInfo.userName);
proList.owner = nameList.value[0];

const submitClick = async () => {
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      setProject();
      // console.log(proList);
    } else {
      ElMessage({
        type: 'error',
        message: '请按要求填写信息',
        center: true,
      });
      return;
    }
  });
};

function selectImgClick(item) {
  proList.cover_id = item.id.toString();
  projectPhotos.value.forEach((single) => {
    single.is_active = false;
  });
  item.is_active = true;
}

// 新建项目
function setProject() {
  let newList = JSON.parse(JSON.stringify(proList));
  // if (newList.is_private === 'Public') {
  //   newList.is_private = false;
  // } else {
  //   newList.is_private = true;
  // }
  // protocol.value.forEach((item) => {
  //   if (item.name === newList.protocol) {
  //     newList.protocol = [item.id];
  //   }
  // });
  setNewProject(newList)
    .then((res) => {
      // if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: '创建成功',
      });
      router.push(`/projects/${userInfo.userName}/${res.data.name}`);
      // } else if (
      //   res.data.name &&
      //   res.data.name[0] === '项目名必须是3-20位数字、字母、下划线组成'
      // ) {
      //   ElMessage({
      //     type: 'error',
      //     message: res.data.name[0],
      //   });
      // } else if (
      //   res.data.non_field_errors &&
      //   res.data.non_field_errors[0] ===
      //     '字段 name, owner_id, owner_type 必须能构成唯一集合。'
      // ) {
      //   ElMessage({
      //     type: 'error',
      //     message: '项目名已存在',
      //   });
      // } else {
      // }
    })
    .catch((err) => {
      if (err.message === 'unsupported protocol') {
        ElMessage({
          type: 'error',
          message: '暂不支持该协议',
        });
      } else {
        ElMessage({
          type: 'error',
          message: '文件名重复，或文件名不合规',
        });
      }
    });
}
// TODO:项目封面，项目类型以及训练平台的数据
// getModelTags().then((res) => {

// projectPhotos.value = res.data.projects_photo;
// projectPhotos.value.forEach((item) => {
//   item.is_active = false;
// });
projectPhotos.value[0].is_active = true;
// protocol.value = res.data.licenses;
// trainSdk.value = res.data.train_sdk;
// inferSdk.value = res.data.infer_sdk;

proList.type = inferSdk[0].name;
proList.training = trainSdk[0].name;
proList.protocol = protocol[0].name;
proList.repo_type = 'public';
// console.log('1', trainSdk, '2', projectPhotos);
// });
/* beforeRouteEnter(from){
  console.log('to, from, next: ', from);
  // next();
}; */
onMounted(() => {});
</script>

<template>
  <div class="create">
    <div class="link">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: `/${userInfo.userName}` }"
          >个人主页</el-breadcrumb-item
        >
        <!-- <el-breadcrumb-item
          :to="{
            path: `/${
              fromPath === '/projects' ? 'projects' : userInfo.userName
            }`,
          }"
          >{{ option }}</el-breadcrumb-item
        > -->
        <el-breadcrumb-item class="set-new">新建项目</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="newpro-body">
      <el-form
        ref="ruleFormRef"
        :model="proList"
        :rules="rules"
        label-position="left"
        label-width="120px"
        hide-required-asterisk
      >
        <!-- 拥有者 -->
        <div class="form-item">
          <div class="warning">
            <o-icon><icon-necessary></icon-necessary></o-icon>
          </div>

          <el-form-item :label="i18n.owner" prop="owner">
            <el-select v-model="proList.owner">
              <el-option v-for="item in nameList" :key="item" :value="item">{{
                item
              }}</el-option>
            </el-select>
          </el-form-item>
        </div>
        <!-- 项目名称 -->
        <div class="form-item">
          <div class="warning">
            <o-icon><icon-necessary></icon-necessary></o-icon>
          </div>
          <el-form-item class="pro-name" :label="i18n.pro_name" prop="name">
            <el-input
              v-model="proList.name"
              :placeholder="i18n.input_proName"
            ></el-input>
            <!--  :rules="[
                { required: true, message: '必填项', trigger: 'blur' },
                {
                  pattern: /^[^\u4e00-\u9fa5]{3,1000}$/g,
                  message: '暂不支持中文字符，且长度需大于3个字符',
                  trigger: 'blur',
                },
                {
                  pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9!@#$^&().']+$/,
                  message: '格式不正确',
                  trigger: 'blur',
                },
                {
                  pattern: /^[^.].*[^.]$/,
                  message: '格式不正确',
                  trigger: 'blur',
                },
              ]" -->
            <!-- <el-popover
              placement="bottom-start"
              :width="372"
              trigger="hover"
              content="this is content, this is content, this is content"
              :teleported="false"
            >
              <template #reference>
                <o-icon><icon-popver></icon-popver></o-icon>
              </template>
              <div>- 仓库名目前只支持英文</div>
              <div>
                - 仓库名名称不能以英文句号(<span class="remind">.</span
                >)开头或结尾，且不能包含以下字符:<span class="remind">
                  :&nbsp;/&nbsp;\&nbsp;*&nbsp;;&nbsp;?&nbsp;&lt;&nbsp;&gt;&nbsp;|</span
                >
              </div>
              <div>
                -&nbsp;仓库名建议简短<span class="remind">(5-20个字符)</span
                >，仓库下的文件或文件夹绝对路径长度<span class="remind"
                  >不能超过1000字符</span
                >，例如：仓库下的文件file_name，文件名长度是按照project_name/folder_name/file_name的字符计算的
              </div>
            </el-popover> -->
            <o-popper></o-popper>
          </el-form-item>
        </div>
        <!-- 项目封面 -->
        <div class="form-item">
          <div class="img-warning">
            <o-icon><icon-necessary></icon-necessary></o-icon>
          </div>
          <el-form-item :label="i18n.pro_img" class="item-img">
            <div v-for="item in projectPhotos" :key="item.id" class="image">
              <div
                class="img-modal"
                :class="item.is_active ? 'select_active' : ''"
                @click="selectImgClick(item)"
              ></div>
              <el-image :src="item.url"> </el-image>
            </div>
          </el-form-item>
        </div>
        <!-- 项目描述 -->
        <div class="form-item">
          <div class="warning">
            <!-- <o-icon><icon-necessary></icon-necessary></o-icon> -->
          </div>
          <el-form-item :label="i18n.desc" prop="desc">
            <el-input
              v-model="proList.desc"
              type="textarea"
              :placeholder="i18n.input_text"
              rows="5"
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-form-item>
        </div>
        <!-- 协议 -->
        <div class="form-item">
          <div class="warning">
            <o-icon><icon-necessary></icon-necessary></o-icon>
          </div>
          <el-form-item :label="i18n.licenses">
            <el-select v-model="proList.protocol">
              <el-option
                v-for="item in protocol"
                :key="item.id"
                :value="item.name"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
        </div>
        <!-- 项目类型 -->
        <div class="form-item">
          <div class="warning infer-item">
            <o-icon><icon-necessary></icon-necessary></o-icon>
          </div>
          <el-form-item :label="i18n.infer_sdk">
            <el-select v-model="proList.type">
              <el-option
                v-for="item in inferSdk"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
        </div>
        <!-- 训练平台 -->
        <div class="form-item">
          <div class="warning">
            <o-icon><icon-necessary></icon-necessary></o-icon>
          </div>
          <el-form-item :label="i18n.train_sdk">
            <el-select v-model="proList.training">
              <el-option
                v-for="item in trainSdk"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
        </div>
        <!-- 仓库属性 -->
        <div class="form-item">
          <div class="warning store-item">
            <o-icon><icon-necessary></icon-necessary></o-icon>
          </div>
          <el-form-item class="view" :label="i18n.view">
            <div class="visual">
              <el-radio-group v-model="proList.repo_type">
                <el-radio label="public" />
              </el-radio-group>
              <div class="visual-desc">所有人可见</div>
              <el-radio-group v-model="proList.repo_type">
                <el-radio label="private" />
              </el-radio-group>
              <div class="visual-desc">仅自己可见</div>
            </div>
          </el-form-item>
        </div>
        <div class="obuton">
          <!-- <el-form-item> -->
          <o-button style="margin-top: 48px" type="primary" @click="submitClick"
            >保存</o-button
          >
          <!-- </el-form-item> -->
        </div>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.create {
  background: #f5f6f8;
  padding: 0 16px;
  padding-bottom: 64px;
}
.link {
  padding: 24px 0;
  font-size: 12px;
  margin: 0 auto;
  max-width: 1440px;
  :deep .el-breadcrumb {
    font-size: 12px;
    color: #555555;
    .el-breadcrumb__inner.is-link {
      font-weight: normal;
      color: #555;
    }
    .set-new span {
      color: #000;
      font-weight: 400;
    }
  }
  // .home {
  //   cursor: pointer;
  // }
  // .arrow {
  //   margin: 0 3px;
  // }
  // .createPlaceholder {
  //   color: #000000;
  // }
}

.select_active {
  display: block !important;
  background-color: rgba(165, 213, 255, 0.5);
}
.newpro-body {
  position: relative;
  margin: 0 auto;
  max-width: 1440px;
  min-height: 972px;
  // margin-bottom: 64px;
  background: #ffffff;
  box-shadow: 0px 12px 32px 0px rgba(190, 196, 204, 0.2);
  padding-top: 48px;
  padding-bottom: 48px;
  height: calc(100vh - 558px);

  .el-form {
    width: 520px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    :deep .el-form-item__label {
      padding-right: 22px;
      line-height: 22px;
    }

    .form-item {
      display: flex;
      align-items: center;
      .o-icon.normal {
        font-size: 8px;
      }
      .img-warning {
        font-size: 8px;
        margin-bottom: 3px;
      }
      .warning {
        margin-bottom: 17px;
        font-size: 8px;
      }
      .infer-item {
        align-self: flex-start;
        padding-top: 14px;
      }
      .store-item {
        align-self: start;
        padding-top: 14px;
      }
      .el-form-item {
        display: flex;
        align-items: center;
      }
    }
    .item-img {
      cursor: pointer;
      margin-bottom: 8px !important;
      .image {
        position: relative;
        .el-image {
          margin-right: 16px;
          width: 152px;
          height: 85px;
          cursor: pointer;
        }
        .img-modal {
          position: absolute;
          left: -2px;
          top: -2px;
          width: 157px;
          height: 90px;
          z-index: 100;
          background-color: rgba(165, 213, 255, 0.5);
          display: none;
        }
        &:hover {
          .img-modal {
            display: block;
          }
        }
      }
    }

    .pro-name {
      position: relative;
      :deep(.el-popover.el-popper) {
        padding: 24px 16px 16px 16px;
        font-size: 12px;
        line-height: 16px;
        color: #656565;
        .remind {
          color: #f13b35;
        }
      }
      .o-icon {
        position: absolute;
        right: -40px;
        font-size: 24px;
      }
    }

    .el-form-item {
      margin-bottom: 24px;
      .el-select {
        width: 400px;
      }
    }
    .obuton {
      // width: 144px;
      // height: 48px;
      // margin-left: 128px;
      // margin-top: 24px;
      display: flex;
      justify-content: center;
    }
    .view {
      display: flex;
      margin-bottom: 0px;
      :deep .el-form-item__label {
        height: 128px !important;
        padding-top: 6px;
      }
    }
    .visual {
      display: flex;
      align-self: flex-start !important;
      flex-direction: column;
      .visual-desc {
        padding-left: 22px;
        color: #999999;
        font-size: 14px;
      }
      .el-radio {
        margin-right: 12px;
        width: 72px;
      }
    }
  }
}
</style>
