<script setup>
import { ref, watch, reactive, computed, defineProps, defineEmits } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

import { getUserProjectData } from '@/api/api-user';
import { useUserInfoStore, useVisitorInfoStore } from '@/stores';

import projectcard from '@/views/user/UserProjectcard.vue';

const userInfoStore = useUserInfoStore();
const visitorInfoStore = useVisitorInfoStore();

const route = useRoute();
const router = useRouter();
// 是否是访客
const isAuthentic = computed(() => {
  return route.params.user === userInfoStore.userName;
});

// 当前用户信息
const userInfo = computed(() => {
  return isAuthentic.value ? userInfoStore : visitorInfoStore;
});
const i18n = {
  emptyText: '暂未创建项目，点击创建项目立即创建',
  searchEmpty: '无匹配项目',
  visitorEmpty: '该用户暂未创建任何项目',
};
const avatarImg = ref('');
const projectCount = ref(0);
const projectData = ref([]);

const props = defineProps({
  queryData: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

let query = reactive({
  name: '',
  page_num: 1,
  count_per_page: 5,
  sort_by: 'update_time',
});

const layout = ref('sizes, prev, pager, next, jumper');
const emit = defineEmits(['getlivecount', 'dom-change']);

function handleSizeChange(val) {
  if (projectCount.value / val < 8) {
    layout.value = layout.value.split(',').splice(0, 4).join(',');
  }
  query.count_per_page = val;
}

function handleCurrentChange(val) {
  query.page_num = val;
  document.documentElement.scrollTop = 0;
}

function getUserProject() {
  getUserProjectData(query, userInfo.value.userName).then((res) => {
    if (res.data.total) {
      if (res.data.total > 5) {
        emit('dom-change', 76);
      }
      avatarImg.value = res.data.avatar_id;
      projectCount.value = res.data.total;
      projectData.value = res.data;
    } else {
      projectData.value = [];
    }
  });
}
function goDetail(user, name) {
  router.push({
    path: `/projects/${user}/${name}`,
  });
}

function setNewClick() {
  router.push({
    path: '/new/projects',
  });
}
watch(props, () => {
  query.name = props.queryData.keyWord;
  query.sort_by = props.queryData.order;
  query.page_num = 1;
});
watch(
  query,
  () => {
    getUserProject();
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>
<template>
  <div>
    <div v-if="projectData.total" class="project-card">
      <div v-for="item in projectData.projects" :key="item.id" class="list">
        <projectcard
          :card-data="item"
          :avatar-id="projectData.avatar_id"
          :owner="projectData.owner"
          class="card-list-item-content"
          @click="goDetail(item.owner, item.name)"
        ></projectcard>
      </div>
      <div v-if="projectData.total > 5" class="pagination">
        <el-pagination
          :page-sizes="[5, 10, 15]"
          :current-page="query.page"
          :page-size="query.count_per_page"
          :total="projectData.total"
          :layout="layout"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>

    <div v-else class="empty-status">
      <img src="@/assets/imgs/project-empty.png" alt="" />
      <p
        v-if="isAuthentic && !queryData.keyWord"
        class="empty-text"
        @click="setNewClick"
      >
        {{ i18n.emptyText }}
      </p>
      <p v-else-if="!isAuthentic && !queryData.keyWord" class="empty-text">
        {{ i18n.visitorEmpty }}
      </p>
      <p v-else class="empty-text">{{ i18n.searchEmpty }}</p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.empty-status {
  position: absolute;
  top: calc(50% + 48px);
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
    border-radius: 16px;
    box-shadow: 0px 1px 5px 0px rgb(45 47 51 / 10%);
    &:hover {
      box-shadow: 0px 6px 18px 0px rgba(13, 141, 255, 0.14);
    }
    .card-top {
      border-radius: 16px;
      img {
        border-top-right-radius: 16px;
        border-top-left-radius: 16px;
      }
    }
    .card-bottom {
      border-bottom-right-radius: 16px;
      border-bottom-left-radius: 16px;
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
        display: flex;
        align-items: center;
        justify-content: center;
        width: 84%;
        font-size: 18px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        span {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
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
        border-radius: 16px;
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
.list {
  .project-card {
    margin-top: 24px;
    border-radius: 16px;
    // &:hover {
    //   :deep(.cover) {
    //     transform: scale(1.05);
    //   }
    // }
  }
}
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
</style>
