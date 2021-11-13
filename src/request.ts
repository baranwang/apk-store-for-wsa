const { ipcRenderer } = window.require('electron');
export function request<T = any>(
  url: string,
  params: Record<string, any> = {}
): Promise<T> {
  return ipcRenderer.invoke('request', { url, params });
}
