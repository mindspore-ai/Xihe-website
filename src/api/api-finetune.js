import { request } from '@/shared/axios';
import { LOGIN_KEYS } from '@/shared/login';

function getHeaderConfig() {
  const headersConfig = localStorage.getItem(LOGIN_KEYS.USER_TOKEN)
    ? {
        headers: {
          'private-token': localStorage.getItem(LOGIN_KEYS.USER_TOKEN),
        },
      }
    : {};
  return headersConfig;
}

/**
 * 获取微调任务列表
 * @returns
 */
export function getFinetune() {
  const url = `/server/finetune`;
  return request
    .get(url, { $doException: true, ...getHeaderConfig() })
    .then((res) => {
      console.log('res: ', res);
      return res.data;
    });
}
/**
 * 创建微调任务
 * @returns
 */
export function createFinetune(params) {
  const url = `/server/finetune`;
  return request.post(url, params, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 删除微调任务
 * @returns
 */
export function deleteFinetune(finetuneId) {
  const url = `/server/finetune/${finetuneId}`;
  return request.delete(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 终止微调任务
 * @returns
 */
export function terminateFinetune(finetuneId) {
  const url = `/server/finetune/${finetuneId}`;
  return request.put(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
/**
 * 获取微调任务日志
 * @returns
 */
export function getFinetuneLog(finetuneId) {
  const url = `/server/finetune/${finetuneId}/log`;
  return request.get(url, getHeaderConfig()).then((res) => {
    return res.data;
  });
}
