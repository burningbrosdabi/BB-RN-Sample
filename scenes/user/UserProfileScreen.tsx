import { useNavigation, useRoute } from '@react-navigation/native';
import { DabiFont } from 'assets/icons';
import { ButtonType } from 'components/button/Button';
import { DEFAULT_IC_BTN_PADDING } from 'components/button/IconButton';
import { EmptyView, GenericErrorView } from 'components/empty/EmptyView';
import { ConnectionDetection } from 'components/empty/OfflineView';
import { Header, HeaderNotificationButton } from 'components/header/Header';
import { FeedbackBoxGrid } from 'components/list/post/FeedbackBoxGrid';
import { PlaceholderGrid } from 'components/list/post/FeedbackList.v2';
import { ProductBox, ProductBoxPlaceholderRow } from 'components/list/product/ProductBox';
import { get, isNil, range } from 'lodash';
import { FeedbackInfo, ProductInfo } from 'model';
import { UserType } from 'model/user/user';
import React, { useEffect, useState } from 'react';
import { Linking, SafeAreaView, Text, View } from 'react-native';
import { HFlatList, HScrollView } from 'react-native-head-tab-view';
import { NavigationState, Route, SceneMap, SceneRendererProps, TabBar } from 'react-native-tab-view';
import { CollapsibleHeaderTabView } from 'react-native-tab-view-collapsible-header';
import { Fade, Placeholder } from 'rn-placeholder';
import { AuthRouteSetting, RoutePath } from 'routes';
import { NavigationService } from "services/navigation";
import { useNavigator } from "services/navigation/navigation.service";
import { Colors, Spacing, Typography } from 'styles';
import { HEADER_HEIGHT } from 'utils/helper';
import { useActions } from 'utils/hooks/useActions';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { createUserDetailLog, getKolProfileDetail, getKolProfileFeedbackList, getTaggedProduct } from '_api';
import UserProfile, { UserProfilePlaceholder } from './UserProfile';




const _UserFeedTab = (pk: number, isMe: Boolean, isKol: Boolean) => {
  const [feedData, setFeedData] = useState<FeedbackInfo[]>([])
  const [feedCount, setFeedCount] = useState(0)
  const [isListEnd, setIsListEnd] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const loadMoreFeed = async () => {
    if (pk == 0) {
      setIsInitialLoad(false)
      setIsListEnd(true)
      return
    }
    const { results, count } = await getKolProfileFeedbackList({
      pk,
      offset: feedCount, limit: 10
    });
    if (feedCount + 10 >= count) {
      setIsListEnd(true)
    }
    setFeedCount(feedCount + 10)
    console.log(feedData)
    setFeedData(feedData.concat(results))
    setIsInitialLoad(false)
  }

  useEffect(() => {
    loadMoreFeed()
  }, [])


  const _renderFooter = () => {
    return isListEnd ? <View style={{ height: 50 }} /> : <PlaceholderGrid />
  }

  const _renderFeedEmpty = () => {
    return isInitialLoad ? <PlaceholderGrid /> : <EmptyView
      file={require('/assets/images/empty/info_post.png')}
      title={isMe && !isKol ? 'Trở thành DABI KOL' : undefined}
      description={isMe && !isKol ? "Đăng bài chia sẻ trang phục và\nnhận lợi nhuận từ chương trình affiliate!" : 'Không có bài đăng nào'}
      action={isMe && !isKol ? { text: "Đăng ký", onPress: () => { Linking.openURL('https://forms.gle/hCfs2ySoRoEKEfJN9') } } : undefined}
    />
  }

  const _renderItem = ({ item, index }) => {
    return <View key={`${item.pk}`} style={{
      flex: 1 / 2,
    }}>
      <View style={{
        paddingLeft: index % 2 != 0 ? 4 : 0,
        paddingRight: index % 2 != 0 ? 0 : 4
      }}>
        <FeedbackBoxGrid data={item} />
      </View>
    </View>
  }

  return feedData.length == 0 ? <HScrollView index={0}
    showsVerticalScrollIndicator={false}
  >{_renderFeedEmpty()}</HScrollView> : <HFlatList
    index={0} showsVerticalScrollIndicator={false}
    columnWrapperStyle={{ paddingBottom: 8 }}
    data={feedData}
    numColumns={2}
    removeClippedSubviews
    initialNumToRender={6}
    ListEmptyComponent={_renderFeedEmpty}
    ListFooterComponent={_renderFooter}
    onEndReached={loadMoreFeed}
    onEndReachedThreshold={1}
    keyExtractor={(item, index) => item.pk}
    renderItem={_renderItem}
  />
}

