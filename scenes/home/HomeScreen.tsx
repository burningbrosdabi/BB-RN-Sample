import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import { toast } from 'components/alert/toast';
import { ButtonType } from 'components/button/Button';
import { ConnectionDetection } from 'components/empty/OfflineView';
import { TabBar } from 'components/tabbar/TabBar';
import { FeatureDiscoveryContext } from 'components/tutorial/context';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import {
  NavigationState,
  Route, SceneMap, SceneRendererProps, TabView
} from 'react-native-tab-view';
import { AuthRouteSetting, RoutePath } from 'routes';
import { FeedTab } from 'scenes/feed/FeedTab';
import { FollowerListTab } from 'scenes/user/follow/FollowerListTab';
import { AppTourContext } from 'services/apptour/context';
import { JobType } from 'services/apptour/type';
import { linkService } from 'services/link/link.service';
import { NavigationService } from 'services/navigation';
import { Spacing } from 'styles';
import { storeKey } from 'utils/constant';
import { useActions } from 'utils/hooks/useActions';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { getHeaderLayout, unAwaited } from '_helper';
import { FollowingFeedTab } from './FollowingFeed/FollowingFeed';
import TipsTab from './magazine/MagazineListTab';

const HomeScreen = () => {
  const { isLoggedIn, } = useTypedSelector((state) => state.auth);

  const { userInfo, } = useTypedSelector((state) => state.user);
  const { jobs } = useContext(AppTourContext);
  const { discover } = useContext(FeatureDiscoveryContext);
  const [passAuth, setPassAuth] = useState(true);
  const { showDialog } = useActions()
  const navigation = useRef(useNavigation());

  useEffect(() => {
    if (!isLoggedIn && (passAuth == false)) {
      navigation.current.navigate(RoutePath.auth);
      return
    }
    // if (passAuth) {
    //   discover(storeKey.homeFeatureDiscovery)
    // }
  }, [passAuth, isLoggedIn]);

  useEffect(() => {
    const checkAuth = async () => {
      const passAuth = (await AsyncStorage.getItem(storeKey.passAuth) == 'true') ? true : false
      setPassAuth(passAuth)
    }
    unAwaited(checkAuth())
    jobs[JobType.onboarding].complete();

    linkService().onLink();
  }, []);



  const [index, setIndex] = useState(0);
  const [routes] = useState<Route[]>([
    {
      key: 'home',
      title: 'Trang chủ',
    },
    {
      key: 'following_feed',
      title: 'Đang theo dõi',
    },
    // {
    //   key: 'tips',
    //   title: 'Mix-Match',
    // },
  ]);

  const renderTabBar = <T extends Route>(
    props: SceneRendererProps & {
      navigationState: NavigationState<T>;
    },
  ) => {
    return <TabBar {...props} />;
  };

  return (
    <View style={{
      flex: 1, marginTop: getHeaderLayout().extra + 12,
    }}>
      <ConnectionDetection.View>
        <TabView
          navigationState={{ index, routes }}
          renderScene={SceneMap({
            home: FeedTab,
            following_feed: FollowingFeedTab,
            // tips: TipsTab,
          })}
          onIndexChange={setIndex}
          initialLayout={{ width: Spacing.screen.width }}
          renderTabBar={renderTabBar}
          timingConfig={{
            duration: 200,
          }}
          lazy
        />
        {/* <WebScreen uri={
          'https://m.dabi.com.vn/#/'
        } /> */}
      </ConnectionDetection.View>
    </View>
  );
};

export default HomeScreen;
