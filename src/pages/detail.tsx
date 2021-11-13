import { getAppDetail } from '@/api';
import { DefaultButton, Image, PrimaryButton, Text } from '@fluentui/react';
import { useRequest } from 'ahooks';
import React from 'react';
import { useParams } from 'react-router-dom';
import SwiperCore, { Navigation, Mousewheel } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import styles from './detail.module.less';
import { Section } from '@/components/Section';

SwiperCore.use([Navigation, Mousewheel]);

export const DetailPage = () => {
  const { pkgName } = useParams<'pkgName'>();

  const { data } = useRequest(() => getAppDetail(pkgName), {
    ready: !!pkgName,
    refreshDeps: [pkgName],
    cacheKey: `app-detail-${pkgName}`,
    formatResult: (d) => d.obj.appInfo,
  });

  if (!data) {
    return <></>;
  }

  return (
    <div className={styles.main}>
      <div className={styles.hd}>
        <Image src={data.iconUrl} width={96} height={96} />
        <Text className={styles.title} variant="xxLarge" block>
          {data.appName}
        </Text>
        <Text block>{data.authorName}</Text>
        <PrimaryButton className={styles.downloadButton}>
          下载并安装
        </PrimaryButton>
        <div className={styles.desc} title={data.description}>
          {data.description.split('\n').map((item, i) => (
            <Text key={i} block>
              {item}
            </Text>
          ))}
        </div>
        <DefaultButton>{data.categoryName}</DefaultButton>
      </div>
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
      </div>
    </div>
  );
};
