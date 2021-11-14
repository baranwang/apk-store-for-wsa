import React from 'react';
import { DefaultButton, Nav as MsNav } from '@fluentui/react';
import { useLocation, useNavigate } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');
import { installApk } from '@/api';

import styles from './Nav.module.less';

const categories = [
  { cid: '-1', key: 'all', name: '全部' },
  { cid: '103 ', key: 'video', name: '视频' },
  { cid: '101 ', key: 'music', name: '音乐' },
  { cid: '122 ', key: 'shop', name: '购物' },
  { cid: '102 ', key: 'read', name: '阅读' },
  { cid: '112 ', key: 'gps', name: '导航' },
  { cid: '106 ', key: 'social', name: '社交' },
  { cid: '104 ', key: 'photo', name: '摄影' },
  { cid: '110 ', key: 'news', name: '新闻' },
  { cid: '115 ', key: 'tool', name: '工具' },
  { cid: '119 ', key: 'ps', name: '美化' },
  { cid: '107 ', key: 'life', name: '生活' },
  { cid: '118 ', key: 'safe', name: '安全' },
  { cid: '114 ', key: 'stock', name: '理财' },
  { cid: '117 ', key: 'system', name: '系统' },
  { cid: '113 ', key: 'office', name: '办公' },
  { cid: '116 ', key: 'chat', name: '通讯' },
];

export const Nav: React.FC = () => {
  const navigate = useNavigate();

  const { pathname, search } = useLocation();

  const selectedKey = React.useMemo(() => {
    switch (pathname) {
      case '/':
        const cid = new URLSearchParams(search).get('cid');
        return categories.find((item) => item.cid === cid)?.key;
      case '/search':
        return 'search';
      default:
        break;
    }
  }, [pathname, search]);

  const [installLoading, setInstallLoading] = React.useState(false);

  return (
    <aside className={styles.nav}>
      <main>
        <MsNav
          selectedKey={selectedKey}
          groups={[
            {
              links: [
                {
                  name: '搜索',
                  key: 'search',
                  url: '/search',
                  icon: 'Search',
                },
                {
                  name: '分类',
                  url: '/',
                  links: categories.map(({ cid, key, name }) => ({
                    key,
                    name,
                    url: `/?cid=${cid}`,
                  })),
                  isExpanded: true,
                },
              ],
            },
          ]}
          onLinkClick={(e, item) => {
            e.preventDefault();
            navigate(item.url);
          }}
        />
      </main>
      <footer>
        <DefaultButton
          text={installLoading ? '安装中…' : '导入 APK'}
          disabled={installLoading}
          onClick={() => {
            ipcRenderer.invoke('select-apk').then((path) => {
              setInstallLoading(true);
              installApk(path).finally(() => {
                setInstallLoading(false);
              });
            });
          }}
        />
      </footer>
    </aside>
  );
};
