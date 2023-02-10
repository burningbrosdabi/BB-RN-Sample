import { GenericErrorView } from 'components/empty/EmptyView';
import { range } from 'lodash';
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Fade, Placeholder } from 'rn-placeholder';
import { Banner } from 'services/api/home';
import { unAwaited } from 'utils/helper';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { getMainBanner } from '_api';
import BannerBox, { BannerBoxPlaceholder } from 'components/banner/BannerBox';
const TipsTab = () => {
  const { state, data, excecute, refresh } = useAsync(getMainBanner);
  const [refreshing, setRefreshing] = useState(false);

  const _renderItem = ({ item }: { item: Banner }) => {
    return <BannerBox banner={item} />;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  useEffect(() => {
    unAwaited(excecute());
  }, []);

  const keyExtractor = (item: Banner) => `${item.pk}`;

  switch (state) {
    case ConnectionState.hasData:
      return (
        <FlatList
          refreshing={refreshing}
          onRefresh={onRefresh}
          data={data}
          renderItem={_renderItem}
          contentContainerStyle={{ paddingTop: 12 }}
          keyExtractor={keyExtractor}
        />
      );
    case ConnectionState.hasEmptyData:
    case ConnectionState.hasError:
      return (
        <GenericErrorView action={{
          text: 'Thử lại',
          onPress: excecute
        }} />
      );
    case ConnectionState.waiting:
    default:
      return <_Placeholder />;
  }
};

const _Placeholder = () => {
  return (
    <View style={{ flex: 1, paddingTop: 12 }}>
      <Placeholder Animation={Fade}>
        {range(5).map((_, i) => (
          <BannerBoxPlaceholder key={i} />
        ))}
      </Placeholder>
    </View>
  );
};

export default React.memo(TipsTab);
