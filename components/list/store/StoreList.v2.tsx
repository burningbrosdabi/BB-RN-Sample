import { InfiniteScrollList, PaggingScrollList } from 'components/list/InfiniteScrollList';
import { StoreListItem } from 'model';
import { StoreListFilter } from '_api';
import { RenderProps } from 'components/list/RenderProps';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { ActivityIndicator, View } from 'react-native';
import React, { useMemo } from 'react';
import { screen } from 'styles/spacing';
import StoreBox from 'components/list/store/StoreBox';
import { usePagingFetch } from 'components/list/PagingFlatList';
import { PaginationFetch, PaginationResponse } from 'services/http/type';
import { isNil, pick, range } from 'lodash';
import { Fade, Placeholder } from 'rn-placeholder';
import {
  StoreBoxPlaceholder,
  StoreBoxPlaceholderRow,
} from 'components/list/store/StoreBoxPlaceholder';
import { GenericErrorView } from 'components/empty/EmptyView';

interface Props {
  fetch: PaginationFetch<StoreListItem, StoreListFilter>;
  Empty?: JSX.Element;
}

const Store = ({ fetch, Empty }: Props) => {
  const item = useMemo(() => {
    return new RenderProps<StoreListItem>({
      builder: {
        none: () => <_Placeholder />,
        hasEmptyData: !isNil(Empty) ? () => Empty : undefined,
        hasData: (dimension, data) => <StoreBox key={`${data!.pk}`} data={data!} />,
        hasError: () => <GenericErrorView />,
      },
      dimension: {
        item: { width: screen.width, height: (screen.width * 151) / 360 },
      },
      getTypeByData: () => 'item',
    });
  }, [Empty]);

  return (
    <PaggingScrollList<StoreListItem, StoreListFilter>
      fetch={fetch}
      infRender={infRender}
      item={item}
    />
  );
};

const infRender = (state: ConnectionState) => {
  if (state === ConnectionState.waiting) {
    return <_Placeholder />;
  }
  return <></>;
};

const _Placeholder = () => (
  <Placeholder Animation={Fade}>
    {range(5).map((_, index) => (
      <StoreBoxPlaceholderRow key={`${index}`} />
    ))}
  </Placeholder>
);

export const List = {
  Store,
};
