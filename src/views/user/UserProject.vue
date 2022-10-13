<script setup>
import { ref, watch, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

import IconTime from '~icons/app/time';
import IconHeart from '~icons/app/heart';

import OIcon from '@/components/OIcon.vue';

import { getUserProjectData } from '@/api/api-user';
import { useUserInfoStore, useVisitorInfoStore } from '@/stores';

const userInfoStore = useUserInfoStore();
const visitorInfoStore = useVisitorInfoStore();

const route = useRoute();
const router = useRouter();
// let bool = userInfoStore.userName === route.query.userName;
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
  count_per_page: 12,
  // owner_name: route.params.user,
  sort_by: 'update_time',
});

const layout = ref('sizes, prev, pager, next, jumper');
const emit = defineEmits(['getlivecount', 'domChange']);

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
    // if (res.count && res.results.status === 200) {
    if (res.data.total > 12) {
      emit('domChange', 76);
    }
    avatarImg.value = res.data.avatar_id;
    projectCount.value = res.data.total;
    projectData.value = res.data;
    // } else {
    //   projectData.value = [];
    //   projectCount.value = res.count;
    // }
  });
}
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
      <div class="card-list">
        <div
          v-for="item in projectData.projects"
          :key="item.id"
          class="pro-card"
          @click="goDetail(item.owner, item.name)"
        >
          <div class="card-top">
            <img
              :src="`https://obs-xihe-beijing4.obs.cn-north-4.myhuaweicloud.com/xihe-img/project-img/proimg${item.cover_id}.png`"
              alt=""
            />
            <p class="title">{{ item.name }}</p>
            <div class="dig">
              <o-icon> <icon-heart></icon-heart> </o-icon>{{ item.like_count }}
            </div>
            <div class="card-modal"></div>
          </div>

          <div class="card-bottom">
            <div class="info">
              <div class="info-avata">
                <img :src="avatarImg" alt="" />
              </div>
              <div class="info-name">{{ item.owner }}</div>
            </div>
            <div class="time">
              <o-icon>
                <icon-time></icon-time>
              </o-icon>
              {{ item.updated_at.split(' ')[0] }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="projectData.total > 12" class="pagination">
        <el-pagination
          :page-sizes="[12, 24, 60]"
          :current-page="query.page"
          :page-size="query.count_per_page"
          :total="projectData.total"
          :layout="layout"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>

    <!-- <div v-else-if="projectCount === 0 && !bool" class="empty-status">
      <img src="@/assets/imgs/project-empty.png" alt="" />
      <p @click="setNewClick">该用户暂未创建任何项目</p>
    </div> -->

    <div v-else class="empty-status">
      <img src="@/assets/imgs/project-empty.png" alt="" />
      <!-- <p v-if="isAuthentic" @click="setNewClick">无匹配项目</p>
      <p v-else>该用户暂未创建任何模型</p> -->
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
  // width: 100%;
  // height: 100%;
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
        z-index: 5;
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
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
</style>
