<script setup>
import { ref, watch, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import emptyImg from '@/assets/imgs/dataset-empty.png';

import { getUserDatasetData } from '@/api/api-user';
import { useUserInfoStore, useVisitorInfoStore } from '@/stores';

const route = useRoute();
const router = useRouter();

const userInfoStore = useUserInfoStore();
const visitorInfoStore = useVisitorInfoStore();
const i18n = {
  emptyText: '暂未创建数据集，点击创建数据集立即创建',
  visitorEmpty: '该用户暂未创建任何数据集',
  searchEmpty: '无匹配数据集',
};
// 是否是访客
const isAuthentic = computed(() => {
  return route.params.user === userInfoStore.userName;
});

// 当前用户信息
const userInfo = computed(() => {
  return isAuthentic.value ? userInfoStore : visitorInfoStore;
});
const props = defineProps({
  queryData: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
const avatarImg = ref('');
const datasetCount = ref(0);
const datasetData = ref([]);
let query = reactive({
  name: '',
  page_num: 1,
  count_per_page: 10,
  sort_by: '',
});

const layout = ref('sizes, prev, pager, next, jumper');
const emit = defineEmits(['getlivecount', 'domChange']);

function goDetail(user, modelName) {
  router.push({
    path: `/datasets/${user}/${modelName}`,
  });
}
function getDatasetData() {
  getUserDatasetData(query, userInfo.value.userName).then((res) => {
    if (res.data.total) {
      if (res.data.total > 10) {
        emit('domChange', 76);
      }
      avatarImg.value = res.data.avatar_id;
      datasetCount.value = res.data.total;
      datasetData.value = res.data.datasets;
    } else {
      datasetData.value = [];
    }
  });
}
function handleSizeChange(val) {
  if (datasetCount.value / val < 8) {
    layout.value = layout.value.split(',').splice(0, 4).join(',');
  }
  query.count_per_page = val;
}

function handleCurrentChange(val) {
  query.page_num = val;
  document.documentElement.scrollTop = 0;
}

watch(
  query,
  () => {
    getDatasetData();
  },
  {
    deep: true,
    immediate: true,
  }
);
watch(props, () => {
  query.name = props.queryData.keyWord;
  query.sort_by = props.queryData.order;
  query.page_num = 1;
});
</script>
<template>
  <div v-if="datasetData.length" class="card-box">
    <div class="card-list">
      <o-card
        v-for="item in datasetData"
        :key="item.id"
        :avatar-img="avatarImg"
        card-type="dataset"
        :card-data="item"
        @click="goDetail(item.owner, item.name)"
      ></o-card>
    </div>
    <div v-if="datasetCount > 10" class="pagination">
      <el-pagination
        :page-sizes="[10, 20, 50]"
        :current-page="query.page"
        :page-size="query.count_per_page"
        :total="datasetCount"
        :layout="layout"
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
