<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { goAuthorize } from '@/shared/login';
import { ArrowRight } from '@element-plus/icons-vue';
import IconStar from '~icons/app/Star';

import OButton from '@/components/OButton.vue';

import { useUserInfoStore, useVisitorInfoStore } from '@/stores';
import { getUserDig } from '@/api/api-user';

const userInfoStore = useUserInfoStore();
const visitorInfoStore = useVisitorInfoStore();
const route = useRoute();
// const router = useRouter();

// 是否是访客
const isAuthentic = computed(() => {
  return route.params.user === userInfoStore.userName;
});
// 当前用户信息
const userInfo = computed(() => {
  return isAuthentic.value ? userInfoStore : visitorInfoStore;
});
let queryData = reactive({
  search: null,
  page: 1,
  size: 6,
});
// 登录用户关注列表
const loginFollowList = computed(() => {
  return userInfoStore.followList;
});

// 登录用户关注id列表
let loginFollowIdList = computed(() =>
  loginFollowList.value.map((val) => val.id)
);

// 当前用户粉丝列表
const currentFansList = computed(() => {
  return userInfo.value.fansList;
});

const emit = defineEmits(['domChange']);
watch(
  () => {
    return currentFansList.value.length;
  },
  (val) => {
    if (val > 6) {
      emit('domChange', 74);
    }
  },
  { immediate: true }
);

// 用于判断按钮的内容状态
function watchFansList() {
  currentFansList.value.forEach((val) => {
    if (loginFollowIdList.value.indexOf(val.id) !== -1) {
      val.isFollow = true;
    } else {
      val.isFollow = false;
    }
  });
}

watchFansList();

watch(
  () => currentFansList.value,
  () => {
    watchFansList();
  }
);

// 关注用户or点赞
function getFollow(userId, fans) {
  // 如果用户没有登录，则跳转到登录页面
  if (!userInfoStore.id) {
    goAuthorize();
  } else {
    try {
      getUserDig({ userId, fans }).then((res) => {
        if (res.status === 200) {
          if (loginFollowIdList.value.indexOf(fans.id) !== -1) {
            let index = loginFollowIdList.value.indexOf(fans.id);
            loginFollowList.value.splice(index, 1);
          } else {
            loginFollowList.value.push(fans);
          }
        }
        fans.isFollow = !fans.isFollow;
      });
    } catch (error) {
      console.error(error);
    }
  }
}

// 分页器
const layout = ref('sizes, prev, pager, next, jumper');
function handleSizeChange(val) {
  if (currentFansList.value.length / val < 8) {
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
  <div class="user-follow">
    <div class="user-follow-wrap">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: `/${userInfo.userName}` }"
          >个人主页</el-breadcrumb-item
        >
        <el-breadcrumb-item
          >/ {{ isAuthentic ? '我' : userInfo.userName }}的粉丝 ({{
            userInfo.fansCount
          }})</el-breadcrumb-item
        >
      </el-breadcrumb>
      <div v-if="currentFansList.length" class="follow-list">
        <div
          v-for="fans in currentFansList.slice(
            (queryData.page - 1) * queryData.size,
            queryData.page * queryData.size
          )"
          :key="fans.id"
          class="follow-list-item"
        >
          <div class="list-item-left">
            <div class="follow-avatar">
              <router-link :to="`/${fans.name}`" target="_blank"
                ><el-avatar :size="60" :src="fans.avatar_url" fit="fill"
              /></router-link>
            </div>
            <div class="follow-info">
              <div class="follow-info-name">{{ fans.name }}</div>
              <div class="follow-info-desc">
                {{ fans.description || '这个人很懒，啥都没留下' }}
              </div>
            </div>
          </div>
          <div
            v-if="userInfoStore.id !== fans.id"
            class="list-item-right"
            @click="getFollow(userInfoStore.id, fans)"
          >
            <o-button v-if="fans.isFollow" type="secondary" class="item-btn">
              取消关注
            </o-button>
            <o-button v-else type="primary">关注TA</o-button>
          </div>
        </div>
      </div>
      <div v-else class="nofollow">
        <o-icon class="star-icon"><icon-star></icon-star></o-icon>
        <div class="star-info">暂未有人关注</div>
      </div>
    </div>
    <!-- 分页器 -->
    <div v-if="currentFansList.length > 6" class="pagination">
      <el-pagination
        :page-sizes="[6, 12, 18]"
        :current-page="queryData.page"
        :page-size="queryData.size"
        :total="currentFansList.length"
        :layout="layout"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-follow {
  .user-follow-wrap {
    height: 100%;
    .el-breadcrumb {
      height: 21px;
      line-height: 21px;
      .el-breadcrumb__item {
        :deep(.el-breadcrumb__inner.is-link) {
          color: #555;
          font-weight: 400;
          &:hover {
            color: #0d8dff;
          }
        }
        :deep(.el-breadcrumb__separator.el-icon) {
          color: #555;
        }
      }
      :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
        color: #000;
      }
    }
    .follow-list {
      height: calc(100% - 21px);
      overflow: hidden;
      .follow-list-item {
        width: 100%;
        // min-height: calc(17% - 35px);
        height: 140px;
        background-color: #fff;
        margin-top: 20px;
        padding: 30px 40px;
        box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        &:hover {
          box-shadow: 0px 6px 18px 0px rgba(13, 141, 255, 0.14);
        }
        .list-item-left {
          width: 70%;
          display: flex;
          align-items: center;
          .follow-info {
            width: 75%;
            margin-left: 24px;
            &-name {
              height: 24px;
              line-height: 24px;
              margin-bottom: 12px;
              font-size: 16px;
              color: #000;
            }
            &-desc {
              height: 24px;
              font-size: 16px;
              color: #555;
              line-height: 24px;
            }
          }
        }
      }
    }
    .nofollow {
      position: absolute;
      top: calc(50% + 21px);
      left: 50%;
      transform: translate(-50%, -50%);
      // height: calc(100% - 21px);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .star-icon {
        font-size: 240px;
      }
      .star-info {
        font-size: 18px;
        color: #555;
        margin-top: 24px;
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
