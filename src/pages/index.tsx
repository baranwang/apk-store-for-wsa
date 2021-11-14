import React from 'react';
import { useRequest } from 'ahooks';
import { LoadMoreResult } from '@ahooksjs/use-request/lib/types';
import { getAppList } from '@/api';
import { useLocation } from 'react-router-dom';
import { ResultList } from '@/components/ResultList';

type LoadMoreResultForMyAppList = MyappListResponse & { list: MyAppItem[] };

export const HomePage = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const location = useLocation();

  const categoryId = React.useMemo(() => {
    return new URLSearchParams(location.search).get('cid');
  }, [location]);

  const { data, loadMore, loading, loadingMore } = useRequest(
    (d: LoadMoreResultForMyAppList) =>
      getAppList({
        categoryId: categoryId || '-1',
        contextData: d?.obj.contextData,
      }),
    {
      refreshDeps: [categoryId],
      loadMore: true,
      isNoMore: (d) => !d.obj?.contextData,
      ref: containerRef,
      formatResult: (d: MyappListResponse) => ({
        ...d,
        list: d.obj.appList,
      }),
      cacheKey: 'app-list',
    }
  ) as unknown as LoadMoreResult<LoadMoreResultForMyAppList>;

  return (
    <ResultList
      containerRef={containerRef}
      data={data.list}
      isLoading={loading || loadingMore}
      loadMore={loadMore}
    />
  );
};
