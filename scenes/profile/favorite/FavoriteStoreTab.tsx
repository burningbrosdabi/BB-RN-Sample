import { EmptyView } from 'components/empty/EmptyView';
import { StoreBoxPlaceholderRow } from 'components/list/store/StoreBoxPlaceholder';
import { List } from 'components/list/store/StoreList.v2';
import { range } from 'lodash';
import React from 'react';
import { View } from 'react-native';
import { Fade, Placeholder } from 'rn-placeholder';
import { getStores, StoreListFilter } from '_api';
import { PaginationFetch } from 'services/http/type';
import { StoreListItem } from 'model';

const StoreFollowingTab = () => {
  const fetch: PaginationFetch<StoreListItem, StoreListFilter> = (next, filter) => {
    return getStores(next, {
      ...filter,
      is_following: true,
    });
  };

  return <List.Store fetch={fetch} Empty={<_Empty />} />;
};

const _Empty = () => (
  <EmptyView
      title={'Bạn chưa theo dõi cửa hàng nào'}
      titleStyle={{ marginTop: 24 }}
      description={'Hãy theo dõi để nhận được\nthông tin mới nhất nhé!'}
      descriptionStyle={{ marginTop: 6 }}
      file={require('_assets/images/icon/info_not_following.png')}
  />
)

const _Placeholder = () => {
  return (
    <View>
      <Placeholder Animation={Fade}>
        {range(5).map((_, index) => {
          return (
            <View key={index}>
              <StoreBoxPlaceholderRow />
            </View>
          );
        })}
      </Placeholder>
    </View>
  );
};

export default React.memo(StoreFollowingTab);
