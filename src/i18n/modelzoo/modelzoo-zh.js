import taichu from '@/assets/imgs/modelzoo/taichu.jpg';
import luojia from '@/assets/imgs/modelzoo/Luojia.jpg';
import pangu from '@/assets/imgs/modelzoo/pangu.jpg';
import shenlong from '@/assets/imgs/modelzoo/shenlong.jpg';
import dasheng from '@/assets/imgs/modelzoo/dasheng.jpg';
import wukong from '@/assets/imgs/wukong/wukong-banner1.jpg';
export default {
  MODELZOO_TITLE: '大模型',
  MODELZOO_DESC: '在线体验预训练超大模型任务',
  WAITING: '敬请期待',
  VIEW_MORE: '点击去往ModelZoo查看更多大模型',
  MODELZOO_CARDS: [
    {
      TITLE: '悟空画画',
      INTRODUCE:
        '华为诺亚方舟实验室与MindSpore社区联合打造的中文图像生成大模型',
      PATH: '/modelzoo/wukong',
      OPENNESS: '1',
      IMG_URL: wukong,
    },
    {
      TITLE: '紫东.太初',
      INTRODUCE: '全球首个三模态千亿参数大模型',
      PATH: '/modelzoo/taichu',
      OPENNESS: '1',
      IMG_URL: taichu,
    },

    {
      TITLE: '武大.LuoJia',
      INTRODUCE: '全球首个遥感专用框架及最大遥感样本库',
      PATH: '/modelzoo/luojia',
      OPENNESS: '1',
      IMG_URL: luojia,
    },
    {
      TITLE: '鹏程.盘古',
      INTRODUCE: '业界首个千亿级参数中文自然语言处理大模型',
      PATH: '/modelzoo/pangu',
      OPENNESS: '1',
      IMG_URL: pangu,
    },
    {
      TITLE: '鹏程.神农',
      INTRODUCE: '面向生物医学领域的人工智能平台',
      PATH: '/modelzoo/shennong',
      OPENNESS: '1',
      IMG_URL: shenlong,
    },
    {
      TITLE: '鹏程.大圣',
      INTRODUCE: '业界首个千亿参数规模机器视觉分析领域大模',
      PATH: '',
      OPENNESS: '',
      IMG_URL: dasheng,
    },
  ],
};
