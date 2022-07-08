<script setup>
import { ref, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { getUserLive } from '@/api/api-user';
import emptyImg from '@/assets/imgs/live-empty.png';
import projectcard from '@/views/user/UserProjectcard.vue';
import livecard from '@/views/user/UserLivecard.vue';

import { useUserInfoStore, useVistorInfoStore } from '@/stores';

const userInfoStore = useUserInfoStore();
const vistorInfoStore = useVistorInfoStore();

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
  return isAuthentic.value ? userInfoStore : vistorInfoStore;
});

const emit = defineEmits(['getlivecount', 'domChange']);

// 获得动态页面数据
getUserLive(userInfo.value.id).then((res) => {
  if (res.status === 200 && res.data.length) {
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
  if (item.type.indexOf('模型') > -1) {
    router.push({
      path: `/models/${item.owner.name}/${item.name}`,
    });
  } else if (item.type.indexOf('数据集') > -1) {
    router.push({
      path: `/datasets/${item.owner.name}/${item.name}`,
    });
  } else if (item.type.indexOf('项目') > -1) {
    router.push({
      path: `/projects/${item.owner.name}/${item.name}`,
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
  <div>
    <div class="user-live">
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
            <img
              v-if="item.type.includes('点赞')"
              src="@/assets/icons/lovingHeart.png"
            />
            <img v-else src="@/assets/icons/creating.png" />
            <span>
              {{
                item.type.includes('点赞') ? '收藏了一个' : '创建了一个'
              }}</span
            >
            <span>
              {{
                item.type.includes('模型')
                  ? '模型'
                  : item.type.includes('数据集')
                  ? '数据集'
                  : '项目'
              }}
            </span>
            <span class="item-title-time">{{
              item.time.substring(0, 10)
            }}</span>
          </div>
          <projectcard
            v-if="item.type.includes('项目')"
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
</style>
