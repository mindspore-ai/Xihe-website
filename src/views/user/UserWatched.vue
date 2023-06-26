<script setup>
import { ref, reactive, computed, watch, defineEmits } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowRight } from '@element-plus/icons-vue';

import IconStar from '~icons/app/Star';

import OButton from '@/components/OButton.vue';

import { useUserInfoStore, useVisitorInfoStore } from '@/stores';
import { goAuthorize } from '@/shared/login';

import { getUserFollow, cancelFollowing, getFollowing } from '@/api/api-user';

const userInfoStore = useUserInfoStore();
const visitorInfoStore = useVisitorInfoStore();
const route = useRoute();

// 是否是访客
const isAuthentic = computed(() => {
  return route.params.user === userInfoStore.userName;
});

// 当前用户信息
const userInfo = computed(() => {
  return isAuthentic.value ? userInfoStore : visitorInfoStore;
});
// 暂无接口
// let i18n = {
//   placeholder: '搜索我的关注',
//   sortCondition: [
//     { text: '按照关注时间排序', value: '' },
//     { text: '按照首字母排序', value: '' },
//   ],
// };

let queryData = reactive({
  search: null,
  page: 1,
  size: 6,
});

const currentFollowList = ref([]);
// 获取用户的关注列表
function getFollowList() {
  try {
    getUserFollow(userInfo.value.userName).then((res) => {
      currentFollowList.value = res.data.data;
    });
  } catch (error) {
    return error;
  }
}
getFollowList();

const emit = defineEmits(['dom-change']);
watch(
  () => {
    return currentFollowList.value;
  },
  (val) => {
    if (val && val.length > 6) {
      emit('dom-change', 74);
    }
  },
  { immediate: true }
);

// 关注用户or点赞
function getWatch(name) {
  // 如果用户没有登录，则跳转到登录页面
  if (!userInfoStore.id) {
    goAuthorize();
  } else {
    try {
      let params = { account: name };
      getFollowing(params).then(() => {
        userInfoStore.followingCount++;
        getFollowList();
      });
    } catch (error) {
      return error;
    }
  }
}

// 取消关注他人
function cancelWatch(name) {
  if (!userInfoStore.id) {
    goAuthorize();
    return;
  } else {
    try {
      let params = { account: name };
      cancelFollowing(params).then(() => {
        userInfoStore.followingCount--;
        getFollowList();
      });
    } catch (error) {
      return error;
    }
  }
}

// 分页器
const layout = ref('sizes, prev, pager, next, jumper');
function handleSizeChange(val) {
  if (currentFollowList.value.length / val < 8) {
    layout.value = layout.value.split(',').splice(0, 4).join(',');
  }
  queryData.size = val;
}
function toTop() {
  document.documentElement.scrollTop = 0;
}

function handleCurrentChange(val) {
  queryData.page = val;
  toTop();
}
</script>

<template>
  <div class="user-watched">
    <div class="user-watched-wrap">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: `/${userInfo.userName}` }"
          >个人主页</el-breadcrumb-item
        >
        <el-breadcrumb-item
          >/ {{ isAuthentic ? '我' : userInfo.userName }}的关注 ({{
            userInfo.followingCount > 10000
              ? (userInfo.followingCount - (userInfo.followingCount % 1000)) /
                  10000 +
                'W'
              : userInfo.followingCount
          }})</el-breadcrumb-item
        >
      </el-breadcrumb>
      <!-- TODO:下拉排序 暂无接口-->
      <!-- <div class="watched-head">
        <div class="watched-head-left">筛选</div>
        <div class="watched-head-right">
          <el-input
            :prefix-icon="Search"
            class="w-50 m-2"
            :placeholder="i18n.placeholder"
          />
          <el-dropdown popper-class="filter">
            <span class="el-dropdown-link">
              <o-icon><icon-menu></icon-menu></o-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu class="watched-dropdown">
                <el-dropdown-item
                  v-for="(item, index) in i18n.sortCondition"
                  :key="item.text"
                  @click="dropdownClick(index)"
                  >{{ item.text }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div> -->
      <div
        v-if="currentFollowList && currentFollowList.length"
        class="watched-list"
      >
        <div
          v-for="(follow, index) in currentFollowList.slice(
            (queryData.page - 1) * queryData.size,
            queryData.page * queryData.size
          )"
          :key="index"
          class="watched-list-item"
        >
          <div class="list-item-left">
            <div class="watched-avatar">
              <router-link :to="`/${follow.account}`" target="_blank">
                <el-avatar :size="60" :src="follow.avatar_id" fit="fill" />
              </router-link>
            </div>
            <div class="watched-info">
              <div class="watched-info-name">{{ follow.account }}</div>
              <div class="watched-info-desc">
                {{ follow.bio || '这个人很懒，啥都没留下' }}
              </div>
            </div>
          </div>
          <div
            v-if="userInfoStore.userName !== follow.account"
            class="list-item-right"
          >
            <o-button
              v-if="follow.is_follower"
              type="secondary"
              class="item"
              @click="cancelWatch(follow.account)"
              >取消关注</o-button
            >
            <o-button v-else type="primary" @click="getWatch(follow.account)"
              >关注TA</o-button
            >
          </div>
        </div>
      </div>

      <div v-else class="nowatched">
        <o-icon class="star-icon"><icon-star></icon-star></o-icon>
        <div class="star-info">暂未关注任何人</div>
      </div>
    </div>
    <!-- 分页器 -->
    <div
      v-if="currentFollowList && currentFollowList.length > 6"
      class="pagination"
    >
      <el-pagination
        :page-sizes="[6, 12, 18]"
        :current-page="queryData.page"
        :page-size="queryData.size"
        :total="currentFollowList.length"
        :layout="layout"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-watched {
  .user-watched-wrap {
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
    .watched-head {
      width: 100%;
      padding: 8px 24px;
      margin-top: 24px;
      margin-bottom: 30px;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .watched-head-right {
        display: flex;
        align-items: center;
        .watched-dropdown {
          position: relative;
        }
      }
      .o-icon {
        cursor: pointer;
        margin-left: 24px;
        font-size: 24px;
      }
    }
    .watched-list {
      height: calc(100% - 21px);
      // height: calc(100% - 123px);
      overflow: hidden;
      border-radius: 16px;
      .watched-list-item {
        width: 100%;
        height: 140px;
        background-color: #fff;
        margin-top: 20px;
        padding: 30px 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 16px;
        transition: all 0.3s ease;
        &:hover {
          box-shadow: 0px 1px 30px 0px rgba(0, 0, 0, 0.05);
        }
        .list-item-left {
          width: 70%;
          // margin-left: 24px;
          display: flex;
          align-items: center;
          .watched-info {
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

    .nowatched {
      position: absolute;
      top: calc(50% + 21px);
      left: 50%;
      transform: translate(-50%, -50%);
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
