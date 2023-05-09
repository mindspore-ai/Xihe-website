<script setup>
import { ref, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { getUserCollection } from '@/api/api-user';
import emptyImg from '@/assets/imgs/live-empty.png';
import lovingHeartImg from '@/assets/icons/lovingHeart.png';
import projectcard from '@/views/user/UserProjectcard.vue';
import livecard from '@/views/user/UserLivecard.vue';

import { useUserInfoStore, useVisitorInfoStore } from '@/stores';

const userInfoStore = useUserInfoStore();
const visitorInfoStore = useVisitorInfoStore();

const route = useRoute();
const router = useRouter();

const collectionCount = ref(0);
let queryData = reactive({
  search: null,
  page: 1,
  size: 6,
});

const collectionData = ref([]);
const i18n = {
  emptyText: '暂无收藏',
};
// 是否是访客
const isAuthentic = computed(() => {
  return route.params.user === userInfoStore.userName;
});
// 当前用户信息
const userInfo = computed(() => {
  return isAuthentic.value ? userInfoStore : visitorInfoStore;
});

const emit = defineEmits(['dom-change']);
// 获得收藏页面数据
getUserCollection(userInfo.value.userName).then((res) => {
  if (res.data) {
    collectionCount.value = res.data.length;
    collectionData.value = res.data;
    if (collectionCount.value > 6) {
      emit('dom-change', 76);
    }
  } else {
    collectionData.value = [];
  }
});

function goDetail(item) {
  if (item.resource.type.indexOf('model') !== -1) {
    router.push({
      path: `/models/${item.resource.owner.name}/${item.resource.name}`,
    });
  } else if (item.resource.type.indexOf('dataset') !== -1) {
    router.push({
      path: `/datasets/${item.resource.owner.name}/${item.resource.name}`,
    });
  } else if (item.resource.type.indexOf('project') !== -1) {
    router.push({
      path: `/projects/${item.resource.owner.name}/${item.resource.name}`,
    });
  }
}

const layout = ref('sizes, prev, pager, next, jumper');
function handleSizeChange(val) {
  if (collectionCount.value / val < 8) {
    layout.value = layout.value.split(',').splice(0, 4).join(',');
  }
  queryData.size = val;
}

function handleCurrentChange(val) {
  queryData.page = val;
  toTop();
}

function toTop() {
  document.documentElement.scrollTop = 0;
}
</script>
<template>
  <div class="user-collection">
    <div class="user-collection-wrap">
      <div v-if="collectionData.length" class="collection-list">
        <div
          v-for="item in collectionData.slice(
            (queryData.page - 1) * queryData.size,
            queryData.page * queryData.size
          )"
          :key="item.id"
          class="collection-list-item"
        >
          <div class="collection-list-item-title">
            <img :src="lovingHeartImg" />
            <span> 收藏了一个</span>
            <span>
              {{
                item.resource.type.includes('model')
                  ? '模型'
                  : item.resource.type.includes('project')
                  ? '项目'
                  : '数据集'
              }}
            </span>
            <span class="item-title-time">{{ item.time }}</span>
          </div>
          <projectcard
            v-if="item.resource.type.includes('project')"
            :card-data="item"
            class="collection-list-item-content"
            @click="goDetail(item)"
          ></projectcard>
          <livecard
            v-else
            :card-data="item"
            class="collection-list-item-content2"
            @click="goDetail(item)"
          ></livecard>
        </div>
      </div>
      <div v-else class="empty">
        <img class="empty-img" :src="emptyImg" />
        <p class="empty-text">{{ i18n.emptyText }}</p>
      </div>
    </div>
    <div v-if="collectionCount > 6" class="pagination">
      <el-pagination
        :page-sizes="[6, 12, 18]"
        :current-page="queryData.page"
        :page-size="queryData.size"
        :total="collectionCount"
        :layout="layout"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.collection-list-item {
  :deep(.project-card) {
    border-radius: 16px;
    .card-top {
      img {
        border-top-right-radius: 16px;
        border-top-left-radius: 16px;
      }
    }
    .card-bottom {
      border-bottom-right-radius: 16px;
      border-bottom-left-radius: 16px;
    }
  }
}
.user-collection-wrap {
  height: 100%;
  .collection-list {
    width: 100%;
    &-item {
      margin-bottom: 30px;
      width: 100%;
      &-title {
        font-size: 18px;
        color: #000;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        img {
          width: 24px;
          margin-right: 8px;
        }
        .item-title-time {
          font-size: 16px;
          line-height: 18px;
          color: #555;
          margin-left: 24px;
        }
      }
      &-content2 {
        box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
        &:hover {
          box-shadow: 0px 6px 18px 0px rgba(13, 141, 255, 0.14);
        }
      }
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
      height: 206px;
    }
    .empty-text {
      margin-top: 24px;
      font-size: 18px;
      color: #555555ff;
    }
  }
}
.pagination {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}
</style>
