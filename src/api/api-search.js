import { request } from '@/shared/axios';

/**
 * 搜索页回车查询数据
 * @returns
 */
export function getSearchData(params) {
  const url = '/server/search';
  return request.get(url, { params }).then((res) => {
    return res;
  });
}
