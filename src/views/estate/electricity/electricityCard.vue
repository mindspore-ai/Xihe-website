<script setup>
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
  router.push(`/${prop.type}/${prop.cardData.id}`);
}
</script>
<template>
  <div class="electricity-card">
    <div class="card-top">
      <img class="cover" :src="cardData.poster" alt="" />
      <div class="card-title">
        <span class="card-name">
          {{ cardData.name }}
        </span>
        <span class="card-type">免费</span>
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
  // height: 100%;
  padding: 12px 12px 24px;
  background-color: #fff;
  border-radius: 16px;
  cursor: pointer;
  .card-top {
    position: relative;
    border-radius: 8px;
    .cover {
      width: 100%;
      height: 149px;
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
      color: #2c2c2c;
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
  }
}
</style>
