<script setup>
import { reactive, ref } from 'vue';
import { useUserInfoStore } from '@/stores';

import IconNecessary from '~icons/app/necessary.svg';
// import IconPoppver from '~icons/app/popover.svg';

// import OSelect from '@/components/OSelect.vue';//
// import OInput from '@/components/OInput.vue';
import { ArrowRight } from '@element-plus/icons-vue';
import OButton from '@/components/OButton.vue';

import { getModelTags } from '@/api/api-model';
import { createDataset } from '@/api/api-dataset';
import { useRouter } from 'vue-router';
const router = useRouter();
const userInfo = useUserInfoStore();
// const visual = ref('Public');
const i18n = {
  homePage: '个人主页',
  createPlaceholder: '新建数据集',
  datasetOwner: '拥有者',
  datasetName: '数据集名称',
  datasetDescribe: '描述',
  license: '协议',
  visualization: '仓库属性',
  preserve: '保存',
  public: '所有人可见',
  private: '仅自己可见',
  placeholder: {
    name: '请输入数据集名称',
    describe: '请输入内容',
  },
};
const owner = ref([]);
const protocol = ref([]);

let queryRef = ref(null);

let query = reactive({
  owner: userInfo.userName,
  name: '',
  repo_type: 'public',
  desc: '',
  protocol: null,
});
// function getOwnSelect(value) {
//   query.owner = value;
// }
// function getLicenses(value) {
//   query.licenses.push(value);
// }

try {
  owner.value = useUserInfoStore().owner;
  getModelTags().then((res) => {
    protocol.value = res.data.licenses;
    query.protocol = protocol.value[0].name;
  });
  // query.owner = owner.value[0];
  // query.licenses[0] = licenses.value[0];
} catch (error) {
  console.error(error);
}
function create(formEl) {
  if (!formEl) return;
  formEl.validate((valid) => {
    console.log(valid);
    if (valid) {
      // let newList = JSON.parse(JSON.stringify(query));
      // newList.protocol = [newList.protocol];
      createDataset(query).then((res) => {
        if (res.status === 200) {
          ElMessage({
            type: 'success',
            message: '创建成功',
          });
          router.push(
            `/datasets/${res.data.owner_name.name}/${res.data.name}/tree`
          );
        } else {
          ElMessage({
            type: 'error',
            message: '文件名重复，或文件名不合规',
          });
        }
      });
    } else {
      console.error('error submit!');
      return false;
    }
  });
}
</script>

