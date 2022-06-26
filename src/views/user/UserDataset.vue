<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import emptyImg from '@/assets/empty/dataset-empty.png';

import { getUserDatasetData } from '@/api/api-user';
// import { getModelData } from '@/api/api-model';
import { useUserInfoStore, useVistorInfoStore } from '@/stores';

const userInfoStore = useUserInfoStore();
const vistorInfoStore = useVistorInfoStore();

const route = useRoute();
const router = useRouter();

const isAuthentic = computed(() => {
  return route.params.user === userInfoStore.userName;
});

const i18n = {
  emptyText: '暂未创建数据集，点击创建数据集立即创建',
};

// 当前用户信息
const userInfo = computed(() => {
  return isAuthentic.value ? userInfoStore : vistorInfoStore;
});

const modelCount = ref(0);
const modelData = ref([]);
let query = reactive({
  search: null,
  page: 1,
  size: 10,
  task: null,
  libraries: null,
  licenses: null,
  model_format: null,
  device_target: null,
  relate_datasets: null,
  ordering: null,
});
query.search = route.query.search;

getUserDatasetData(userInfo.value.id).then((res) => {
  if (res.status === 200 && res.data.length) {
    modelCount.value = res.data.length;
    modelData.value = res.data;
  } else {
    modelData.value = [];
  }
});

function goDetail(user, modelName) {
  router.push({
    path: `/datasets/${user}/${modelName}/card`,
  });
}

function handleSizeChange(val) {
  query.size = val;
}
function handleCurrentChange(val) {
  query.page = val;
  let lis = document.querySelectorAll('.el-pager li');
  lis[val - 1].addEventListener('mousedown', function () {
    lis[val - 1].classList.add('active');
  });
}

const test = ref(null);

onMounted(() => {
  // renderCondition.value = i18n.screenCondition;
  // 分页器
  let span = document.querySelectorAll('.el-select-dropdown__item span');
  let spans = Array.from(span);
  span = spans.map((item) => {
    let i = item.__vnode.children.split('').indexOf('条');
    return item.__vnode.children.substring(0, i);
  });
  span.forEach((item, index) => {
    document
      .querySelectorAll('.el-select-dropdown__item span')
      .forEach((it, i) => {
        if (index == i) {
          it.innerHTML = item;
        }
      });
  });
});
</script>
<template>
  <div v-if="modelData.length" ref="test" class="card-box">
    <div class="card-list">
      <o-card
        v-for="item in modelData"
        :key="item.id"
        card-type="dataset"
        :card-data="item"
        @click="goDetail(item.owner_name.name, item.name)"
      ></o-card>
    </div>
    <div class="pagination">
      <el-pagination
        :page-sizes="[10, 20, 50]"
        :current-page="query.page"
        :page-size="query.size"
        :total="modelCount"
        hide-on-single-page
        layout="sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
  <div v-else class="empty">
    <img class="empty-img" :src="emptyImg" />
    <p class="empty-text">{{ i18n.emptyText }}</p>
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
    margin-top: 24px;
  }
}
.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
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
