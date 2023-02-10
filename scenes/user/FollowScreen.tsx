import { ConnectionDetection } from 'components/empty/OfflineView';
import React, { useCallback, useState } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { NavigationState, Route, SceneRendererProps, TabView, TabBar } from 'react-native-tab-view';
import { Colors, Spacing, Typography } from 'styles';
import { Header } from "components/header/Header";
import { get } from 'lodash';
import { useRoute } from "@react-navigation/native";
import { FollowingListTab } from './follow/FollowingListTab';
import { FollowerListTab } from './follow/FollowerListTab';

import { useTypedSelector } from 'utils/hooks/useTypedSelector';

export const FollowScreen = () => {
  const { params } = useRoute();
  const key = get(params, 'key', 0) as number;
  const pk = get(params, 'pk', 0) as number;
  const user_pk = useTypedSelector((state) => state.user.userInfo.id);

  const [index, setIndex] = useState(key);
  const [routes] = useState<Route[]>([
    {
      key: 'following',
      title: 'Đang theo dõi',
    },
    {
      key: 'follower',
      title: 'Người theo dõi',
    },
  ]);

  const renderScene = <T extends Route>({
    route,
  }: SceneRendererProps & { route: T }) => {
    switch (route.key) {
      case 'following':
        return <FollowingListTab
          is_me={user_pk == pk}
          pk={pk} />;
      case 'follower':
        return <FollowerListTab
          is_me={user_pk == pk}
          pk={pk} />
      default:
        return null;
    }
  };

  const renderTabBar = useCallback(
    <T extends Route>(
      props: SceneRendererProps & {
        navigationState: NavigationState<T>;
      },
    ) => {

      return <TabBar
        indicatorStyle={{ backgroundColor: Colors.black }}
        style={{ backgroundColor: Colors.white, elevation: 0, shadowOpacity: 0, }}
        renderLabel={({ route, focused }) => (
          <Text style={Typography.name_button}>{route.title}</Text>
        )}
        {...props}
      />;
    },
    [],
  );


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title={'Danh sách theo dõi'} />
      <ConnectionDetection.View>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: Spacing.screen.width }}
          renderTabBar={renderTabBar}
          lazy
        />
      </ConnectionDetection.View>
    </SafeAreaView>
  );
};

export default FollowScreen;
