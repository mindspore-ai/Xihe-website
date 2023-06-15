<script setup>
import { useRouter } from 'vue-router';
import OButton from '@/components/OButton.vue';

const router = useRouter();

const prop = defineProps({
  title: {
    type: String,
    default: '',
  },
  introduce: {
    type: String,
    default: '',
  },
  url: {
    type: String,
    default: '',
  },
  path: {
    type: String,
    default: '',
  },
  openness: {
    type: Boolean,
    default: false,
  },
});
function goExperience() {
  window.open(`${prop.path}`);
}
function goIntroduction() {
  router.push(`${prop.path}/introduce`);
}
</script>
<template>
  <div :class="openness ? 'card' : 'card-closed'">
    <div class="card-top">
      <img class="cover" :src="prop.url" alt="" />
    </div>
    <div class="card-bottom">
      <div class="card-desc">
        <div class="card-bottom-title">
          <p>{{ prop.title }}</p>
        </div>
        <div class="card-bottom-text">{{ prop.introduce }}</div>
      </div>
      <div v-if="prop.openness" class="card-btn">
        <OButton
          size="mini"
          :type="prop.title === '鹏程.神农' ? 'primary' : 'outline'"
          animation
          @click="goIntroduction"
        >
          查看介绍
        </OButton>
        <OButton
          v-if="prop.title !== '鹏程.神农'"
          size="mini"
          type="primary"
          animation
          @click="goExperience"
        >
          在线体验
        </OButton>
      </div>
      <div v-else class="card-btn">
        <OButton size="mini" type="secondary"> 敬请期待 </OButton>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.card {
  height: 100%;
  padding: 16px 16px 24px;
  background-color: #fff;
  border-radius: 16px;

  .card-top {
    width: 100%;
    overflow: hidden;
    border-radius: 8px;
    .cover {
      width: 100%;
      height: 146px;
      transform: scale(1);
      transition: all 0.2s linear;
    }
  }
  .card-bottom {
    height: calc(100% - 146px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .card-bottom-title {
      font-size: 20px;
      color: #000000;
      line-height: 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 0 8px;
      .closed {
        font-size: 16px;
        color: #999999;
        line-height: 24px;
      }
    }
    .card-bottom-text {
      margin-bottom: 24px;
      font-size: 14px;
      color: #555;
      line-height: 22px;
    }
    .card-btn {
      font-size: 14px;
      display: flex;
      justify-content: flex-end;
      .o-button {
        width: 88px;
        height: 32px;
        &:last-child {
          margin-left: 16px;
        }
      }
    }
  }
  &:hover {
    box-shadow: 0px 1px 16px 0px rgba(0, 0, 0, 0.05);
    transition: all 0.2s linear;
    .cover {
      transform: scale(1.05);
      transition: all 0.2s linear;
    }
  }
  @media screen and (max-width: 821px) {
    .card-bottom .card-bottom-text {
      max-width: 326px;
    }
  }
  @media screen and (max-width: 820px) {
    padding: 8px 8px 16px;
    .card-bottom .card-bottom-title {
      font-size: 14px;
      padding: 16px 0 8px;
    }
    .card-bottom .card-bottom-text {
      max-width: 326px;
      font-size: 12px;
      margin-bottom: 16px;
    }
  }
}
.card-closed {
  height: 100%;
  padding: 16px 16px 24px;
  background-color: #fff;
  cursor: auto;
  border-radius: 16px;
  .card-top {
    width: 100%;
    overflow: hidden;
    .cover {
      width: 100%;
      height: 146px;
      border-radius: 8px;
      transform: scale(1);
      transition: all 0.2s linear;
    }
  }
  .card-bottom {
    .card-bottom-title {
      font-size: 20px;
      color: #000000;
      line-height: 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 0 8px;
      .closed {
        font-size: 16px;
        color: #999999;
        line-height: 24px;
      }
    }
    .card-bottom-text {
      max-width: 434px;
      margin-bottom: 24px;
      font-size: 14px;
      color: #555;
      line-height: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .card-btn {
      font-size: 14px;
      display: flex;
      justify-content: flex-end;
      .o-button {
        width: 88px;
        height: 32px;
      }
    }
  }
  @media screen and (max-width: 821px) {
    padding: 8px 8px 16px;
    .card-bottom .card-bottom-title {
      font-size: 14px;
      padding: 16px 0 8px;
    }
    .card-bottom .card-bottom-text {
      max-width: 326px;
      font-size: 12px;
      margin-bottom: 16px;
    }
  }
}
</style>
