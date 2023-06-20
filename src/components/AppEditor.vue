<script setup>
import { onMounted, ref, onUnmounted, defineProps, defineEmits } from 'vue';
import * as monaco from 'monaco-editor';
import 'monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution';
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

self.MonacoEnvironment = {
  getWorker(id, label) {
    if (label === 'json') {
      return new jsonWorker();
    }
    return new EditorWorker();
  },
};

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  lang: {
    type: [String, Number],
    default: 'python',
  },
});
const language = ref('');
const fillLang = {
  py: 'python',
  js: 'javascrpit',
  md: 'markdown',
};
getLanguage();
function getLanguage() {
  if (fillLang[props.lang]) {
    language.value = fillLang[props.lang];
  } else if (language.value) {
    language.value = props.lang;
  } else {
    language.value = 'python';
  }
}
const emit = defineEmits(['update:modelValue']);

const dom = ref();

let instance = null;

onMounted(() => {
  const Model = monaco.editor.createModel(props.modelValue, language.value);
  instance = monaco.editor.create(dom.value, {
    model: Model,
    tabSize: 2,
    automaticLayout: true,
    wordWrap: 'on',
  });

  instance.onDidChangeModelContent(() => {
    const value = instance.getValue();
    emit('update:modelValue', value);
  });
});
onUnmounted(() => {
  instance.dispose();
});
</script>
<template>
  <div ref="dom" class="editor"></div>
</template>

<style scoped>
.editor {
  height: 560px;
  border: 1px solid #999;
  border-radius: 16px;
  overflow: hidden;
}
</style>
