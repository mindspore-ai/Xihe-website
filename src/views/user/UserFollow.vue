<script setup>
import { reactive, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { goAuthorize } from '@/shared/login';
import { ArrowRight } from '@element-plus/icons-vue';
import IconStar from '~icons/app/Star';

import OButton from '@/components/OButton.vue';

import { useUserInfoStore, useVistorInfoStore } from '@/stores';
import { getUserDig } from '@/api/api-user';

const userInfoStore = useUserInfoStore();
const vistorInfoStore = useVistorInfoStore();
const route = useRoute();
// const router = useRouter();

// 是否是访客
const isAuthentic = computed(() => {
  return route.params.user === userInfoStore.userName;
});
// 当前用户信息
const userInfo = computed(() => {
  return isAuthentic.value ? userInfoStore : vistorInfoStore;
});
// console.log(userInfoStore);
let query = reactive({
  search: null,
  page: 1,
  size: 6,
});
// 登录用户关注列表
const followList = computed(() => {
  return userInfoStore.followList;
});
// const followList = userInfoStore.followList;

// 登录用户关注id列表
let followIdList = computed(() => followList.value.map((val) => val.id));
// 当前用户粉丝列表
const fansList = computed(() => {
  return userInfo.value.fansList;
});
console.log(fansList);
function handleSizeChange(val) {
  query.size = val;
}
function handleCurrentChange(val) {
  query.page = val;
}
// 判断登录用户关注id列表是否含有该粉丝id
function watchFansList() {
  fansList.value.forEach((val) => {
    if (followIdList.value.indexOf(val.id) !== -1) {
      val.isFollow = true;
    } else {
      val.isFollow = false;
    }
  });
  console.log(userInfoStore, 'userInfoStore');
}

watchFansList();

watch(
  () => fansList.value,
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
          if (followIdList.value.indexOf(fans.id) !== -1) {
            let index = followIdList.value.indexOf(fans.id);
            followList.value.splice(index, 1);
            // followIdList = computed(() =>
            //   followList.map((val) => val.id)
            // );
          } else {
            followList.value.push(fans);
            // followIdList = computed(() =>
            //   followList.map((val) => val.id)
            // );
          }
        }
        fans.isFollow = !fans.isFollow;
      });
    } catch (error) {
      console.log(error);
    }
  }
}
</script>

<template>
  <div class="user-follow">
    <div class="follow-list">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: `/${userInfo.userName}` }"
          >个人主页</el-breadcrumb-item
        >
        <el-breadcrumb-item
          >/ {{ isAuthentic ? '我' : userInfo.userName }}的粉丝({{
            userInfo.fansCount
          }})</el-breadcrumb-item
        >
      </el-breadcrumb>
      <div v-if="fansList.length" class="follow-list-wrap">
        <div
          v-for="fans in fansList.slice(
            (query.page - 1) * query.size,
            query.page * query.size
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
            v-if="userInfoStore.nickName !== fans.name"
            class="list-item-right"
            @click="getFollow(userInfoStore.id, fans)"
          >
            <o-button v-if="fans.isFollow" type="secondary" class="item-btn">
              取消关注
              <!-- {{ followList.indexOf(fans) !== -1 ? '取消关注' : '关注TA' }} -->
            </o-button>
            <o-button v-else type="primary">关注TA</o-button>
          </div>
        </div>
        <div class="pagination">
          <el-pagination
            :page-sizes="[6, 12, 18]"
            :current-page="query.page"
            :page-size="query.size"
            :total="fansList.length"
            hide-on-single-page
            layout="sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </div>
      <div v-else class="nofollow">
        <o-icon class="star-icon"><icon-star></icon-star></o-icon>
        <div class="star-info">暂未有人关注</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-follow {
  width: 100%;
  height: 100%;
  background-color: #f5f6f8;
  .follow-list {
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
    .follow-list-wrap {
      height: calc(100% - 41px);
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
      height: calc(100% - 21px);
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
