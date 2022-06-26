<script setup>
import { reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowRight } from '@element-plus/icons-vue';
import { Search } from '@element-plus/icons-vue';

import IconMenu from '~icons/app/menu';
import IconStar from '~icons/app/Star';

import OButton from '@/components/OButton.vue';

import { useUserInfoStore, useVistorInfoStore } from '@/stores';
import { getUserDig2 } from '@/api/api-user';
import { goAuthorize } from '@/shared/login';

const userInfoStore = useUserInfoStore();
const vistorInfoStore = useVistorInfoStore();
const route = useRoute();

// 是否是访客
const isAuthentic = computed(() => {
  return route.params.user === userInfoStore.userName;
});

// 当前用户信息
const userInfo = computed(() => {
  return isAuthentic.value ? userInfoStore : vistorInfoStore;
});
let i18n = {
  placeholder: '搜索我的关注',
  sortCondition: [
    { text: '按照关注时间排序', value: '' },
    { text: '按照首字母排序', value: '' },
  ],
};
let query = reactive({
  search: null,
  page: 1,
  size: 6,
});

// 登录用户的关注列表
const loginFollowList = userInfoStore.followList;
// 登录用户关注id列表
let loginFollowIdList = loginFollowList.map((val) => {
  return val.id;
});
// console.log('loginFollowIdList', loginFollowIdList);
// 当前用户的关注列表
const currentFollowList = computed(() => {
  return userInfo.value.followList;
});

function handleSizeChange(val) {
  query.size = val;
}
function handleCurrentChange(val) {
  query.page = val;
}

currentFollowList.value.forEach((val) => {
  if (loginFollowIdList.indexOf(val.id) !== -1) {
    val.isFollow = true;
  } else {
    val.isFollow = false;
  }
});
console.log(currentFollowList.value)
// 取消关注or取消点赞
function getWatched(userId, follow) {
  if (!userInfoStore.id) {
    goAuthorize();
    return;
  } else {
    try {
      getUserDig2({ userId, follow }).then((res) => {
        if (res.status === 200) {
          if (loginFollowIdList.indexOf(follow.id) !== -1) {
            let index = loginFollowIdList.indexOf(follow.id);
            loginFollowList.splice(index, 1);
            loginFollowIdList = loginFollowList.map((val) => {
              return val.id;
            });
          } else {
            loginFollowList.push(follow);
            loginFollowIdList = loginFollowList.map((val) => {
              return val.id;
            });
          }
        }
        follow.isFollow = !follow.isFollow;
      });
    } catch (error) {
      console.log(error);
    }
  }
}
</script>

<template>
  <div class="user-watched">
    <div class="watched-list">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: `/${userInfo.userName}` }"
          >个人主页</el-breadcrumb-item
        >
        <el-breadcrumb-item
          >/ {{ isAuthentic ? '我' : userInfo.userName }}的关注 ({{
            userInfo.followCount
          }})</el-breadcrumb-item
        >
      </el-breadcrumb>
      <div class="watched-head">
        <div class="watched-head-left">筛选</div>
        <div class="watched-head-right">
          <el-input
            :prefix-icon="Search"
            class="w-50 m-2"
            :placeholder="i18n.placeholder"
          />
          <!-- TODO:下拉排序 暂无接口-->
          <!-- <el-dropdown>
            <span class="el-dropdown-link">
              <o-icon><icon-menu></icon-menu></o-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(item, index) in i18n.sortCondition"
                  :key="item.text"
                  @click="dropdownClick(index)"
                  >{{ item.text }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown> -->
        </div>
      </div>
      <div v-if="currentFollowList.length" class="watched-list-wrap">
        <div
          v-for="follow in currentFollowList.slice(
            (query.page - 1) * query.size,
            query.page * query.size
          )"
          :key="follow.id"
          class="watched-list-item"
        >
          <div class="list-item-left">
            <div class="watched-avatar">
              <router-link :to="`/${follow.name}`" target="_blank">
                <el-avatar :size="60" :src="follow.avatar_url" fit="fill" />
              </router-link>
            </div>
            <div class="watched-info">
              <div class="watched-info-name">{{ follow.name }}</div>
              <div class="watched-info-desc">
                {{ follow.description || '这个人很懒，啥都没留下' }}
              </div>
            </div>
          </div>
          <div
            v-show="follow.id !== userInfoStore.id"
            class="list-item-right"
            @click="getWatched(userInfoStore.id, follow)"
          >
            <o-button v-if="follow.isFollow" type="secondary" class="item"
              >取消关注</o-button
            >
            <o-button v-else type="primary">关注TA</o-button>
          </div>
        </div>
        <div class="pagination">
          <el-pagination
            :page-sizes="[6, 12, 18]"
            :current-page="query.page"
            :page-size="query.size"
            :total="currentFollowList.length"
            hide-on-single-page
            layout="sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </div>

      <div v-else class="nowatched">
        <o-icon class="star-icon"><icon-star></icon-star></o-icon>
        <div class="star-info">暂未关注任何人</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-watched {
  width: 100%;
  height: 100%;
  background-color: #f5f6f8;
  .watched-list {
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
      }
      .o-icon {
        cursor: pointer;
        margin-left: 24px;
        font-size: 24px;
      }
    }
    .watched-list-wrap {
      height: calc(100% - 123px);
      .watched-list-item {
        width: 100%;
        height: 140px;
        background-color: #fff;
        margin-top: 20px;
        padding: 30px 40px;
        box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
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
      height: calc(100% - 123px);
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
    display: flex;
    justify-content: center;
    margin: 24px 0 64px 0;
  }
}
</style>
