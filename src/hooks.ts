import { app, dialog, ipcMain, net, shell } from 'electron';
import { URL } from 'url';
import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

export const hooks = (): void => {
  ipcMain.handle('request', async (event, args) => {
    const url = new URL(args.url);
    Object.keys(args.params).forEach((key) => {
      url.searchParams.append(key, args.params[key]);
    });
    console.log('[request]', url.toString());
    return new Promise((resolve, reject) => {
      const req = net.request(url.toString());
      req.on('response', (response) => {
        const res: Buffer[] = [];
        response.on('data', (chuck) => {
          res.push(chuck);
        });
        response.on('error', reject);
        response.on('end', () => {
          const data = Buffer.concat(res);
          try {
            resolve(JSON.parse(data.toString()));
          } catch (error) {
            resolve(data);
          }
        });
      });
      req.end();
    });
  });

  ipcMain.handle(
    'save-apk',
    (event, args: { data: Uint8Array; name: string }) => {
      const downloadPath = fs.readFileSync(
        path.resolve(app.getPath('userData'), 'download-path'),
        'utf-8'
      );
      const filePath = path.resolve(downloadPath, args.name);

      return new Promise((resolve, reject) => {
        fs.writeFile(filePath, args.data, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve(filePath);
          }
        });
      });
    }
  );

  ipcMain.handle('get-installed-apps', () => {
    const startMenuPath = path.resolve(
      app.getPath('appData'),
      'Microsoft',
      'Windows',
      'Start Menu',
      'Programs'
    );
    const appList: string[] = [];
    fs.readdirSync(startMenuPath)
      .filter((file) => file.includes('lnk'))
      .forEach((file) => {
        const lnk = shell.readShortcutLink(path.join(startMenuPath, file));
        if (lnk.target.includes('WsaClient.exe')) {
          appList.push(lnk.appUserModelId);
        }
      });
    return appList;
  });

  ipcMain.handle('open-app', (event, args) => {
    const basePath = path.resolve(
      app.getPath('home'),
      'AppData',
      'Local',
      'Microsoft',
      'WindowsApps'
    );
    const wsaPath = fs
      .readdirSync(basePath)
      .find((file) =>
        file.includes('WindowsSubsystemForAndroid')
      );
    const wsa = path.resolve(basePath, wsaPath, 'WsaClient.exe');
    exec(`"${wsa}" /launch wsa://"${args}"`);
  });

  ipcMain.handle('select-apk', () => {
    return new Promise((resolve, reject) => {
      const files = dialog.showOpenDialogSync({
        title: '选择 APK 文件',
        filters: [{ name: 'APK', extensions: ['apk'] }],
        properties: ['openFile'],
      });
      if (files && files.length) {
        resolve(files[0]);
      } else {
        reject();
      }
    });
  });

  ipcMain.handle('show-message-box', (event, args) => {
    dialog.showMessageBoxSync({
      title: app.getName(),
      ...args
    });
  });
};
