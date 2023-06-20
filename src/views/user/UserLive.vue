<script setup>
import { ref, reactive, computed, watch, defineEmits } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { getUserLive } from '@/api/api-user';
import emptyImg from '@/assets/imgs/live-empty.png';
import lovingHeartImg from '@/assets/icons/lovingHeart.png';
import creatingImg from '@/assets/icons/creating.png';
import forkImg from '@/assets/icons/fork.png';

import projectcard from '@/views/user/UserProjectcard.vue';
import livecard from '@/views/user/UserLivecard.vue';

import { useUserInfoStore, useVisitorInfoStore } from '@/stores';

const userInfoStore = useUserInfoStore();
const visitorInfoStore = useVisitorInfoStore();

const route = useRoute();
const router = useRouter();

const liveCount = ref(0);
const liveData = ref([]);
let queryData = reactive({
  search: null,
  page: 1,
  size: 6,
});
const i18n = {
  emptyText: '暂无动态',
};

// 是否是访客
const isAuthentic = computed(() => {
  return route.params.user === userInfoStore.userName;
});
// 当前用户信息
const userInfo = computed(() => {
  return isAuthentic.value ? userInfoStore : visitorInfoStore;
});

const emit = defineEmits(['getlivecount', 'dom-change']);

// 获得动态页面数据
function getLiveData() {
  getUserLive(userInfo.value.userName).then((res) => {
    if (res.data) {
      liveCount.value = res.data.length;
      liveData.value = res.data;
      if (liveCount.value > 6) {
        emit('dom-change', 76);
      }
    } else {
      liveData.value = [];
    }
  });
}
getLiveData();
watch(
  () => route,
  () => {
    if (route.name === 'userLives' && !route.hash) {
      getLiveData();
    }
  },
  {
    deep: true,
    // immediate: true,
  }
);

function goDetail(item) {
  if (item.resource.type === 'model') {
    router.push({
      path: `/models/${item.resource.owner.name}/${item.resource.name}`,
    });
  } else if (item.resource.type === 'dataset') {
    router.push({
      path: `/datasets/${item.resource.owner.name}/${item.resource.name}`,
    });
  } else if (item.resource.type === 'project') {
    router.push({
      path: `/projects/${item.resource.owner.name}/${item.resource.name}`,
    });
  }
}

const layout = ref('sizes, prev, pager, next, jumper');
function handleSizeChange(val) {
  if (liveCount.value / val < 8) {
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

function getCount() {
  emit('getlivecount', liveCount);
}
getCount();
</script>

<template>
  <div class="user-live">
    <div class="user-live-wrap">
      <div v-if="liveData.length" class="card-list">
        <div
          v-for="item in liveData.slice(
            (queryData.page - 1) * queryData.size,
            queryData.page * queryData.size
          )"
          :key="item.id"
          class="card-list-item"
        >
          <div class="card-title">
            <div v-if="item.type === 'like'" class="card-type">
              <img :src="lovingHeartImg" />
              <span>收藏了一个</span>
            </div>
            <div v-else-if="item.type === 'create'" class="card-type">
              <img :src="creatingImg" />
              <span>创建了一个</span>
            </div>
            <div v-else class="card-type">
              <img :src="forkImg" />
              <span>Fork了一个</span>
            </div>
            <span>
              {{
                item.resource.type === 'model'
                  ? '模型'
                  : item.resource.type === 'project'
                  ? '项目'
                  : '数据集'
              }}
            </span>
            <span class="item-title-time">{{ item.time }}</span>
          </div>
          <projectcard
            v-if="item.resource.type === 'project'"
            :card-data="item.resource"
            class="card-list-item-content"
            @click="goDetail(item)"
          ></projectcard>
          <livecard
            v-else
            :card-data="item"
            class="card-list-item-content"
            @click="goDetail(item)"
          ></livecard>
        </div>
      </div>
      <div v-else class="empty">
        <img class="empty-img" :src="emptyImg" />
        <p class="empty-text">{{ i18n.emptyText }}</p>
      </div>
    </div>
    <div v-if="liveCount > 6" class="pagination">
      <el-pagination
        :page-sizes="[6, 12, 18]"
        :current-page="queryData.page"
        :page-size="queryData.size"
        :total="liveCount"
        :layout="layout"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-live {
  .user-live-wrap {
    height: 100%;
    .card-list {
      width: 100%;
      &-item {
        :deep(.project-card) {
          border-radius: 16px;
          // .card-top {
          //   img {
          //     border-top-right-radius: 16px;
          //     border-top-left-radius: 16px;
          //   }
          // }
          // .card-bottom {
          //   border-bottom-right-radius: 16px;
          //   border-bottom-left-radius: 16px;
          // }
          // &:hover {
          //   .cover {
          //     transform: scale(1.05);
          //   }
          // }
        }
        & + .card-list-item {
          margin-top: 30px;
        }

        width: 100%;
        .card-title {
          font-size: 18px;
          color: #000;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          .card-type {
            display: flex;
            align-items: center;
            img {
              width: 24px;
              margin-right: 8px;
            }
          }
          .item-title-time {
            font-size: 16px;
            line-height: 18px;
            color: #555;
            margin-left: 24px;
          }
        }
        .card-list-item-content {
          // box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
          &:hover {
            box-shadow: 0px 1px 30px 0px rgba(0, 0, 0, 0.05);
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
}
</style>
