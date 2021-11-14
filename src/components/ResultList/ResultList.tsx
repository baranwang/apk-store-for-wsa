import {
  DefaultButton,
  DocumentCard,
  DocumentCardDetails,
  DocumentCardImage,
  DocumentCardLocation,
  DocumentCardTitle,
  ImageFit,
  Rating,
  Spinner,
  Text,
} from '@fluentui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './ResultList.module.less';

export const ResultList: React.FC<{
  containerRef: React.MutableRefObject<HTMLDivElement>;
  data: MyAppItem[];
  loadMore: () => void;
  isLoading: boolean;
}> = ({ containerRef, data, isLoading, loadMore }) => {
  const navigate = useNavigate();

  return (
    <div ref={containerRef} className={styles.list}>
      <div className={styles['list-wrap']}>
        {data.map((item) => (
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
        {isLoading ? (
          <Spinner label="加载中…" />
        ) : (
          <DefaultButton onClick={loadMore}>加载更多</DefaultButton>
        )}
      </div>
    </div>
  );
};
