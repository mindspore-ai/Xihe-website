<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import emptyImg from '@/assets/imgs/model-empty.png';

import { getModelData } from '@/api/api-model';
import { useUserInfoStore, useVistorInfoStore } from '@/stores';

const userInfoStore = useUserInfoStore();
const vistorInfoStore = useVistorInfoStore();

const route = useRoute();
const router = useRouter();

const isAuthentic = computed(() => {
  return route.params.user === userInfoStore.userName;
});

const i18n = {
  emptyText: '暂未创建模型，点击创建模型立即创建',
};

const props = defineProps({
  queryData: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const order = computed(() => {
  return props.queryData.order;
});
const keyWord = computed(() => {
  return props.queryData.keyWord;
});

// 当前用户信息
const userInfo = computed(() => {
  return isAuthentic.value ? userInfoStore : vistorInfoStore;
});

const modelCount = ref(0);
const modelData = ref([]);
let query = reactive({
  search: keyWord,
  page: 1,
  size: 10,
  owner_name: route.params.user,
  order: order,
});

function getUserModelData() {
  getModelData(query).then((res) => {
    if (res.count && res.results.status === 200) {
      modelCount.value = res.count;
      modelData.value = res.results.data;
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
  query.size = val;
}

function handleCurrentChange(val) {
  query.page = val;
  document.documentElement.scrollTop = 0;
}

const test = ref(null);

watch(
  [query, props],
  () => {
    getUserModelData();
  },
  {
    deep: true,
    immediate: true,
  }
);
// watch(
//   props,
//   (val) => {
//     console.log(val);
//   },
//   {
//     deep: true,
//   }
// );
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
