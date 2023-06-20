<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
import OButton from '@/components/OButton.vue';
import IconUser from '~icons/app/user.svg';

const router = useRouter();

const prop = defineProps({
  cardData: {
    type: Object,
    default: () => {
      return {};
    },
  },
  type: {
    type: String,
    default: '',
  },
});
function goExperience() {
  router.push(prop.cardData.path);
}
</script>
<template>
  <div class="electricity-card">
    <div class="card-top">
      <img class="cover" :src="cardData.image" alt="" />
      <div class="card-title">
        <span class="card-name">
          {{ cardData.name }}
        </span>
      </div>
    </div>
    <div class="card-bottom">
      <div class="card-desc">
        {{ cardData.desc }}
      </div>
      <div class="card-btn">
        <div class="left">
          <icon-user class="user-login-icon"></icon-user>
          <span class="count">{{ cardData.count }}</span>
        </div>

        <OButton size="mini" animation @click="goExperience">
          了解详情
        </OButton>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.electricity-card {
  padding: 12px 12px 24px;
  background-color: #fff;
  border-radius: 16px;
  cursor: pointer;
  @media screen and (max-width: 820px) {
    padding: 6px 6px 16px;
  }
  .card-top {
    position: relative;
    border-radius: 8px;
    .cover {
      width: 100%;
      height: 149px;
      border-radius: 16px;
    }
    .card-title {
      position: absolute;
      top: 51px;
      left: 16px;
      .card-name {
        height: 32px;
        line-height: 32px;
        font-size: 24px;
        font-weight: 500;
        color: #000000;
        margin-right: 16px;
        vertical-align: middle;
      }
      .card-type {
        display: inline-block;
        width: 48px;
        height: 24px;
        font-size: 12px;
        line-height: 24px;
        text-align: center;
        color: #2c2c2c;
        background-color: #fff;
        border-radius: 12px;
        vertical-align: middle;
      }
    }
    @media screen and (max-width: 820px) {
      .cover {
        height: 109px;
      }
      .card-title {
        .card-name {
          font-size: 18px;
          line-height: 16px;
        }
      }
    }
  }
  .card-bottom {
    height: calc(100% - 174px);
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .card-desc {
      line-height: 22px;
      font-size: 14px;
      font-weight: 400;
      color: #555;
      padding: 0 12px;
      min-height: 43px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-btn {
      margin-top: 20px;
      padding: 0 12px;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        .user-login-icon {
          width: 14px;
          height: 14px;
        }
        .count {
          margin-left: 4px;
        }
      }
    }
    @media screen and (max-width: 820px) {
      height: calc(100% - 126px);
      margin-top: 16px;
      .card-desc {
        font-size: 12px;
        line-height: 18px;
        min-height: 36px;
      }
      .card-btn {
        font-size: 12px;
        .left {
          .count {
            margin-left: 8px;
          }
        }
      }
    }
  }
}
</style>
