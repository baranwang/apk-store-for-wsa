import React from 'react';
import { useRequest } from 'ahooks';
import { LoadMoreResult } from '@ahooksjs/use-request/lib/types';
import { getAppList } from '@/api';
import {
  DocumentCard,
  DocumentCardImage,
  ImageFit,
  DocumentCardTitle,
  DocumentCardLocation,
  DocumentCardDetails,
  Rating,
  Text,
  DefaultButton,
  Spinner,
} from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.less';

type LoadMoreResultForMyAppList = MyappListResponse & { list: MyAppItem[] };

export const HomePage = (): JSX.Element => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { data, loadMore, loading, loadingMore } = useRequest(
    (d: LoadMoreResultForMyAppList) =>
      getAppList({ contextData: d?.obj.contextData }),
    {
      loadMore: true,
      isNoMore: (d) => !d.obj.contextData,
      ref: containerRef,
      formatResult: (d: MyappListResponse) => ({
        ...d,
        list: d.obj.appList,
      }),
      cacheKey: 'app-list',
    }
  ) as unknown as LoadMoreResult<LoadMoreResultForMyAppList>;

  const navigate = useNavigate();

  return (
    <div ref={containerRef} className={styles.list}>
      <div className={styles['list-wrap']}>
        {data.list.map((item) => (
          <DocumentCard
            key={item.appId}
            className={styles['card-item']}
            onClick={() => {
              console.log(item);
              navigate(`/detail/${item.pkgName}`);
            }}>
            <DocumentCardImage
              className={styles['card-item-icon']}
              imageSrc={item.iconUrl}
              imageFit={ImageFit.centerContain}
              height={96}
            />
            <DocumentCardLocation location={item.categoryName} />
            <DocumentCardTitle
              className={styles['card-item-title']}
              title={item.appName}></DocumentCardTitle>
            <DocumentCardDetails className={styles['card-item-desc']}>
              <Rating max={5} rating={item.averageRating} readOnly />
              <Text>免费安装</Text>
            </DocumentCardDetails>
          </DocumentCard>
        ))}
      </div>
      <div className={styles['load-more']}>
        {loading || loadingMore ? (
          <Spinner label="加载中…" />
        ) : (
          <DefaultButton onClick={loadMore}>加载更多</DefaultButton>
        )}
      </div>
    </div>
  );
};
