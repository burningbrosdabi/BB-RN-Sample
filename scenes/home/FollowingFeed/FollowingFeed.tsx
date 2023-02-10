import { useNavigation } from '@react-navigation/native';
import { EmptyView } from 'components/empty/EmptyView';
import { ConnectionDetection } from 'components/empty/OfflineView';
import { FeedbackBoxGrid } from 'components/list/post/FeedbackBoxGrid';
import { FeedbackList, FeedbackListRef, Layout } from 'components/list/post/FeedbackList.v2';
import { FeedbackInfo } from 'model';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, SafeAreaView, Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { applyOpacity, Colors, Typography } from 'styles';
import { dateTimeDiff } from 'utils/helper';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { feedStream, getUnReadFollowingFeed } from '_api';
import { NavigationService } from 'services/navigation';
import { AuthRouteSetting, RoutePath } from 'routes';
import { Header } from 'components/header/Header';
import { useNavigator } from 'services/navigation/navigation.service';
import { FeedDetailRouteSetting } from 'routes/feed/feed.route';
import ProfileImage from 'components/images/ProfileImage';
import LinearGradient from 'react-native-linear-gradient';
import HeightAndWeightScreen from 'scenes/onboarding/HeightAndWeightScreen';

`v1/feedbacks/?is_following=True&is_unread=True`;
export const FollowingFeedTab = () => {
  const listRef = useRef<FeedbackListRef>();
  const { isLoggedIn } = useTypedSelector(state => state.auth);

  useEffect(() => {
    const subscription = feedStream.subscribe(_ => {
      listRef?.current?.refresh();
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <ConnectionDetection.View>
        {isLoggedIn ? (
          <FeedbackList
            Header={<_Header />}
            showScrollToTopBtn={true}
            floatingButtonBottomMargin={24}
            isFollowingList
            layout={Layout.grid}
            renderAheadMultiply={1}
            ref={listRef}
            renderEmpty={() => { return <_Empty isLoggedIn={isLoggedIn} /> }}
          />
        ) : (
          <_Empty isLoggedIn={isLoggedIn} />
        )}
      </ConnectionDetection.View>
    </View>
  );
};

const _Empty = ({ isLoggedIn = false }: { isLoggedIn: boolean }) => {
  const navigation = useNavigation()

  return (
    <View style={{ paddingTop: 24, alignItems: 'center' }}>
      <Image style={{ width: 24, height: 24 }} source={require('assets/images/icon/measure.png')} />
      <Text style={{ ...Typography.body, textAlign: 'center' }}>
        Bạn có muốn kết nối với KOL{'\n'}có cùng size với bạn? {'\n'}Bắt đầu thôi nào!!
      </Text>
      <View style={{ height: 12 }} />
      <Ripple
        rippleContainerBorderRadius={14}
        onPress={() => {
          isLoggedIn ? navigation.navigate(RoutePath.auth, { screen: RoutePath.heightAndWeight }) : navigation.navigate(RoutePath.auth)
        }}
        style={{
          backgroundColor: Colors.black,
          borderRadius: 14,
          paddingVertical: 4,
          paddingHorizontal: 12,
        }}>
        <Text style={{ ...Typography.body, color: Colors.white }}>Tìm KOL của tôi</Text>
      </Ripple>
    </View >
  );
};
const MyCarousel = () => {
  const [feedData, setFeedData] = useState<FeedbackInfo[]>([]);
  const [feedCount, setFeedCount] = useState(0);
  const [isListEnd, setIsListEnd] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const navigator = useNavigator();

  const loadMoreFeed = async () => {
    const { results, count } = await getUnReadFollowingFeed({
      offset: feedCount,
      limit: 5,
    });
    if (feedCount + 5 >= count) {
      setIsListEnd(true);
    }
    setFeedCount(feedCount + 5);
    setFeedData(feedData.concat(results));
    setIsInitialLoad(false);
  };

  useEffect(() => {
    loadMoreFeed();
  }, []);

  const _renderItem = ({ item, index }: { item: FeedbackInfo; index: number }) => {
    const { created_at } = item;

    const _onPress = () => { navigator.navigate(new FeedDetailRouteSetting({ pk: item.pk })) }
    return (
      <Ripple onPress={_onPress}>
        <View
          key={`${item.pk}`}
          style={{
            width: 280,
            aspectRatio: 4 / 5,
            marginRight: 8,
          }}>
          <View
            style={{
            }}>
            <FeedbackBoxGrid data={item} showUser />
          </View>
        </View></Ripple>
    );
  };

  return (
    <View>
      {feedData.length > 0 && (
        <Text
          style={{
            paddingLeft: 16,
            ...Typography.name_button,
            textTransform: 'uppercase',
            paddingBottom: 12,
          }}>BẠN ĐÃ XEM BÀI ĐĂNG MỚI{'\n'}CỦA KOC/KOL YÊU THÍCH CHƯA?
        </Text>
      )}
      <FlatList
        data={feedData}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        horizontal
        removeClippedSubviews
        initialNumToRender={6}
        maxToRenderPerBatch={5}
        showsHorizontalScrollIndicator={false}
        renderItem={_renderItem}
      />
    </View>
  );
};

const _Header = () => {
  return (
    <View style={{ width: '100%' }}>
      <View style={{ height: 12 }} />
      <MyCarousel />
      <View
        style={{
          marginTop: 12,
          marginBottom: 12,
        }}
      />
    </View>
  );
};

export const FollowingFeedScreen = () => {
  return (
    <>
      <SafeAreaView>
        <Header />
      </SafeAreaView>
      <FollowingFeedTab />
    </>
  );
};
