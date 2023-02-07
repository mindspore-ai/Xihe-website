<script setup>
import { ref, reactive, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import emptyImg from '@/assets/imgs/model-empty.png';

import { getUserModelData } from '@/api/api-user';
import { useUserInfoStore, useVisitorInfoStore } from '@/stores';

const route = useRoute();
const router = useRouter();

const userInfoStore = useUserInfoStore();
const visitorInfoStore = useVisitorInfoStore();

// 是否是访客
const isAuthentic = computed(() => {
  return route.params.user === userInfoStore.userName;
});

// 当前用户信息
const userInfo = computed(() => {
  return isAuthentic.value ? userInfoStore : visitorInfoStore;
});

const i18n = {
  emptyText: '暂未创建模型，点击创建模型立即创建',
  searchEmpty: '无匹配模型',
  visitorEmpty: '该用户暂未创建任何模型',
};

const props = defineProps({
  queryData: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const layout = ref('sizes, prev, pager, next, jumper');
const emit = defineEmits(['getlivecount', 'dom-change']);

const avatarImg = ref('');
const modelCount = ref(0);
const modelData = ref([]);

let query = reactive({
  name: '',
  page_num: 1,
  count_per_page: 10,
  sort_by: '',
});

function getUserModel() {
  getUserModelData(query, userInfo.value.userName).then((res) => {
    if (res.data.total) {
      if (res.data.total > 10) {
        emit('dom-change', 76);
      }
      avatarImg.value = res.data.avatar_id;
      modelCount.value = res.data.total;
      modelData.value = res.data.models;
    } else {
      modelData.value = [];
    }
  });
}

function goDetail(user, modelName) {
  router.push({
    path: `/models/${user}/${modelName}`,
  });
}

function handleSizeChange(val) {
  if (modelCount.value / val < 8) {
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
    getUserModel();
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
  <div v-if="modelData.length" class="card-box">
    <div class="card-list">
      <app-card
        v-for="item in modelData"
        :key="item.id"
        :avatar-img="avatarImg"
        :card-data="item"
        @click="goDetail(item.owner, item.name)"
      ></app-card>
    </div>
    <div v-if="modelCount > 10" class="pagination">
      <el-pagination
        :page-sizes="[10, 20, 50]"
        :current-page="query.page"
        :page-size="query.count_per_page"
        :total="modelCount"
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
    position: relative;
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
