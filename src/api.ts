import { MessageBoxSyncOptions } from 'electron';
const { ipcRenderer } = window.require('electron');

export function request<T = any>(
  url: string,
  params: Record<string, any> = {}
): Promise<T> {
  return ipcRenderer.invoke('request', { url, params });
}

export const getAppList = ({
  listType = 23,
  categoryType = 1,
  categoryId = '-1',
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

export const searchAppList = ({
  keyword = '',
  searchScene = 1,
  pageSize = 20,
  contextData = '',
} = {}) =>
  request<SearchMyappResponse>('https://m5.qq.com/pcsoftmgr/searchapp.htm', {
    keyword,
    searchScene,
    pageSize,
    contextData,
  });

export const getAppDetail = (pkgName: string) =>
  request<MyappDetailResponse>('https://m5.qq.com/app/getappdetail.htm', {
    pkgName,
    sceneId: 0,
  });

export const installApk = async (apkPath: string) => {
  try {
    await ipcRenderer.invoke('adb-connect');
  } catch (error) {
    throw ipcRenderer.invoke('show-message-box', {
      message: '安装失败',
      detail: '请打开 Windows Subsyetem for Andorid 的开发人员模式',
    } as MessageBoxSyncOptions);
  }

  try {
    await ipcRenderer.invoke('adb-install', apkPath);
  } catch (error) {
    console.error(error);
    throw ipcRenderer.invoke('show-message-box', {
      message: '安装失败',
      detail:
        'apk 文件损坏，或其他未知原因，尝试其他渠道下载 apk 文件并导入安装',
    } as MessageBoxSyncOptions);
  }

  ipcRenderer.invoke('show-message-box', {
    type: 'info',
    message: '安装成功',
  } as MessageBoxSyncOptions);
};
