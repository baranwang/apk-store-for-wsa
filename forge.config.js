const path = require('path');

module.exports = {
  packagerConfig: {
    icon: path.resolve('src', 'assets', 'icon.ico'),
    asar: true,
  },
  makers: [
    {
      name: 'electron-forge-maker-nsis',
      config: {
        targetArch: 'x64',
      },
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
};