const _UserRelatedProductTab = (pk: Number, isMe: Boolean, isKol: Boolean) => {

  const [productData, setProductData] = useState<ProductInfo[]>([])
  const [productCount, setProductCount] = useState(0)
  const [isListEnd, setIsListEnd] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)


  const getProductcount = async () => {
    if (pk == 0) {
      setIsInitialLoad(false)
      setIsListEnd(true)
      return
    }

    const { data } = await getTaggedProduct({ pk, offset: productCount, limit: 10 });
    setProductCount(productCount + 10)
    setProductData(productData.concat(data))
  }

  useEffect(() => {

    getProductcount()
    setIsInitialLoad(false)

  }, [])
  const _renderFooter = () => {
    return <View style={{ height: 50 }} />
  }

  const _renderPlaceholder = () => {
    return <Placeholder Animation={Fade}>
      <View style={{ marginBottom: 12 }}>
        {range(3).map((_, index) => {
          return (
            <ProductBoxPlaceholderRow />
          );
        })}
      </View>
    </Placeholder>
  }

  const _renderProductEmpty = () => {
    return <EmptyView
      file={require('/assets/images/empty/info_product.png')}
      title={isMe && !isKol ? 'Trở thành DABI KOL' : undefined}
      description={isMe && !isKol ? "Đăng bài chia sẻ trang phục và\nnhận lợi nhuận từ chương trình affiliate!" : 'Không có sản phẩm nào'}
      action={isMe && !isKol ? { text: "Đăng ký", onPress: () => { Linking.openURL('https://forms.gle/hCfs2ySoRoEKEfJN9') } } : undefined}
    />
  }

  const _renderItem = ({ item, index }) => {
    return <View key={`${item.pk}`} style={{
      flex: 1 / 2,
    }}>
      <View style={{
        paddingLeft: index % 2 != 0 ? 4 : 0,
        paddingRight: index % 2 != 0 ? 0 : 4
      }}>
        <ProductBox data={item} relatedProduct />
      </View>
    </View>
  }

  return productData.length == 0 ? <HScrollView index={1}
    showsVerticalScrollIndicator={false}
  >{_renderProductEmpty()}</HScrollView> : <HFlatList
    index={1}
    initialNumToRender={6}
    removeClippedSubviews
    showsVerticalScrollIndicator={false}
    columnWrapperStyle={{ paddingHorizontal: 16, paddingTop: 12, }}
    data={productData}
    numColumns={2}
    ListEmptyComponent={_renderProductEmpty}
    ListFooterComponent={_renderFooter}
    renderItem={_renderItem}
    onEndReached={getProductcount}

  />
}


