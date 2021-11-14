import { getAppDetail, installApk, request } from '@/api';
import { DefaultButton, Image, PrimaryButton, Text } from '@fluentui/react';
import { useRequest } from 'ahooks';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SwiperCore, { Navigation, Mousewheel } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Section } from '@/components/Section';
const { ipcRenderer } = window.require('electron');
import { MessageBoxSyncOptions } from 'electron';

import 'swiper/css';
import styles from './detail.module.less';

SwiperCore.use([Navigation, Mousewheel]);

export const DetailPage = () => {
  const { pkgName } = useParams<'pkgName'>();

  const navigate = useNavigate();

  const { data } = useRequest(() => getAppDetail(pkgName), {
    ready: !!pkgName,
    refreshDeps: [pkgName],
    cacheKey: `app-detail-${pkgName}`,
    formatResult: (d) => d.obj.appInfo,
  });

  const [installed, setInstalled] = React.useState(false);

  const [downloadLoading, setDownloadLoading] = React.useState(false);

  React.useEffect(() => {
    if (!data) return;
    console.log('get-installed-apps');
    ipcRenderer.invoke('get-installed-apps').then((apps: string[]) => {
      setInstalled(apps.includes(data.pkgName));
    });
  }, [data, downloadLoading]);

  const handlerActionButton = React.useCallback(async () => {
    if (installed) {
      try {
        await ipcRenderer.invoke('open-app', data.pkgName);
      } catch (error) {
        throw ipcRenderer.invoke('show-message-box', {
          message: '启动失败',
          detail: '请尝试从开始菜单中打开',
        } as MessageBoxSyncOptions);
      }
    } else {
      if (downloadLoading) return;
      setDownloadLoading(true);

      let apkUint8Array: any;
      try {
        apkUint8Array = await request(data.apkUrl);
      } catch (error) {
        throw ipcRenderer.invoke('show-message-box', {
          message: '下载失败',
          detail: '尝试重新下载或者直接导入 apk 文件安装',
        } as MessageBoxSyncOptions);
      }

      let apkPath: string;
      try {
        apkPath = await ipcRenderer.invoke('save-apk', {
          data: apkUint8Array,
          name:
            new URL(data.apkUrl).searchParams.get('fsname') ||
            `${data.pkgName}.apk`,
        });
      } catch (error) {
        throw ipcRenderer.invoke('show-message-box', {
          message: '文件保存失败',
          detail: '尝试重新下载或者直接导入 apk 文件安装',
        } as MessageBoxSyncOptions);
      }

      await installApk(apkPath);
    }
  }, [data, installed]);

  if (!data) {
    return <></>;
  }

  return (
    <>
      <div className={styles.main}>
        <Section className={styles.hd}>
          <Image src={data.iconUrl} width={96} height={96} />
          <Text className={styles.title} variant="xxLarge" block>
            {data.appName}
          </Text>
          <Text block>{data.authorName}</Text>
          <PrimaryButton
            className={styles.actionButton}
            iconProps={{
              iconName: downloadLoading ? 'ProgressRingDots' : null,
            }}
            onClick={() => {
              handlerActionButton().finally(() => {
                setTimeout(() => {
                  setDownloadLoading(false);
                }, 1000);
              });
            }}>
            {installed ? '打开应用' : '下载并安装'}
          </PrimaryButton>
          <div className={styles.desc} title={data.description}>
            {data.description.split('\n').map((item, i) => (
              <Text key={i} block>
                {item}
              </Text>
            ))}
          </div>
          <DefaultButton
            onClick={() => {
              navigate(`/?cid=${data.categoryId}`);
            }}>
            {data.categoryName}
          </DefaultButton>
        </Section>
        <div className={styles.bd}>
          <Section title="屏幕截图">
            <Swiper
              className={styles.screenshot}
              navigation
              cssMode
              spaceBetween={8}
              slidesPerView={'auto'}>
              {data.screenshots.map((item) => (
                <SwiperSlide key={item} className={styles['screenshot-item']}>
                  <img src={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          </Section>
          <Section title="描述">
            {data.description.split('\n').map((item, i) => (
              <Text key={i} block>
                {item}
              </Text>
            ))}
          </Section>
        </div>
      </div>
    </>
  );
};
