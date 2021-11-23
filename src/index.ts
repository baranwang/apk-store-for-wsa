import { app, BrowserWindow, globalShortcut, ipcMain, session } from 'electron';
import { hooks } from './hooks';
import * as fs from 'fs';
import * as path from 'path';
import unzipper from 'unzipper';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#eee',
    },
    webPreferences: {
      contextIsolation: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  session.defaultSession.webRequest.onBeforeSendHeaders(
    { urls: ['https://m5.qq.com/*', 'https://imtt.dd.qq.com/*'] },
    (details, callback) => {
      details.requestHeaders[
        'User-Agent'
      ] = `Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36 QBCore/3.43.815.400 QQBrowser/9.0.2524.400`;
      callback({ requestHeaders: details.requestHeaders });
    }
  );

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: Object.assign(details.responseHeaders, {
        'Content-Security-Policy': [
          "default-src 'self' 'unsafe-inline' 'unsafe-eval' http: https: ws: data: blob:",
        ],
      }),
    });
  });

  globalShortcut.register('CmdOrCtrl+F12', () => {
    BrowserWindow.getFocusedWindow()?.webContents.toggleDevTools();
  });

  hooks();

  const adbBinPath = path.resolve(
    app.getPath('userData'),
    'platform-tools',
    'adb.exe'
  );

  ipcMain.handle('get-adb-bin-path', () => adbBinPath);

  const downloadPathDataFile = path.resolve(
    app.getPath('userData'),
    'download-path'
  );

  fs.existsSync(downloadPathDataFile) ||
    fs.writeFileSync(downloadPathDataFile, app.getPath('downloads'), 'utf-8');

  if (!fs.existsSync(adbBinPath)) {
    fs.createReadStream(
      path.resolve('resources', 'platform-tools-latest-windows.zip')
    ).pipe(unzipper.Extract({ path: app.getPath('userData') }));
  }
});