<template>
  <div class="creating-body">
    <div class="link">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: `/${userInfo.userName}` }"
          >个人主页</el-breadcrumb-item
        >
        <el-breadcrumb-item class="set-new">新建数据集</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- <span class="home" @click="router.push(`/${userInfo.userName}`)">{{
        i18n.homePage
      }}</span
      ><span class="arrow">&gt;</span
      ><span class="createPlaceholder">{{ i18n.createPlaceholder }}</span> -->
    </div>

    <el-form ref="queryRef" class="creating-box" :model="query" prop="region">
      <el-form-item
        class="item"
        prop="owner"
        :rules="{ required: true, message: '必填项', trigger: 'change' }"
      >
        <div class="requirement">
          <icon-necessary></icon-necessary><span>{{ i18n.datasetOwner }}</span>
        </div>

        <el-select
          v-model="query.owner"
          class="m-2"
          placeholder="Select"
          size="large"
        >
          <el-option
            v-for="item in owner"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        class="item"
        prop="name"
        :rules="[
          { required: true, message: '必填项', trigger: 'blur' },
          {
            pattern: /^[^\u4e00-\u9fa5]{3,64}$/g,
            message: '暂不支持中文字符，且长度为3-64个字符',
            trigger: 'blur',
          },
          {
            pattern: /^[^\*/?\\<>|:;]{3,64}$/g,
            message: '不能含有:/\*?<>|等特殊字符',
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
        ]"
      >
        <div class="requirement">
          <icon-necessary></icon-necessary><span>{{ i18n.datasetName }}</span>
        </div>
        <el-input
          v-model="query.name"
          :placeholder="i18n.placeholder.name"
          size=""
        ></el-input>
        <!-- <el-popover
          visible
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
              - 仓库名名称不能以英文句号(<span class="remind">.</span
              >)开头或结尾，且不能包含以下字符<span class="remind"
                >>&nbsp;:&nbsp;/&nbsp;\:*?'&lt;&gt;|</span
              >
            </div>
            <div>
              -&nbsp;仓库名建议简短，仓库下的文件或文件夹绝对路径长度<span
                class="remind"
                >不能超过1000字符</span
              >，例如：仓库下的文件file_name，文件名长度是按照project_name/folder_name/file_name的字符计算的
            </div>
          </div>
        </el-popover> -->
        <o-popper></o-popper>
      </el-form-item>
      <el-form-item
        class="des item"
        prop="desc"
        :rules="{ required: true, message: '必填项', trigger: 'blur' }"
      >
        <div>
          <icon-necessary></icon-necessary
          ><span>{{ i18n.datasetDescribe }}</span>
        </div>
        <el-input
          v-model="query.desc"
          :rows="2"
          type="textarea"
          :placeholder="i18n.placeholder.describe"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        class="item"
        prop="protocol"
        :rules="{ required: true, message: '必填项', trigger: 'change' }"
      >
        <div class="requirement">
          <icon-necessary></icon-necessary><span>{{ i18n.license }}</span>
        </div>
        <el-select
          v-model="query.protocol"
          class="m-2"
          placeholder="Select"
          size="large"
        >
          <el-option
            v-for="item in protocol"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="item visualization">
        <div class="requirement text">
          <icon-necessary></icon-necessary><span>{{ i18n.visualization }}</span>
        </div>
        <div></div>
        <div class="radio">
          <el-radio v-model="query.repo_type" label="public" size="large"
            >Public</el-radio
          >
          <div class="explain1">{{ i18n.public }}</div>
          <el-radio v-model="query.repo_type" label="private" size="large"
            >Private</el-radio
          >
          <div class="explain2">{{ i18n.private }}</div>
        </div>
      </el-form-item>
      <o-button type="primary" @click="create(queryRef)">{{
        i18n.preserve
      }}</o-button>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.creating-body {
  min-height: calc(100vh - 460px);
  height: 100%;
  width: 100%;
  padding: 0 16px;
  background: #f5f6f8;
  padding-bottom: 64px;
  opacity: 1;

  .link {
    padding: 24px 0;
    font-size: 12px;
    margin: 0 auto;
    max-width: 1440px;
    color: #555555;
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

  .creating-box {
    padding-top: 48px;
    margin: 0 auto;
    max-width: 1440px;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 48px;
    min-height: calc(100vh - 558px);

    .des {
      // .el-textarea {
      //   width: 400px;
      //   :deep(.el-textarea__inner) {
      //     height: 126px;
      //     box-shadow: 0 0 0 1px #999999 inset;
      //     border-radius: 0%;
      //     padding: 7px 16px;
      //     resize: none;
      //     &:focus {
      //       box-shadow: 0 0 0 1px #555555 inset !important;
      //     }
      //   }
      // }
      align-items: center;
    }
    .item {
      :deep(.el-popover.el-popper) {
        // box-shadow: 0px -10px 32px 0px rgba(45, 47, 51, 0.18);
        padding: 16px 16px 16px 16px;
        font-size: 12px;
        line-height: 16px;
        color: #656565;
        .remind {
          color: #f13b35;
        }
      }
      position: relative;
      .el-tooltip__trigger {
        cursor: pointer;
        position: absolute;
        right: -40px;
        top: 5px;
        font-size: 24px;
      }
      .requirement {
        line-height: 34px;
      }
      margin-top: 24px;
      width: 520px;
      display: flex;
      justify-content: space-between;
      :deep(.el-select__popper) {
        top: 390px;
      }
      .text {
        height: 40px;
        line-height: 40px;
        position: absolute;
        top: 1px;
      }
      .radio {
        width: 400px;
        // height: 96px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        // position: relative;
        .el-radio.el-radio--large {
          height: 32px;
        }

        .explain1 {
          color: #999999;
          font-size: 14px;
          padding-left: 22px;
          // position: absolute;
          // top: 27px;
        }
        .explain2 {
          color: #999999;
          font-size: 14px;
          padding-left: 22px;
          // position: absolute;
          // top: 79px;
        }
      }
    }
    // .o-button {
    //   width: 150px;
    // }
    .el-form-item {
      .el-form-item__cotent {
        .el-form-item__error {
          right: 0;
        }
      }
      margin: 0;
      // .el-popover.el-popper {
      //   padding: 24px 16px 16px 16px;
      //   font-size: 12px;
      //   line-height: 16px;
      //   color: #656565;
      //   .remind {
      //     color: #f13b35;
      //   }
      // }
      // position: relative;
      // .el-tooltip__trigger {
      //   cursor: pointer;
      //   position: absolute;
      //   right: -40px;
      //   top: 5px;
      //   font-size: 24px;
      // }
      .requirement {
        line-height: 34px;
      }
      margin-top: 24px;
      width: 520px;
      display: flex;
      :deep(.el-form-item__content) {
        justify-content: space-between;
      }
      justify-content: space-between;
      :deep(.el-select__popper) {
        top: 390px;
      }
      .text {
        height: 40px;
        line-height: 40px;
      }
      .radio {
        width: 400px;
        display: flex;
        flex-direction: column;
        .explain {
          color: #999999;
          font-size: 14px;
        }
      }
    }
  }
  .o-button {
    margin-top: 48px;
  }
}
</style>
