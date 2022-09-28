<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

import OButton from '@/components/OButton.vue';

import { handleGenerateCode } from '@/api/api-modelzoo.js';

import * as monaco from 'monaco-editor';
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution';
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';

import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import { ElMessage } from 'element-plus';

const tabsList = ref([
  {
    name: 'Python',
    language: 'python',
    code: 'from typing import List \n\ndef has_close_elements(numbers: List[float], threshold: float) -> bool:\n    """ Check if in given list of numbers, are any two numbers closer to each other than\n    given threshold.\n    >>> has_close_elements([1.0, 2.0, 3.0], 0.5)\n    False\n    >>> has_close_elements([1.0, 2.8, 3.0, 4.0, 5.0, 2.0], 0.3)\n    True\n    """"\n',
  },
  {
    name: 'JavaScript',
    language: 'javascript',
    code: '/* Check if in given list of numbers, are any two numbers closer to each other than\n given threshold.\n >>> hasCloseElements([1.0, 2.0, 3.0], 0.5)\n false\n >>> hasCloseElements([1.0, 2.8, 3.0, 4.0, 5.0, 2.0], 0.3)\n true\n */\nconst hasCloseElements = (numbers, threshold) => {',
  },
  {
    name: 'C++',
    language: 'c',
    code: '/*\n Check if in given vector of numbers, are any two numbers closer to each other than\n given threshold.\n >>> has_close_elements({1.0, 2.0, 3.0}, 0.5)\n false\n >>> has_close_elements({1.0, 2.8, 3.0, 4.0, 5.0, 2.0}, 0.3)\n true\n */\n#include<stdio.h>\n#include<vector>\n#include<math.h>\nusing namespace std;\nbool has_close_elements(vector<float> numbers, float threshold) {',
  },
  {
    name: 'Go',
    language: 'go',
    code: 'import (\n    "math"\n)\n\n// Check if in given list of numbers, are any two numbers closer to each other than given threshold.\n// >>> HasCloseElements([]float64{1.0, 2.0, 3.0}, 0.5)\n// false\n// >>> HasCloseElements([]float64{1.0, 2.8, 3.0, 4.0, 5.0, 2.0}, 0.3)\n// true\nfunc HasCloseElements(numbers []float64, threshold float64) bool {',
  },
  {
    name: 'Java',
    language: 'java',
    code: 'import java.util.*;\nimport java.lang.*;\n\nclass Solution {\n   /**\n   Check if in given list of numbers, are any two numbers closer to each other than given threshold.\n   >>> hasCloseElements(Arrays.asList(1.0, 2.0, 3.0), 0.5)\n   false\n   >>> hasCloseElements(Arrays.asList(1.0, 2.8, 3.0, 4.0, 5.0, 2.0), 0.3)\n   true\n   */\n\n   public boolean hasCloseElements(List<Double> numbers, double threshold) {',
  },
  { name: '', text: '', value: '' },
]);

const activeIndex = ref(0);

function handleTabClick(i, item) {
  if (i === 5) return;
  activeIndex.value = i;

  isDisabled.value = false;

  instance.dispose();
  init(item);
}

const edit = ref();

let instance = null;

self.MonacoEnvironment = {
  getWorker: function (_, label) {
    if (label === 'json') {
      return new jsonWorker();
    } else if (label === 'typescript' || label === 'javascript') {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

// 获取文本内容
function getValue() {
  return instance.getValue();
}

function init(item) {
  instance = monaco.editor.create(edit.value, {
    value: item.code,
    language: item.language,
    theme: 'vs-dark',
    fontSize: 18,
    automaticLayout: true,
  });

  instance.onDidChangeModelContent(() => {
    tabsList.value[activeIndex.value].code = instance.getValue();
  });
}

const isDisabled = ref(false);

function hanleGenerateCode() {
  isDisabled.value = true;
  handleGenerateCode({
    content: tabsList.value[activeIndex.value].code,
    n: 1,
    lang: tabsList.value[activeIndex.value].name,
  }).then((res) => {
    // console.log(res);

    if (res.status === 200) {
      isDisabled.value = false;

      tabsList.value[activeIndex.value].code =
        tabsList.value[activeIndex.value].code + res.data;

      instance.dispose();
      init(tabsList.value[activeIndex.value]);
    } else if (res.status === -1) {
      ElMessage({
        type: 'error',
        message: res.msg,
      });
    }
  });
}

onMounted(() => {
  init(tabsList.value[0]);
});

onUnmounted(() => {
  instance.dispose();
});
</script>
<template>
  <div class="experience">
    <div class="experience-head">
      <p class="experience-head-title">代码生成（Code Generation）</p>
      <p class="experience-head-text">
        您可以用自然语言编写描述，点击生成按钮，模型将生成相关代码。
        也可以直接给出一些代码片段，模型会自动补全代码。
      </p>
    </div>

    <div class="experience-body">
      <div class="edit-tabs">
        <p
          v-for="(item, index) in tabsList"
          :key="item"
          class="tab-item"
          :class="activeIndex === index ? 'active' : ''"
          @click="handleTabClick(index, item)"
        >
          {{ item.name }}
        </p>
      </div>

      <div ref="edit" class="editor"></div>

      <div class="empty" @click="getValue"></div>

      <div class="create-btn">
        <o-button
          type="primary"
          :disabled="isDisabled"
          @click="hanleGenerateCode"
          >Generate Code</o-button
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.experience {
  &-head {
    &-title {
      font-size: 36px;
      font-weight: 300;
      color: #000000;
      line-height: 48px;
      text-align: center;
    }

    &-text {
      font-size: 18px;
      font-weight: 400;
      color: #555555;
      line-height: 24px;
      margin-top: 24px;
    }
  }

  &-body {
    margin-top: 24px;
    border-radius: 0 0 16px 16px;
    display: flex;
    flex-direction: column;
    .editor {
      height: 738px;
      border-radius: 0 0 16px 16px;
    }

    .edit-tabs {
      display: flex;
      background: #1e1e1e;
      border-radius: 16px 16px 0 0;

      .active {
        color: #0d8dff !important;
        background: #1e1e1e !important;
      }

      .tab-item {
        padding: 24px 40px;
        font-size: 18px;
        font-weight: 400;
        color: #c0c1c0;
        line-height: 33px;
        background: #323232;
        margin-right: 4px;
        cursor: pointer;
        &:first-child {
          border-radius: 16px 0 0 0;
        }

        &:last-child {
          flex: 1;
          margin-right: 0;
          border-radius: 0 16px 0 0;
          cursor: default;
        }
      }
    }
    .empty {
      height: 16px;
      background: #323232;
      border-radius: 0 0 16px 16px;
    }
    .create-btn {
      align-self: flex-end;
      margin-top: 24px;
    }
  }
}
</style>
