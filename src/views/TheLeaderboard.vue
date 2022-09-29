<script setup>
import { ref } from 'vue';

import IconArrowRight from '~icons/app/arrow-right.svg';

import ringImg from '@/assets/icons/ring.png';
// import firstImg from '@/assets/imgs/first.png';
// import secondImg from '@/assets/imgs/second.png';
// import thirdImg from '@/assets/imgs/third.png';

import { getRank } from '@/api/api-user';
import { goAuthorize } from '@/shared/login';
import { useLoginStore } from '@/stores';
import { useRouter } from 'vue-router';

const loginStore = useLoginStore();

let i18n = {
  head: {
    title: '公测活动排行榜',
    introduce: '用户名',
  },
};

const router = useRouter();

const activeName = ref('first');
const tableData1 = ref();
const tableData2 = ref();
const tableData3 = ref();
const you_count1 = ref(null);
const you_count2 = ref(null);
const you_count3 = ref(null);
// debugger;
getRank().then((res) => {
  tableData1.value = res.data.user_invited.ranklist;
  you_count1.value = res.data.user_invited.you_count;
  tableData2.value = res.data.user_download.ranklist;
  you_count2.value = res.data.user_download.you_count;
  tableData3.value = res.data.user_project.ranklist;
  you_count3.value = res.data.user_project.you_count;
});
function goSetNew() {
  if (loginStore.isLogined) {
    router.push('/new/projects');
  } else {
    goAuthorize();
  }
}
function goModels() {
  if (loginStore.isLogined) {
    router.push('/models');
  } else {
    goAuthorize();
  }
}
function goInvited() {
  if (loginStore.isLogined) {
    router.push('/settings/invitation');
  } else {
    goAuthorize();
  }
}
function goUserPage(vel) {
  // console.log(vel);
  router.push(`/${vel}`);
}
</script>
<template>
  <div class="modelzoo">
    <div class="model-head">
      <div class="wrap">
        <div class="banner-left">
          <div class="title">{{ i18n.head.title }}</div>
          <div class="introduce">
            {{ i18n.head.introduce }}
          </div>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="邀请人数排行榜" name="first">
        <div class="tips">
          <div
            v-if="tableData1"
            class="first"
            @click="goUserPage(tableData1[0].username)"
          >
            <img :src="tableData1[0].avatar_url" alt="" />
            <span>{{ tableData1[0].username }} </span>
          </div>
          <div
            v-if="tableData1"
            class="second"
            @click="goUserPage(tableData1[1].username)"
          >
            <img :src="tableData1[1].avatar_url" alt="" />
            <span>{{ tableData1[1].username }} </span>
          </div>
          <div
            v-if="tableData1"
            class="third"
            @click="goUserPage(tableData1[2].username)"
          >
            <img :src="tableData1[2].avatar_url" alt="" />
            <span>{{ tableData1[2].username }} </span>
          </div>
          <div class="tips-left">
            <img :src="ringImg" alt="" />
            邀请新用户成功注册可赢取丰厚大奖 ，<a
              href="https://bbs.huaweicloud.com/forum/thread-0202967064771520008-1-1.html"
              target="blank"
              >点击查看活动详情</a
            >
          </div>
          <div v-if="you_count1 !== null" class="tips-right">
            我的邀请人数：<span>{{ you_count1 }}</span>
          </div>
        </div>
        <!-- <div class="rank">
          <div class="rank-body">
            <el-table :data="tableData1">
              <el-table-column width="120" label="排名">
                <template #default="scope">
                  <img v-if="scope.$index === 0" :src="firstImg" alt="" />
                  <img v-else-if="scope.$index === 1" :src="secondImg" alt="" />
                  <img v-else-if="scope.$index === 2" :src="thirdImg" alt="" />
                  <div v-else-if="scope.$index < 9" class="num">
                    {{ '0' + (scope.$index + 1) }}
                  </div>
                  <div v-else class="num">{{ scope.$index + 1 }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="username" label="用户名">
                <template #default="scope">
                  <div
                    class="user"
                    @click="goUserPage(tableData1[scope.$index].username)"
                  >
                    <img :src="tableData1[scope.$index].avatar_url" alt="" />
                    <span>{{ tableData1[scope.$index].username }} </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column width="170" label="邀请人数">
                <template #default="scope">
                  <div class="score">
                    <span>{{ tableData1[scope.$index].bonus / 10 }} </span
                    ><span class="man">人</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div> -->
        <div class="footer" @click="goInvited">
          立即邀请赢大奖<OIcon><IconArrowRight /></OIcon>
        </div>
      </el-tab-pane>
      <el-tab-pane label="下载量排行榜" name="second">
        <div class="tips">
          <div
            v-if="tableData2"
            class="first"
            @click="goUserPage(tableData2[0].user_detail.username)"
          >
            <img :src="tableData2[0].user_detail.avatar_url" alt="" />
            <span>{{ tableData2[0].user_detail.username }} </span>
          </div>
          <div
            v-if="tableData2"
            class="second"
            @click="goUserPage(tableData2[1].user_detail.username)"
          >
            <img :src="tableData2[1].user_detail.avatar_url" alt="" />
            <span>{{ tableData2[1].user_detail.username }} </span>
          </div>
          <div
            v-if="tableData2"
            class="third"
            @click="goUserPage(tableData2[2].user_detail.username)"
          >
            <img :src="tableData2[2].user_detail.avatar_url" alt="" />
            <span>{{ tableData2[2].user_detail.username }} </span>
          </div>
          <div class="tips-left">
            <img :src="ringImg" alt="" />
            下载模型可赢取丰厚大奖，<a
              href="https://bbs.huaweicloud.com/forum/thread-0202967064771520008-1-1.html"
              target="blank"
              >点击查看活动详情</a
            >
          </div>
          <div v-if="you_count2 !== null" class="tips-right">
            我的下载数量：<span>{{ you_count2 }}</span>
          </div>
        </div>
        <!-- <div class="rank">
          <div class="rank-body">
            <el-table :data="tableData2">
              <el-table-column width="120" label="排名">
                <template #default="scope">
                  <img v-if="scope.$index === 0" :src="firstImg" alt="" />
                  <img v-else-if="scope.$index === 1" :src="secondImg" alt="" />
                  <img v-else-if="scope.$index === 2" :src="thirdImg" alt="" />
                  <div v-else-if="scope.$index < 9" class="num">
                    {{ '0' + (scope.$index + 1) }}
                  </div>
                  <div v-else class="num">{{ scope.$index + 1 }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="username" label="用户名">
                <template #default="scope">
                  <div
                    class="user"
                    @click="
                      goUserPage(tableData2[scope.$index].user_detail.username)
                    "
                  >
                    <img
                      :src="tableData2[scope.$index].user_detail.avatar_url"
                      alt=""
                    />
                    <span
                      >{{ tableData2[scope.$index].user_detail.username }}
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column width="170" label="下载数量">
                <template #default="scope">
                  <div class="score">
                    <span>{{ tableData2[scope.$index].download_count }} </span
                    ><span class="man"></span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div> -->
        <div class="link" @click="goModels">
          浏览模型并下载<OIcon><IconArrowRight /></OIcon>
        </div>
      </el-tab-pane>
      <el-tab-pane label="创建项目排行榜" name="third">
        <div class="tips">
          <div
            v-if="tableData3"
            class="first"
            @click="goUserPage(tableData3[0].user_detail.username)"
          >
            <img :src="tableData3[0].user_detail.avatar_url" alt="" />
            <span>{{ tableData3[0].user_detail.username }} </span>
          </div>
          <div
            v-if="tableData3"
            class="second"
            @click="goUserPage(tableData3[1].user_detail.username)"
          >
            <img :src="tableData3[1].user_detail.avatar_url" alt="" />
            <span>{{ tableData3[1].user_detail.username }} </span>
          </div>
          <div
            v-if="tableData3"
            class="third"
            @click="goUserPage(tableData3[2].user_detail.username)"
          >
            <img :src="tableData3[2].user_detail.avatar_url" alt="" />
            <span>{{ tableData3[2].user_detail.username }} </span>
          </div>
          <div class="tips-left">
            <img :src="ringImg" alt="" />
            创建可运行项目赢取丰厚大奖 ，<a
              href="https://bbs.huaweicloud.com/forum/thread-0202967064771520008-1-1.html"
              target="blank"
              >点击查看活动详情</a
            >
          </div>
          <div v-if="you_count3 !== null" class="tips-right">
            我的创建数量：<span>{{ you_count3 }}</span>
          </div>
        </div>
        <!-- <div class="rank">
          <div class="rank-body">
            <el-table :data="tableData3">
              <el-table-column width="120" label="排名">
                <template #default="scope">
                  <img v-if="scope.$index === 0" :src="firstImg" alt="" />
                  <img v-else-if="scope.$index === 1" :src="secondImg" alt="" />
                  <img v-else-if="scope.$index === 2" :src="thirdImg" alt="" />
                  <div v-else-if="scope.$index < 9" class="num">
                    {{ '0' + (scope.$index + 1) }}
                  </div>
                  <div v-else class="num">{{ scope.$index + 1 }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="username" label="用户名">
                <template #default="scope">
                  <div
                    class="user"
                    @click="
                      goUserPage(tableData3[scope.$index].user_detail.username)
                    "
                  >
                    <img
                      :src="tableData3[scope.$index].user_detail.avatar_url"
                      alt=""
                    />
                    <span
                      >{{ tableData3[scope.$index].user_detail.username }}
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column width="170" label="创建数量">
                <template #default="scope">
                  <div class="score">
                    <span>{{ tableData3[scope.$index].project_count }} </span
                    ><span class="man"></span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div> -->
        <div class="link" @click="goSetNew">
          立即创建项目<OIcon><IconArrowRight /></OIcon>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.wrap {
  margin: 0 auto;
  padding: 50px 16px 136px 16px;
  max-width: 1472px;
}
.modelzoo {
  // background-color: #f5f6f8;
  .model-head {
    padding-top: 80px;
    background-size: cover;
    background-image: url('@/assets/imgs/banner-head.png');
    .wrap {
      display: flex;
      justify-content: space-between;
      padding: 42px 16px;
      color: #fff;
      .title {
        padding-bottom: 8px;
        font-size: 36px;
      }
      .introduce {
        visibility: hidden;
        padding-right: 24px;
        font-size: 18px;
        .reference {
          color: #4dcdff;
        }
      }
      .banner-right {
        display: flex;
        align-items: center;
      }
    }
  }
}
.el-table {
  --el-table-header-bg-color: #f5f6f8;
}
:deep(.el-tabs) {
  background: #f5f6f8;
  .el-tabs__header {
    margin-bottom: 0;
  }
  .el-tabs__content {
    margin: 0 16px;
    min-height: calc(100vh - 475px) !important;
    .el-tab-pane {
      max-width: 1440px;
      margin: 40px auto;
      background-color: #fff;
      .tips {
        height: 616px;
        position: relative;
        background: url(@/assets/imgs/ranks-bg.png);
        background-size: cover;
        background-position: 50%;
        .first {
          position: absolute;
          top: 181px;
          left: 46%;
          font-size: 16px;
          cursor: pointer;
          img {
            width: 40px;
            height: 40px;
          }
          span {
            display: inline-block;
            margin-top: 10px;
          }
        }
        .second {
          position: absolute;
          top: 292px;
          left: 22%;
          @media screen and (max-width: 1366px) {
            left: 18%;
          }
          font-size: 16px;
          cursor: pointer;
          img {
            width: 40px;
            height: 40px;
          }
          span {
            display: inline-block;
            margin-top: 10px;
          }
        }
        .third {
          position: absolute;
          top: 375px;
          left: 65%;
          @media screen and (max-width: 1366px) {
            left: 69%;
          }
          font-size: 16px;
          cursor: pointer;
          img {
            width: 40px;
            height: 40px;
          }
          span {
            display: inline-block;
            margin-top: 10px;
          }
        }
        display: flex;
        // align-items: center;
        justify-content: space-between;
        padding: 40px 40px 8px 40px;
        // background: rgba(13, 141, 255, 0.03);
        // border: 1px solid #d8d8d8;
        font-size: 14px;
        font-weight: normal;
        color: #555555;
        line-height: 22px;
        img {
          width: 16px;
          height: 16px;
          margin-right: 16px;
        }
        a {
          color: #0d8dff;
          height: 20px;
        }
        &-left {
          display: flex;
          // align-items: center;
          img {
            margin-top: 3px;
          }
        }
        &-right {
          font-size: 18px;
          color: #000000;
          span {
            color: #ff7f0d;
          }
        }
      }
      .rank {
        margin-top: 40px;
        display: flex;
        justify-content: center;
      }
      .rank-body {
        width: 960px;
        img {
          width: 41px;
        }

        .el-table--fit {
          --el-table-fixed-box-shadow: none;
        }
        // margin-left: 40px;
        .el-table__inner-wrapper {
          th {
            color: #000000;
          }
          color: #555555;
          .el-table__header {
            font-size: 18px;
            line-height: 26px;
            .cell {
              margin: 24px 40px;
            }
            tr {
              --el-table-fixed-box-shadow: none;
            }
          }
          .el-table__cell {
            padding: 0;
            .cell {
              padding: 0;
            }
          }
          // .el-table_1_column_1 {
          //   padding-left: 40px !important;
          // }
          .el-table__body {
            font-size: 16px;
            line-height: 24px;
            // .el-table_1_column_1 {
            //   font-size: 28px;
            // }
            // .el-table_1_column_3 {
            //   color: #ff7f0d;
            // }
            .el-table__row:first-child {
              background: linear-gradient(to right, #fff, #fffbef);
              border: none;
              box-shadow: none;
            }
            .el-table__row:nth-child(2) {
              background: linear-gradient(to right, #fff, #fafcfc);
            }
            .el-table__row:nth-child(3) {
              background: linear-gradient(to right, #fff, #fffaf6);
            }
          }
          .cell {
            margin: 20px 0;
            .num {
              margin: 4px 40px;
              // margin-left: 12px;
              font-size: 28px;
              line-height: 36px;
            }
            img {
              margin-left: 40px;
            }
            .score {
              margin-left: 45px;
              color: #ff7f0d;
              font-size: 24px;
              vertical-align: sub;
              .man {
                font-size: 14px;
              }
            }
            .user {
              cursor: pointer;
              color: #555555;
              display: flex;
              align-items: center;
              img {
                margin-right: 15px;
              }
            }
          }
          .el-table__append-wrapper {
            // text-align: center;
            margin-top: 27px;
            margin-bottom: 40px;
            margin-right: 40px;
            font-size: 14px;
            color: #40c4ff;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            .o-icon {
              font-size: 24px;
              color: #0d8dff;
              margin-left: 8px;
            }
          }
        }
      }
    }
  }
}
:deep(.el-tabs__nav-wrap) {
  &::after {
    height: 1px;
    background-color: #e5e5e5;
  }
  .el-tabs__nav-scroll {
    display: flex;
    justify-content: center;
    font-size: 16px;
    line-height: 24px;
    background-color: #fff;
  }
}
.footer {
  cursor: pointer;
  text-align: center;
  margin: 40px 0 64px 0;
  padding-bottom: 40px;
  .o-icon {
    margin-left: 8px;
    color: #0d8dff;
    display: inline-block;
    transition: all 0.2s linear;
  }
  &:hover {
    .o-icon {
      transform: translate(4px);
    }
  }
}
.link {
  display: block;
  cursor: pointer;
  text-align: center;
  margin: 40px 0 64px 0;
  padding-bottom: 40px;
  color: #000000;
  .o-icon {
    margin-left: 8px;
    color: #0d8dff;
    display: inline-block;
    transition: all 0.2s linear;
  }
  &:hover {
    .o-icon {
      transform: translate(4px);
    }
  }
}
</style>
