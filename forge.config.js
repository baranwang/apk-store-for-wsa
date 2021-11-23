const path = require('path');
const fs = require('fs');

module.exports = {
  packagerConfig: {
    icon: path.resolve('resources', 'icon.ico'),
    asar: true,
  },
  makers: [
    {
      name: '@imxeno/electron-forge-maker-nsis',
    },
  ],
  plugins: [
    [
      '@electron-forge/plugin-webpack',
      {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/renderer.ts',
              name: 'main_window',
              preload: {
                js: "./src/preload.ts"
              }
            },
          ],
        },
      },
    ],
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'baranwang',
          name: 'apk-store-for-wsa',
        },
        prerelease: true,
      },
    },
  ],
  hooks: {
    postPackage(forgeConfig, options) {
      fs.copyFileSync(
        path.resolve('resources', 'platform-tools-latest-windows.zip'),
        path.resolve(
          options.outputPaths[0],
          'resources',
          'platform-tools-latest-windows.zip'
        )
      );
    },
  },
};
