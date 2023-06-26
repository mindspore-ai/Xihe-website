<script setup>
import { useRouter } from 'vue-router';
import endometrialcancerCover from '@/assets/imgs/estate/medicine/true-sight/truesight-cover.png';

import IconArrowRight from '~icons/app/arrow-right.svg';
import IconLeft from '~icons/app/left.svg';
import { ArrowRight } from '@element-plus/icons-vue';
import useWindowResize from '@/shared/hooks/useWindowResize.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const screenWidth = useWindowResize();
const router = useRouter();

function goBack() {
  router.push('/medicine');
}
</script>

<template>
  <div class="medicine-detail">
    <div v-if="screenWidth < 820" class="navigation">
      <o-icon class="turn" @click="goBack"><icon-left></icon-left></o-icon>
      <span class="title">{{ t('truesight.TITLE') }}</span>
    </div>
    <div class="medicine-wrap">
      <div class="bread-wrap">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/medicine' }">
            {{ t('truesight.MEDEIC') }}
          </el-breadcrumb-item>
          <el-breadcrumb-item class="breadcrumb-item">
            {{ t('truesight.TITLE') }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="medicine-content">
        <div class="medicine-content-banner">
          <div class="banner-left">
            <img draggable="false" :src="endometrialcancerCover" alt="" />
          </div>
          <div class="banner-right">
            <div class="banner-content">
              <div class="banner-title">
                {{ t('truesight.TITLE') }}
              </div>
              <div class="banner-desc">
                {{ t('truesight.DESCRIPTION') }}
              </div>
            </div>
            <div class="banner-btn">
              <OButton
                :size="screenWidth < 820 ? 'mini' : 'small'"
                disabled
                type="primary"
                class="home-btn"
              >
                {{ t('truesight.RUN_MODEL') }}
                <template #suffix>
                  <OIcon><IconArrowRight /></OIcon>
                </template>
              </OButton>
            </div>
          </div>
        </div>
        <div class="medicine-content-desc">
          <div class="industry-info">
            <!-- <router-view /> -->
            <div class="project-explain">
              <p class="explain-title">{{ t('truesight.EXPLAIN') }}</p>
              <div class="case-background">
                <p class="title">{{ t('truesight.BACKGROUND') }}</p>
                <div class="case-bg">
                  <p class="text">
                    {{ t('truesight.BACKGROUND_DESC') }}
                  </p>
                  <p class="text">{{ t('truesight.BACKGROUND_DESC1') }}</p>
                  <p class="text">
                    {{ t('truesight.BACKGROUND_DESC2') }}
                  </p>
                  <p class="text">
                    {{ t('truesight.BACKGROUND_DESC3') }}
                  </p>
                </div>
                <div class="img-contain">
                  <img
                    class="img-background"
                    src="@/assets/imgs/estate/medicine/true-sight/background.png"
                    alt=""
                  />
                </div>
              </div>
              <div class="case-intro">
                <p class="title">{{ t('truesight.RESUME') }}</p>
                <div class="intro-item text">
                  {{ t('truesight.RESUME_DESC') }}
                </div>
                <div class="img-contain">
                  <img
                    class="img-intoduction"
                    src="@/assets/imgs/estate/medicine/true-sight/case-introduction.png"
                    alt=""
                  />
                </div>
              </div>
              <div class="case-difficulty">
                <p class="title">{{ t('truesight.DIFFICULT') }}</p>
                <div class="difficults-item">
                  <p class="text">
                    {{ t('truesight.DIFFICULT_DESC') }}
                  </p>
                  <p class="text">
                    {{ t('truesight.DIFFICULT_DESC1') }}
                  </p>
                  <p class="text">
                    {{ t('truesight.DIFFICULT_DESC2') }}
                  </p>
                  <p class="text">
                    {{ t('truesight.DIFFICULT_DESC3') }}
                  </p>
                </div>
              </div>

              <div class="case-solution">
                <p class="title">{{ t('truesight.SOLUTION') }}</p>
                <div class="solve-thoughts">
                  <p class="text">
                    {{ t('truesight.SOLUTION_DESC') }}
                  </p>
                  <p class="text">
                    {{ t('truesight.SOLUTION_DESC1') }}
                  </p>
                  <p class="text">
                    {{ t('truesight.SOLUTION_DESC2') }}
                  </p>
                </div>
                <div class="img-contain">
                  <img
                    class="img-thought-1"
                    src="@/assets/imgs/estate/medicine/true-sight/first-method.png"
                    alt=""
                  />
                </div>
                <div class="solve-thoughts-1">
                  <p class="text">
                    {{ t('truesight.SOLUTION_DESC3') }}
                  </p>
                </div>
                <div class="img-contain">
                  <img
                    class="img-thought-2"
                    src="@/assets/imgs/estate/medicine/true-sight/second-method.png"
                    alt=""
                  />
                </div>
                <div class="solve-thoughts-1">
                  <p class="text">
                    {{ t('truesight.SOLUTION_DESC4') }}
                  </p>
                </div>
              </div>

              <div class="case-advantage">
                <p class="title">{{ t('truesight.ADVANTAGE') }}</p>
                <div class="case-superiority">
                  <p class="text">
                    {{ t('truesight.ADVANTAGE_DESC') }}
                  </p>
                </div>
                <div class="img-contain">
                  <img
                    class="img-superiority"
                    src="@/assets/imgs/estate/medicine/true-sight/superiority.png"
                    alt=""
                  />
                </div>
                <div class="case-superiority">
                  <p class="text">
                    {{ t('truesight.ADVANTAGE_DESC1') }}
                  </p>
                  <p class="text">
                    {{ t('truesight.ADVANTAGE_DESC2') }}
                  </p>
                  <p class="text">
                    {{ t('truesight.ADVANTAGE_DESC3') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.medicine-detail {
  background-color: #f5f6f8;
  padding-top: 80px;
  min-height: calc(100vh - 200px);
  @media screen and (max-width: 820px) {
    padding: 48px 0px 40px;
  }
  .navigation {
    font-size: 16px;
    color: #000;
    line-height: 48px;
    padding: 0 16px;
    margin-bottom: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.0509803922);
    position: relative;
    .o-icon {
      position: absolute;
      left: 16px;
    }
    .title {
      width: 80%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .medicine-wrap {
    padding: 0px 16px 64px;
    margin: 0 auto;
    max-width: 1448px;
    overflow: hidden;
    @media screen and (max-width: 820px) {
      padding-bottom: 0px;
      .bread-wrap {
        @media screen and (max-width: 820px) {
          display: none;
        }
      }
    }
    .bread-wrap {
      padding: 40px 0;
    }
    .medicine-content {
      .medicine-content-banner {
        padding: 40px;
        background-color: #fff;
        display: flex;
        border-radius: 16px;
        margin-bottom: 37px;
        @media screen and (max-width: 820px) {
          padding: 16px;
          margin-bottom: 16px;
        }
        .banner-left {
          width: 416px;
          margin-right: 40px;
          @media screen and (max-width: 820px) {
            display: none;
          }
          img {
            width: 100%;
            height: 100%;
          }
        }
        .banner-right {
          width: calc(100% - 416px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          @media screen and (max-width: 820px) {
            width: 100%;
            display: flex;
          }
          .banner-content {
            .banner-title {
              line-height: 48px;
              font-size: 36px;
              color: #000000;
              margin-bottom: 16px;
              @media screen and (max-width: 820px) {
                font-size: 16px;
                line-height: 24px;
                margin-bottom: 8px;
              }
            }
            .banner-desc {
              font-size: 14px;
              color: #555555;
              line-height: 22px;
              @media screen and (max-width: 820px) {
                font-size: 12px;
                line-height: 18px;
              }
            }
          }
          .banner-btn {
            margin-top: 16px;
            .o-button {
              border-radius: 24px;
            }
          }
        }
      }
      .medicine-content-desc {
        background: #fff;
        border-radius: 16px;
        .industry-tab {
          max-width: 1416px;
          margin: 0 auto;
          height: 48px;
          box-shadow: 0px 1px 5px 0px rgb(45 47 51 / 10%);
          border-radius: 16px 16px 0 0;
          :deep(.o-nav) {
            width: 100%;
            display: flex;
            justify-content: center;
            margin: 0 auto;
            border-radius: 16px 16px 0 0;
            .nav-item {
              color: #555;
            }
          }
        }
        .industry-info {
          padding: 40px;
          @media screen and (max-width: 820px) {
            padding: 16px;
          }
          .project-explain {
            .explain-title {
              font-size: 24px;
              line-height: 22px;
              color: #000000;
            }
            .case-background,
            .case-intro,
            .case-difficulty,
            .case-solution,
            .case-advantage {
              margin-bottom: 40px;
              .title {
                font-size: 18px;
                line-height: 22px;
                color: #000000;
                margin-top: 40px;
              }
              .text {
                font-size: 14px;
                line-height: 22px;
                font-weight: 400;
                color: #555555;
              }
              .case-bg {
                margin-top: 16px;
              }
              .img-contain {
                padding: 24px;
                width: 100%;
                background: #f5f9fb;
                display: flex;
                justify-content: center;
                margin-top: 24px;
                .img-background {
                  height: 346px;
                }
                .img-intoduction {
                  height: 452px;
                }
                .img-thought-1 {
                  height: 239px;
                }
                .img-thought-2 {
                  height: 275px;
                }
                .img-superiority {
                  height: 246px;
                }
              }
              .intro-item,
              .difficults-item,
              .solve-thoughts {
                margin-top: 16px;
              }
              .solve-thoughts-1,
              .case-superiority {
                margin-top: 24px;
              }
            }
            .case-advantage {
              margin-bottom: 0px;
            }
            @media screen and (max-width: 820px) {
              .explain-title {
                font-size: 16px;
                line-height: 24px;
                margin-bottom: 16px;
              }
              .case-background,
              .case-intro,
              .case-difficulty,
              .case-solution,
              .case-advantage {
                margin-bottom: 24px;
                .title {
                  font-size: 14px;
                  line-height: 22px;
                  margin-top: 0;
                }
                .case-bg {
                  .text {
                    font-size: 12px;
                    line-height: 18px;
                  }
                }

                .text {
                  font-size: 12px;
                  line-height: 18px;
                }
                .case-bg,
                .intro-item,
                .solve-thoughts,
                .difficults-item,
                .case-superiority {
                  margin-top: 8px;
                }
                .img-contain {
                  margin-top: 8px;
                  padding: 8px;
                  img {
                    width: 100%;
                  }
                  .img-background {
                    height: 150px;
                  }
                  .img-intoduction {
                    height: 190px;
                  }
                  .img-superiority {
                    height: 100px;
                  }
                  .img-thought-1 {
                    height: 178px;
                  }
                  .img-thought-2 {
                    height: 200px;
                  }
                }
                .solve-thoughts-1 {
                  margin-top: 8px;
                }
              }
              .case-advantage {
                margin-bottom: 0px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
