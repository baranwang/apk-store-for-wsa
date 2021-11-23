declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

interface Window {
  ipcRenderer: Electron.IpcRenderer;
  exec: typeof import('child_process').exec;
}