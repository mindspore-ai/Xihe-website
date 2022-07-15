<script setup>
import { ref, watch, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import emptyImg from '@/assets/imgs/dataset-empty.png';

import { getDatasetData } from '@/api/api-dataset';
import { useUserInfoStore } from '@/stores';

const route = useRoute();
const router = useRouter();

const userInfoStore = useUserInfoStore();
const i18n = {
  emptyText: '暂未创建数据集，点击创建数据集立即创建',
  visitorEmpty: '该用户暂未创建任何数据集',
  searchEmpty: '无匹配数据集',
};
const isAuthentic = computed(() => {
  return route.params.user === userInfoStore.userName;
});
const props = defineProps({
  queryData: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
const modelCount = ref(0);
const modelData = ref([]);
let query = reactive({
  search: '',
  page: 1,
  size: 10,
  owner_name: route.params.user,
  order: '',
});
const emit = defineEmits(['getlivecount', 'domChange']);

function goDetail(user, modelName) {
  router.push({
    path: `/datasets/${user}/${modelName}`,
  });
}
function getUserDatasetData() {
  getDatasetData(query).then((res) => {
    if (res.count && res.results.status === 200) {
      if (res.count > 10) {
        emit('domChange', 76);
      }
      modelCount.value = res.count;
      modelData.value = res.results.data;
    } else {
      modelData.value = [];
    }
  });
}
function handleSizeChange(val) {
  if (modelCount.value / val < 8) {
    layout.value = layout.value.split(',').splice(0, 4).join(',');
  }
  query.size = val;
}

function handleCurrentChange(val) {
  query.page = val;
  document.documentElement.scrollTop = 0;
}

watch(
  query,
  () => {
    getUserDatasetData();
  },
  {
    deep: true,
    immediate: true,
  }
);
watch(props, () => {
  query.search = props.queryData.keyWord;
  query.order = props.queryData.order;
  query.page = 1;
});
</script>
<template>
  <div v-if="modelData.length" class="card-box">
    <div class="card-list">
      <o-card
        v-for="item in modelData"
        :key="item.id"
        card-type="dataset"
        :card-data="item"
        @click="goDetail(item.owner_name.name, item.name)"
      ></o-card>
    </div>
    <div v-if="modelCount > 10" class="pagination">
      <el-pagination
        :page-sizes="[10, 20, 50]"
        :current-page="query.page"
        :page-size="query.size"
        :total="modelCount"
        layout="sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
  <div v-else class="empty">
    <img class="empty-img" :src="emptyImg" />
    <p v-if="isAuthentic && !queryData.keyWord" class="empty-text">
      {{ i18n.emptyText }}
    </p>
    <p v-else-if="!isAuthentic && !queryData.keyWord" class="empty-text">
      {{ i18n.visitorEmpty }}
    </p>
    <p v-else class="empty-text">{{ i18n.searchEmpty }}</p>
  </div>
</template>

<style scoped lang="scss">
.card-box {
  width: 100%;
  .card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 24px;
    width: 100%;
    background-color: #fff;
    .moderl-head-right {
      display: flex;
      align-items: center;
      .o-icon {
        cursor: pointer;
        margin-left: 24px;
        font-size: 24px;
      }
    }
  }
  .card-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(200px, 1fr));
    column-gap: 24px;
    row-gap: 24px;
    margin-top: 24px;
  }
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 40px;
  }
}
.empty {
  position: absolute;
  top: calc(50% + 48px);
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  // height: 100%;
  flex-direction: column;
  .empty-img {
    width: 280px;
  }
  .empty-text {
    margin-top: 24px;
    font-size: 18px;
    color: #555555ff;
  }
}
</style>
