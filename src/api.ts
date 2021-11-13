import { request } from './request';

export const getAppList = ({
  listType = 23,
  categoryType = 1,
  categoryId = -1,
  pageSize = 52,
  contextData = '',
} = {}) =>
  request<MyappListResponse>('https://m5.qq.com/app/applist.htm', {
    listType,
    categoryType,
    categoryId,
    pageSize,
    contextData,
  });

export const getAppDetail = (pkgName: string) =>
  request<MyappDetailResponse>('https://m5.qq.com/app/getappdetail.htm', {
    pkgName,
    sceneId: 0,
  });
