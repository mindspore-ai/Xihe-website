import { request } from '@/shared/axios';
// import { useUserInfoStore } from '@/stores';
/**
 * 搜索页回车查询数据
 * @returns
 */
export function getSearchData(params) {
  const url = `/api/base/search/`;
  // const url = `/api/base/search/?name=${params}`;
  return request.get(url, { params }).then((res) => {
    return res.data;
  });
}
