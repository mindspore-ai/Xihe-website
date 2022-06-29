<script setup>
import { ref, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

import IconTime from '~icons/app/time';
import IconHeart from '~icons/app/heart';

import OIcon from '@/components/OIcon.vue';

import { getProjectData } from '@/api/api-user';

import { useUserInfoStore, useVistorInfoStore } from '@/stores';

/* 个人排序（暂时不支持） */
// const props = defineProps({
//   orderValue: {
//     type: String,
//     default: 'name',
//   },
// });

// watch(props, (newProps) => {
//   queryData.order = newProps.orderValue;
//   getUserProject(queryData);
// });

const userInfoStore = useUserInfoStore();
const vistorInfoStore = useVistorInfoStore();

const route = useRoute();
const router = useRouter();

const isAuthentic = computed(() => {
  return route.params.user === userInfoStore.userName;
});

// 当前用户信息
const userInfo = computed(() => {
  return isAuthentic.value ? userInfoStore : vistorInfoStore;
});

const projectCount = ref(0);
const projectData = ref([]);

const queryData = reactive({
  page: 1,
  size: 10,
  search: null,
  tags: null,
  sdk: null,
  // task_cate: null,
  licenses: null,
  status: null,
});
queryData.search = route.query.search;

function getUserProject(query) {
  getProjectData(query).then((res) => {
    if (res.status === 200 && res.data.length) {
      projectCount.value = res.data.length;
      projectData.value = res.data;
    } else {
      projectData.value = [];
    }
  });
}
getUserProject(userInfo.value.id);
function goDetail(user, name) {
  router.push({
    path: `/projects/${user}/${name}`,
  });
}

function setNewClick() {
  router.push({
    path: `/new/projects`,
  });
}
</script>
<template>
  <div v-if="projectCount > 0" class="card-list">
    <div
      v-for="item in projectData"
      :key="item.id"
      class="pro-card"
      @click="goDetail(item.owner_name.name, item.name)"
    >
      <div class="card-top">
        <img :src="item.photo_url" alt="" />
        <p class="title">{{ item.name }}</p>
        <div class="dig">
          <o-icon> <icon-heart></icon-heart> </o-icon>{{ item.digg_count }}
        </div>
        <div class="card-modal"></div>
      </div>

      <div class="card-bottom">
        <div class="info">
          <div class="info-avata">
            <img :src="item.owner_name.avatar_url" alt="" />
          </div>
          <div class="info-name">{{ item.owner_name.nickname }}</div>
        </div>
        <div class="time">
          <o-icon>
            <icon-time></icon-time>
          </o-icon>
          {{ item.update_date_time.split(' ')[0] }}
        </div>
      </div>
    </div>
  </div>
  <div v-else class="empty-status">
    <img src="@/assets/empty/project-empty.png" alt="" />
    <p @click="setNewClick">暂未创建项目，点击创建项目</p>
  </div>
</template>
<style lang="scss" scoped>
.empty-status {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  img {
    width: 280px;
    height: 206px;
  }
  p {
    font-size: 18px;
    color: rgba(85, 85, 85, 1);
    margin-top: 24px;
    cursor: pointer;
  }
}
.card-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(200px, 1fr));
  column-gap: 24px;
  row-gap: 24px;
  margin-top: 24px;

  .pro-card {
    cursor: pointer;
    box-shadow: 0px 1px 5px 0px rgb(45 47 51 / 10%);
    &:hover {
      box-shadow: 0px 6px 18px 0px rgba(13, 141, 255, 0.14);
    }
    .o-icon {
      margin-right: 2px;
    }
    .card-top {
      height: 169px;
      position: relative;
      color: #fff;
      img {
        width: 100%;
        height: 100%;
      }
      .title {
        font-size: 18px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 100;
      }
      .dig {
        position: absolute;
        right: 16px;
        top: 17px;
        font-size: 12px;
        display: flex;
        align-items: center;
        z-index: 6;
        svg {
          fill: #fff;
        }
      }
      .card-modal {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    .card-bottom {
      height: 62px;
      padding: 16px 24px 24px 24px;
      display: flex;
      justify-content: space-between;
      line-height: 22px;
      background-color: #fff;
      .info {
        display: flex;
        .info-avata {
          margin-right: 8px;
          img {
            width: 22px;
            height: 22px;
            border-radius: 50%;
          }
        }
        .info-name {
          width: 80px;
          height: 22px;
          font-size: 14px;
        }
      }
      .time {
        font-size: 12px;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>