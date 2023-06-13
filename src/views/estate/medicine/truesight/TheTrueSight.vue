<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import endometrialcancerCover from '@/assets/imgs/estate/medicine/true-sight/truesight-cover.png';

import IconArrowRight from '~icons/app/arrow-right.svg';
import IconLeft from '~icons/app/left.svg';
import { ArrowRight } from '@element-plus/icons-vue';
import useWindowResize from '@/shared/hooks/useWindowResize.js';

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
      <span class="title">TrueSight人工智能临床外科手术决策支持系统</span>
    </div>
    <div class="medicine-wrap">
      <div class="bread-wrap">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/medicine' }">
            医疗专区
          </el-breadcrumb-item>
          <el-breadcrumb-item class="breadcrumb-item">
            TrueSight人工智能临床外科手术决策支持系统
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
                TrueSight人工智能临床外科手术决策支持系统
              </div>
              <div class="banner-desc">
                本案例是一项由清华大学附属清华长庚医院肝胆胰中心与清华大学精密仪器系骨干成员共同组成申请的创新型医工结合人工智能研究，是清华大学董家鸿院士和华中科技大学校长尤政院士的科研转化成果。
              </div>
            </div>
            <div class="banner-btn">
              <OButton
                :size="screenWidth < 820 ? 'mini' : 'small'"
                disabled
                type="primary"
                animation
                class="home-btn"
              >
                运行模型
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
              <p class="explain-title">项目说明</p>
              <div class="case-background">
                <p class="title">案例背景</p>
                <div class="case-bg">
                  <p class="text">
                    目前大多数医院采用人工或半自动术前规划，其存在的主要问题有：
                  </p>
                  <p class="text">（1）二维影像不全面不直观，手术风险较高；</p>
                  <p class="text">
                    （2）医生人工分割重建效率低下，一例腹部薄层增强CT一般由300-500张切片组成，一例重建需要临床医生3-5个小时的时间；
                  </p>
                  <p class="text">
                    （3）半自动重建在面对肿瘤与血管粘连、弥漫性病变等情况，通过读取相似CT
                    值进行区域提取的方法仍需要大量人工修正，存在费时费力问题，无法在临床中广泛使用。
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
                <p class="title">案例简介</p>
                <div class="intro-item text">
                  本案例是一项由清华大学附属清华长庚医院肝胆胰中心与清华大学精密仪器系骨干成员共同组成申请的创新型医工结合人工智能研究，是清华大学董家鸿院士和华中科技大学校长尤政院士的科研转化成果。本项目采用了深度学习、自适应阈值分割与三维条件随机场等先进技术，以至少千例的腹部薄层CT影像数据集作为支撑，同时以UNet为基础架构专门面向不同组织、不同显影程度、特定问题、改进的网络模型，研发出了首个全栈国产自主高精度、全量化、全自动的人工智能临床外科手术决策支持系统。本项目成果可精准分割器官轮廓、血管与病灶等组织，团队刷新了“国际肝脏影像数据分割大赛”世界纪录，准确率高达97.4%，显著高于人工85.7%。
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
                <p class="title">案例难点</p>
                <div class="difficults-item">
                  <p class="text">
                    1.在手术中，外科医生面对不透明的人体器官，高度依赖过往的手术经验和解剖理解，但仍缺乏对患者个体化的器官和肿瘤信息的支持辅助，且面对术中的突发状况，较难根据《临床诊疗指南》进行快速决
                    策和高质量处置。
                  </p>
                  <p class="text">
                    2.在没有智能化手术系统而单纯依靠人的经验判断的情况下，有时会带来不必要的手术折返和手术风险，同时提高了手术并发症的发生率。
                  </p>
                  <p class="text">
                    3.目前的手术术前规划需要人工逐层勾勒每一张CT、MR图像的病灶形态与特征，通常一例就需要耗费外科医生1.5-2个小时。
                  </p>
                  <p class="text">
                    4.以肝胆外科为例，目前肝脏的功能肝体积的自动计算仍处于空白，三维重建及物理肝体积计算停留在手动及半自动水平，严重限制了肝脏术前规划的效率和精度，严重影响着肝胆手术整体观上的判断，
                    不利于对手术方案进行精确制定。同时，这些信息的缺失，也使得高质量的手术导航、术中的信息决策、高精度数字化的手术辅助无法实现。
                  </p>
                </div>
              </div>

              <div class="case-solution">
                <p class="title">解决思路</p>
                <div class="solve-thoughts">
                  <p class="text">
                    1.本案例是清华大学董家鸿院士和华中科技大学校长尤政院士的科研成果转化，具备强有力的科研支撑。同时在产品内部导入了专家共识及指南，向医生提供标准化方案作为参考，帮助医生降低对经验主观判断的依赖，缩短基层医生的成长曲线，帮助基层医院更可靠、安全的实施较高难度手术，助力国家分级诊疗制度的落地与实施。
                  </p>
                  <p class="text">
                    2.本案例是行业独家人工智能本地化一站式精准外科手术计划产品，可适用于多种术式场景，为医生带来更清晰的血管和病灶结构判断，为患者带来更精准的术中手术治疗和更少的术中暴露，经临床试验验证显著减少了患者术中出血和术后并发症，缩短了患者的入院时间。
                  </p>
                  <p class="text">
                    3.本案例将人工智能深度学习算法与医学图像分割重建相结合，实现15分钟内快速精准的重建器官轮廓、血管与病灶重建，大幅提高了医生的诊疗效率。
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
                    4.本案例使用深度学习算法，依据Couinaud分段解剖标志及肝脏影像的任务场景，量身定制了高连通性、高普适性的算法，实现全自动肝段分割及肝段体积计算，达到精确计算拟切除肝段体积与剩余肝脏体积以达到精确术前评估的目的。且本产品已完成与华为国产硬件平台的全面适配测试，成功验证了公司产品软硬件全国产化的预期性能。
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
                    5.本案例于多家中心三甲医院收集了多年龄段、全病种、全期相的数万级训练数据，构建了世界上数据量最大、数据面最广、数据类型最全训练数据，精标注的切片数量达到百万级。并在模型、训练和推理等层面，运用多类算法，增加模型的泛化能力，减少泛化误差。
                  </p>
                </div>
              </div>

              <div class="case-advantage">
                <p class="title">案例优势</p>
                <div class="case-superiority">
                  <p class="text">
                    1.本产品可适用于多种术式场景，实现人工智能秒级重建，分钟级手术规划，为医生带来更清晰的血管和病灶结构判断，为患者带来更精准的术中手术治疗和更少的术中暴露。
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
                    2.本产品于多家中心三甲医院收集了多年龄段、全病种、全期相的数万级训练数据，构建了世界上数据量最大、数据面最广、数据类型最全训练数据，精标注的切片数量达到百万级。并在模型、训练和推理等层面，运用多类算法，增加模型的泛化能力，减少泛化误差。
                  </p>
                  <p class="text">
                    3.本产品导入了专家共识及指南，向医生提供标准化方案作为参考，帮助医生降低对经验主观判断的依赖，缩短基层医生的成长曲线，帮助基层医院更可靠、安全的实施较高难度手术，助力国家分级诊疗制度的落地与实施。
                  </p>
                  <p class="text">
                    4.本产品已完成与华为国产硬件平台与昇思MindSpore软件框架的全面适配测试，成功验证了公司产品软硬件全国产化的预期性能。
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
          padding: 40px 80px;
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
