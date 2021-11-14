import React from 'react';
import { useRequest } from 'ahooks';
import { LoadMoreResult } from '@ahooksjs/use-request/lib/types';
import { searchAppList } from '@/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { ResultList } from '@/components/ResultList';
import { SearchBox, Text } from '@fluentui/react';

import styles from './search.module.less';

type LoadMoreResultForSearchMyAppList = SearchMyappResponse & {
  list: MyAppItem[];
};

export const SearchPage = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const location = useLocation();

  const navigate = useNavigate();

  const keyword = React.useMemo(() => {
    return new URLSearchParams(location.search).get('keyword') || '';
  }, [location.search]);

  const { data, loadMore, loading, loadingMore } = useRequest(
    (d: SearchMyappResponse) =>
      searchAppList({
        keyword,
        contextData: d?.obj.contextData,
      }),
    {
      refreshDeps: [keyword],
      ready: !!keyword,
      loadMore: true,
      isNoMore: (d) => !d.obj?.contextData,
      ref: containerRef,
      formatResult: (d: SearchMyappResponse) => ({
        ...d,
        list: d.obj?.dataList.map((item) => ({
          ...item.appInfo,
          type: item.type,
        })),
      }),
      cacheKey: 'app-list',
    }
  ) as unknown as LoadMoreResult<LoadMoreResultForSearchMyAppList>;

  return (
    <>
      <div className={styles['search-box']}>
        <SearchBox
          placeholder="关键词"
          defaultValue={keyword}
          onSearch={(value) => {
            navigate(`/search?keyword=${value}`, { replace: true });
          }}
        />
        <Text className={styles['search-box-keyword']} variant="xLarge" block>
          {keyword}
        </Text>
      </div>
      {!!data.list.length && (
        <ResultList
          containerRef={containerRef}
          data={data.list}
          isLoading={loading || loadingMore}
          loadMore={loadMore}
        />
      )}
    </>
  );
};
