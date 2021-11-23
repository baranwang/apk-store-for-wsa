import { MessageBoxSyncOptions } from 'electron';
const { ipcRenderer } = window;

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

const adbConnect = async (locaction = '127.0.0.1:58526') => {
  const adbBinPath = await ipcRenderer.invoke('get-adb-bin-path')
  return new Promise((resolve, reject) => {
    window.exec(
      `"${adbBinPath}" connect ${locaction}`,
      (error, stdout, stderr) => {
        if (error || stderr) {
          reject(error || stderr);
        } else {
          if (stdout.includes('cannot connect to')) {
            reject(stdout);
          } else {
            resolve(stdout);
          }
        }
      }
    );
  });
}

const adbInstall = async (apkPath: string) => {
  const adbBinPath = await ipcRenderer.invoke('get-adb-bin-path')
  return new Promise((resolve, reject) => {
    const command = `"${adbBinPath}" install ${apkPath}`;
    console.log('[run]', command);
    window.exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        if (stderr.includes('Success')) {
          resolve(stderr);
        } else {
          reject(stderr);
        }
      }
    });
  });
}

export const installApk = async (apkPath: string) => {
  try {
    await adbConnect()
  } catch (error) {
    throw ipcRenderer.invoke('show-message-box', {
      message: '安装失败',
      detail: '请打开 Windows Subsyetem for Andorid 的开发人员模式',
    } as MessageBoxSyncOptions);
  }

  try {
    await adbInstall(apkPath);
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