const UserProfileScreen = () => {
  const [title, setTitle] = useState('');
  const route = useRoute();
  const isMe = route.name == RoutePath.profile
  const { userInfo } = useTypedSelector((state) => state.user);
  const { user_type } = userInfo
  const isKol = (user_type == UserType.INFLUENCER || user_type == UserType.SELLER)
  let pk: number
  if (isMe) {
    pk = userInfo.id
  } else {
    pk = get(route, 'params.pk');
    console.log(pk)
    if (!pk) return <GenericErrorView />;
  }


  const { isLoggedIn, } = useTypedSelector((state) => state.auth);
  const { setLoading, showDialog } = useActions();
  const navigation = useNavigation()

  const onUnfollow = get(route, 'params.onUnfollow', () => {
    /**/
  });



  useEffect(() => {
    setLoading(false);
    createUserDetailLog({ pk })
  }, [])

  useEffect(() => {
    if (isMe && !isLoggedIn) {
      showDialog({
        title: 'Bạn cần đăng nhập\nđể sử dụng chức năng này.',
        actions: [
          {
            type: ButtonType.primary,
            text: 'Đăng nhập',
            onPress: () => {
              NavigationService.instance.navigate(new AuthRouteSetting());
            },
          },
          {
            text: 'Quay Lại',
            type: ButtonType.flat,
            onPress: () => {
              navigation.goBack()
            },
          },
        ],
      })

    }
    setLoading(false);
  }, [isLoggedIn])


  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      if (isMe && !isLoggedIn) {
        showDialog({
          title: 'Bạn cần đăng nhập\nđể sử dụng chức năng này.',
          actions: [
            {
              type: ButtonType.primary,
              text: 'Đăng nhập',
              onPress: () => {
                NavigationService.instance.navigate(new AuthRouteSetting());
              },
            },
            {
              text: 'Quay Lại',
              type: ButtonType.flat,
              onPress: () => {
                navigation.goBack()
              },
            },
          ],
        })
      }
    });

    return () => {
      unsub();
    };
  }, [isLoggedIn]);


  const [index, setIndex] = useState(0);
  const [routes] = useState<Route[]>(
    [{
      key: 'list',
    },
    {
      key: 'tag',
    },]
  );


  const renderTabBar = <T extends Route>(
    props: SceneRendererProps & {
      navigationState: NavigationState<T>;
    },
  ) => {
    return <TabBar
      indicatorStyle={{
        backgroundColor: Colors.black,
      }}
      style={{ backgroundColor: Colors.white, elevation: 0, shadowOpacity: 0, }}
      labelStyle={{ color: Colors.black }}
      renderLabel={({ route, focused }) => (
        <DabiFont name={route.key + (focused ? '_filled' : '_line')} />
      )}
      {...props}
    />;
  };

  return (
    <>
      <SafeAreaView>
        {isMe ?
          <View style={{
            height: HEADER_HEIGHT,
            flexDirection: 'row', justifyContent: 'flex-end',
            alignItems: 'center',
            paddingLeft: 16,
            paddingRight: 12 - DEFAULT_IC_BTN_PADDING,
          }}>
            {/* <Text style={{ ...Typography.title, flex: 1, paddingRight: 12 }} numberOfLines={1} >@{isLoggedIn && userInfo.user_id}</Text> */}
            <HeaderNotificationButton />
          </View> : <Header
          // title={title}
          />}
      </SafeAreaView>
      <View style={{ flex: 1 }}>
        <ConnectionDetection.View>
          <CollapsibleHeaderTabView
            renderScrollHeader={() => <_Header onUnfollow={onUnfollow} pk={pk} setTitle={setTitle} myProfile={isMe} />}
            navigationState={{ index, routes }}
            removeClippedSubviews
            lazy={true}
            renderScene={SceneMap({
              list: () => _UserFeedTab(pk, isMe, isKol),
              tag: () => _UserRelatedProductTab(pk, isMe, isKol),
            })}
            onIndexChange={setIndex}
            initialLayout={{ width: Spacing.screen.width }}
            renderTabBar={renderTabBar}
            sceneContainerStyle={{ paddingTop: 8 }}
          />
          {/*  */}
        </ConnectionDetection.View>
      </View >
    </>
  );
};

const _Header = ({
  pk,
  onUnfollow,
  setTitle,
  myProfile = false,
}: {
  pk: number;
  onUnfollow: () => void;
  setTitle: (value: string) => void;
  myProfile?: boolean;
}) => {
  let { data, state, excecute } = useAsync(() => getKolProfileDetail({ influencerPk: pk }));
  if (myProfile) {
    const { userInfo } = useTypedSelector((state) => state.user);
    data = userInfo
  }
  const { isLoggedIn, } = useTypedSelector((state) => state.auth);

  useEffect(() => {
    excecute();
  }, [isLoggedIn]);

  useEffect(() => {
    if (isNil(data)) return;
    setTitle('@' + data.user_id);
  }, [data?.user_id]);

  if (state !== ConnectionState.hasData || (myProfile && !isLoggedIn)) return <UserProfilePlaceholder />

  return (
    <View
      style={{ paddingBottom: 12 }}>
      <UserProfile
        data={data!}
        onUnfollow={onUnfollow}
        myProfile={myProfile}
      />
    </View>
  );
};


export default UserProfileScreen;
