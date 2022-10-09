<script setup>
import { ref, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { getUserLive } from '@/api/api-user';
import emptyImg from '@/assets/imgs/live-empty.png';
import lovingHeartImg from '@/assets/icons/lovingHeart.png';
import creatingImg from '@/assets/icons/creating.png';

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

const emit = defineEmits(['getlivecount', 'domChange']);

// 获得动态页面数据
getUserLive(userInfo.value.userName).then((res) => {
  // console.log('动态信息: ', res);
  if (res.data) {
    liveCount.value = res.data.length;
    liveData.value = res.data;
    if (liveCount.value > 6) {
      emit('domChange', 76);
    }
  } else {
    liveData.value = [];
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
          <div class="card-list-item-title">
            <img v-if="item.type.includes('like')" :src="lovingHeartImg" />
            <img v-else :src="creatingImg" />
            <span>
              {{
                item.type.includes('like') ? '收藏了一个' : '创建了一个'
              }}</span
            >
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
            class="card-list-item-content"
            @click="goDetail(item)"
          ></projectcard>
          <livecard
            v-else
            :card-data="item"
            class="card-list-item-content2"
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
        & + .card-list-item {
          margin-top: 30px;
        }

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
        .card-list-item-content2 {
          // box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
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
}
</style>
