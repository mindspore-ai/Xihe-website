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
  return request.get(url).then((res) => {
    return res.data;
  });
}
