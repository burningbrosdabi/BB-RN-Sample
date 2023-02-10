import { ConnectionDetection } from 'components/empty/OfflineView';
import React, { useMemo } from 'react';
import { SafeAreaView, View } from 'react-native';
import HomeTab from 'scenes/home/HomeTab';
import { HomeList, remoteConfigService } from 'services/remote.config';
import { FeedTab } from './FeedTab';
import HeaderTitle from 'components/header/HeaderTitle';

const FeedScreen = () => {
  const listType = useMemo(() => {
    return remoteConfigService().getHomeLayout();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {listType === HomeList.product ? <FeedTab /> : <HomeTab />}
    </View>
  );
};

export default FeedScreen;
