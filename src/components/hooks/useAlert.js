import { createVNode, render } from 'vue';
import OAlert from '../OAlert.vue';

let time = null;
const divVNode = createVNode('div');
render(divVNode, document.body);
// 🔔 虚拟DOM(对象)成功写入到页面后，可通过 el 属性获取到真实DOM节点
const div = divVNode.el;

const Message = ({ message, type }) => {
  const comVNode = createVNode(OAlert, { message, type });
  render(comVNode, div);
  time = setTimeout(() => {
    render(null, div);
    clearTimeout(time);
    time = null;
  }, 2000);
};
export default Message;
