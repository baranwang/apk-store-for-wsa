import { ipcMain, net } from 'electron';
import { URL } from 'url';

export const hooks = (): void => {
  ipcMain.handle('request', async (event, args) => {
    const url = new URL(args.url);
    Object.keys(args.params).forEach((key) => {
      url.searchParams.append(key, args.params[key]);
    });
    console.log(url.toString());
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


  // ipcMain.handle('adb-connect', (event, args) => {
    
  // })
};
