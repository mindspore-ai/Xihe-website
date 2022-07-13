<script setup>
import { ref, watch, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

import IconTime from '~icons/app/time';
import IconHeart from '~icons/app/heart';

import OIcon from '@/components/OIcon.vue';

import { getProjectData } from '@/api/api-project';
import { useUserInfoStore } from '@/stores';

const userInfoStore = useUserInfoStore();
const route = useRoute();
const router = useRouter();
let boo = userInfoStore.userName === route.query.userName;
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
  search: '',
  page: 1,
  size: 12,
  owner_name: route.params.user,
  order: '',
});

const layout = ref('sizes, prev, pager, next, jumper');
const emit = defineEmits(['getlivecount', 'domChange']);

function handleSizeChange(val) {
  if (projectCount.value / val < 8) {
    layout.value = layout.value.split(',').splice(0, 4).join(',');
  }
  query.size = val;
}

function handleCurrentChange(val) {
  query.page = val;
  document.documentElement.scrollTop = 0;
}

function getUserProject() {
  getProjectData(query).then((res) => {
    if (res.count && res.results.status === 200) {
      if (res.count > 12) {
        emit('domChange', 76);
      }
      projectCount.value = res.count;
      projectData.value = res.results.data;
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
    path: `/new/projects`,
  });
}
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
watch(props, () => {
  query.search = props.queryData.keyWord;
  query.order = props.queryData.order;
  query.page = 1;
});
</script>
<template>
  <div>
    <div v-if="projectCount > 0" class="project-card">
      <div class="card-list">
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
              <div class="info-name">{{ item.owner_name.name }}</div>
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
      <div v-if="projectCount > 12" class="pagination">
        <el-pagination
          :page-sizes="[12, 24, 60]"
          :current-page="query.page"
          :page-size="query.size"
          :total="projectCount"
          :layout="layout"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
    <div v-else-if="projectCount === 0 && !boo" class="empty-status">
      <img src="@/assets/imgs/project-empty.png" alt="" />
      <p @click="setNewClick">无项目</p>
    </div>
    <div v-else class="empty-status">
      <img src="@/assets/imgs/project-empty.png" alt="" />
      <p @click="setNewClick">暂未创建项目，点击创建项目</p>
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
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
</style>
