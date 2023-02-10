import { toast } from 'components/alert/toast';
import IconButton from 'components/button/IconButton';
import { Link } from 'components/button/Link';
import CommentInput from 'components/comment/CommentInput';
import { CommentPreview } from 'components/comment/CommentPreview';
import { CommentContext } from 'components/comment/context';
import ProfileImage from 'components/images/ProfileImage';
import { FeedbackBoxGrid } from 'components/list/post/FeedbackBoxGrid';
import FeedProduct from 'components/list/post/FeedProduct';
import { ProductSmallBox } from 'components/list/product/ProductBox';
import { isEmpty, isNil } from 'lodash';
import { CommentItemModel, CommentType, Magazine, ProductInfo } from 'model';
import { ProductGroupItem } from 'model/magazine/product.group.item';
import { UserType } from 'model/user/user';
import React, { Ref, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { FlatList, Image, Linking, Text, View, ViewToken } from 'react-native';
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import Ripple from 'react-native-material-ripple';
import { CommentListRouteSetting, RoutePath, UserProfileRouteSetting } from 'routes';
import { FeedDetailRouteSetting } from 'routes/feed/feed.route';
import { RelatedProductRouteSetting } from 'routes/product/relatedProduct.route';
import { Subject } from 'rxjs';
import { _Context } from 'scenes/home/magazine/context';
import { FollowButton } from 'scenes/user/follow/FollowButton';
import { NavigationService } from 'services/navigation';
import { useNavigator } from 'services/navigation/navigation.service';
import { applyOpacity, Colors, Spacing, Typography } from 'styles';
import { postMessageToChannel } from 'utils/helper';
import { createAffiliateLog, getMagazineRelatedProducts } from '_api';
import { DabiFont } from '_icons';

const indicatorConfig = {
  color: '#A6A7A8',
  margin: 3,
  opacity: 1,
  size: 6,
  width: 6,
};

const decreasingDotConfig = {
  config: { color: '#A6A7A8', width: 6, margin: 3, opacity: 1, size: 6 },
  quantity: 1,
};


const FeedSlide = ({ data }: { data?: ProductGroupItem }) => {
  if (!data || !data.related_feed) return <></>
  const navigator = useNavigator();

  const { related_feed, content } = data
  const { post_url,
    media_type,
    post_thumb_image,
    related_products,
    post_description,
    influencer,
    pk,
  } = related_feed
  const navigateFeed = () => {
    navigator.navigate(new FeedDetailRouteSetting({ pk: pk }));
  };
  return <View style={{
    marginTop: 12,
    marginHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    borderColor: 'red',
    borderRadius: 12
    // backgroundColor: Colors.red
  }}>
    <View style={{
      borderRadius: 12, backgroundColor: Colors.white
    }}>
      <View style={{
        flexDirection: 'row',
        paddingHorizontal: 12, paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            navigator.navigate(new UserProfileRouteSetting({ pk: influencer?.pk }))
          }
          }>
          <ProfileImage
            pk={influencer.pk}
            source={!isEmpty(influencer?.profile_image) ? influencer?.profile_image : undefined}
          />
          <View style={{ width: 12 }} />
          <View style={{ width: Spacing.screen.width - 248 }}>
            {/* Hard coded */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Text numberOfLines={1} style={Typography.name_button}>
                {influencer?.user_id}
              </Text>
              {!isNil(influencer?.user_type) && influencer?.user_type == UserType.INFLUENCER && (
                <View style={{ marginLeft: 4, height: 20, bottom: 1, justifyContent: 'center' }}>
                  <DabiFont name={'crown'} size={12} color={Colors.red} />
                </View>
              )}
              {!isNil(influencer?.user_type) && influencer?.user_type == UserType.SELLER && (
                <View style={{ marginLeft: 4, height: 20, bottom: 1, justifyContent: 'center' }}>
                  <DabiFont name={'small_store'} size={12} color={Colors.red} />
                </View>
              )}
            </View>
            {(influencer?.height || influencer?.weight) &&
              <Text style={Typography.description}>{!isNil(influencer?.height) && (influencer?.height + 'cm')}
                {!isNil(influencer?.height && influencer?.weight) && ", "}
                {!isNil(influencer?.weight) && (influencer?.weight + 'kg')}</Text>}
          </View>
        </TouchableOpacity>
        <FollowButton name={influencer.name} pk={influencer.pk} />
      </View>
      <Ripple rippleContainerBorderRadius={24} onPress={navigateFeed}>

        <Image style={{ width: '100%', aspectRatio: 1 }} source={{ uri: post_thumb_image }} />
        {
          media_type == 2 &&
          <View style={{ position: 'absolute', right: 12, top: 12, zIndex: 1 }}>
            <DabiFont size={20} name={'multi'} color={'white'} />
          </View>
        }
        {
          media_type == 1 &&
          <View style={{ position: 'absolute', right: 12, top: 12, zIndex: 1 }}>
            <DabiFont size={20} name={'video'} color={'white'} />
          </View>
        }

        {related_products && related_products?.length > 0 ? (
          <View style={{}}>
            <View style={{ height: 12 }} />
            {related_products.map((item, index) => {
              const { affiliate_link, out_link, pk } = item
              const onPressAffiliateLink = () => {
                if (isNil(affiliate_link) && isNil(out_link)) {
                  toast('Đường dẫn đến sản phẩm không tồn tại!\nXin lỗi bạn vì sự cố này, chúng tôi sẽ khắc phục lỗi này một cách nhanh nhất.')
                  postMessageToChannel({
                    message: `Error with affiliate link. product_pk:${pk}`,
                    channel: 'product_sentry_log'
                  })
                  return
                }
                Linking.openURL(affiliate_link ?? out_link).then(
                  async () =>
                    await createAffiliateLog({ pk: pk })
                ).catch(() => {
                  toast('Đường dẫn đến sản phẩm không tồn tại!\nXin lỗi bạn vì sự cố này, chúng tôi sẽ khắc phục lỗi này một cách nhanh nhất.')
                  postMessageToChannel({
                    message: `Error with affiliate link. product_pk:${pk}`,
                    channel: 'product_sentry_log'
                  })
                })
                // }
              }
              return <View style={{ zIndex: 10 - index }}><FeedProduct
                key={`${index}`}
                data={item}
                onPress={onPressAffiliateLink}
              /></View>
            })}
          </View>
        ) : (
          <></>
        )}
        <View style={{ paddingHorizontal: 12, paddingTop: 12, }}>
          <Text style={Typography.body} numberOfLines={1}>{post_description}</Text>
          <View style={{ height: 4 }} />
          <Text style={{ ...Typography.name_button, color: Colors.component, textAlign: 'right' }}>Xem tất cả</Text>
        </View>
        <View style={{ height: 12 }} />
      </Ripple>
    </View>
  </View>
}

export const MagazineSlide = ({ data }: { data: Magazine }) => {
  const [index, setIndex] = useState(0);
  const listRef = useRef<KeyboardAwareScrollView>();
  const productgroupdetails_set = useMemo(() => {
    return [...data.productgroupdetails_set, {}];
  }, [data.productgroupdetails_set]);

  const commentStream = useRef(new Subject<CommentItemModel>()).current;
  console.log(data)

  const _renderHeader = ({
    item: _item,
    index,
  }: {
    item: ProductGroupItem | {};
    index: number;
  }) => {
    if (isEmpty(_item)) {
      return <LastSlide listRef={listRef} pk={data.pk} data={data.product_list} />;
    }


    const item = _item as ProductGroupItem;
    const { related_feed } = item

    return (
      <ScrollView
        contentContainerStyle={{
          width: Spacing.screen.width,
          paddingBottom: 24
        }}>
        {related_feed ? <FeedSlide data={item} /> : <><View
          style={{
            width: Spacing.screen.width,
            aspectRatio: 1,
            backgroundColor: Colors.surface.lightGray,
          }}>
          <Image
            source={{
              uri: item?.cover_picture,
              cache: 'force-cache',
            }}
            style={{ flex: 1, aspectRatio: 1 }}
          />
        </View></>}
        <View style={{ height: 24 }} />
        <View style={{ paddingHorizontal: 28, paddingBottom: 38 }}>
          <Text
            style={{
              ...Typography.description,
              lineHeight: 18,
            }}>
            {item?.content ?? ''}
          </Text>
        </View>

      </ScrollView>
    );
  };

  const _keyExtractor = useCallback((item, index) => {
    if (index === productgroupdetails_set.length - 1) {
      return `${index}`;
    }
    return item?.source_thumb + index.toString();
  }, []);

  const onViewChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const { index: activeIndex } = viewableItems[0];
      setIndex(activeIndex ?? 0);
    }
  };

  const list = useMemo(() => {
    return (
      <FlatList<ProductGroupItem | {}>
        decelerationRate={'fast'}
        overScrollMode={'never'}
        pagingEnabled
        snapToAlignment={'center'}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
        snapToInterval={Spacing.screen.width}
        keyExtractor={_keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
        onViewableItemsChanged={onViewChanged}
        data={productgroupdetails_set}
        renderItem={_renderHeader}
      />
    );
  }, [productgroupdetails_set]);

  return (
    <CommentContext.Provider value={{ commentStream }}>
      <View style={{ flex: 1, }}>
        {list}
        <LinearGradient
          start={{ x: 0.0, y: 0 }} end={{ x: 0, y: 1.0 }}
          locations={[0, 0.5, 0.6]}
          colors={[applyOpacity(Colors.white, 0.01), applyOpacity(Colors.white, 0.8)]}
          style={{ height: 48, width: '100%', position: 'absolute', bottom: 38 }} />

        <View style={{ height: 38, paddingTop: 12, paddingBottom: 20, alignItems: 'center' }}>
          <AnimatedDotsCarousel
            length={productgroupdetails_set.length}
            currentIndex={index}
            maxIndicators={productgroupdetails_set.length}
            interpolateOpacityAndColor={false}
            activeIndicatorConfig={{ ...indicatorConfig, width: 12 }}
            inactiveIndicatorConfig={indicatorConfig}
            decreasingDots={[decreasingDotConfig, decreasingDotConfig]}
          />
        </View>
      </View>
      {index >= productgroupdetails_set.length - 1 ? (
        // <CommentInput
        //   // onChangeText={onChangeText}
        //   onFocus={() => {
        //     listRef?.current?.scrollToEnd();
        //   }}
        //   pk={data.pk}
        //   type={CommentType.magazine}
        // />
        <></>
      ) : (
        <_Bottom pk={data.pk} />
      )}
    </CommentContext.Provider>
  );
};

const LastSlide = ({
  listRef,
  pk,
  data,
}: {
  listRef?: Ref<KeyboardAwareScrollView>;
  pk: number;
  data: ProductInfo[];
}) => {
  const { commentCount } = useContext(_Context);
  return (
    <KeyboardAwareScrollView ref={listRef} contentContainerStyle={{ width: Spacing.screen.width }}>
      {data.length > 0 ? <>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            paddingVertical: 12,
            justifyContent: 'space-between',
          }}>
          <Text style={Typography.title}>Có thể bạn cũng thích</Text>
          <Link
            style={{ textDecorationLine: 'none' }}
            horizontalPadding={0}
            text={'Xem tất cả'}
            onPress={() => onShowMore({ pk })}
          />
        </View>
        <View style={{ width: '100%', height: 168 }}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={{ paddingHorizontal: 16 }}>
            {data.map(product => {
              return (
                <View key={`${product.pk}`} style={{ paddingRight: 12 }}>
                  <ProductSmallBox data={product} />
                </View>
              );
            })}
          </ScrollView>
        </View></> : <></>}
      <View style={{ height: 12 }} />
      <CommentPreview countIncludedSub={commentCount} type={CommentType.magazine} pk={pk} />
      {/*hardcode for padding keyboard*/}
      <View>
        <View style={{ height: 72 }} />
        <View style={{ height: 10 * 5 }} />
      </View>
      {/******************************/}
    </KeyboardAwareScrollView>
  );
};

const _Bottom = ({ pk }: { pk: number }) => {
  const { commentCount } = useContext(_Context);
  const navigator = useNavigator();

  const showAllComments = () => {
    navigator.navigate(
      new CommentListRouteSetting({
        pk,
        type: CommentType.magazine,
      }),
    );
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 12,
        paddingRight: 16,
        paddingBottom: 8,
        width: '100%',
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <IconButton icon={'comment'} onPress={showAllComments} />
        <Text style={Typography.description}>{commentCount}</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Link
          style={{ textDecorationLine: 'none' }}
          onPress={() => onShowMore({ pk })}
          text={'Có thể bạn cũng thích'}
          horizontalPadding={0}
        />
        <View style={{ width: 4 }} />
        <DabiFont name={'small_arrow_right'} size={12} />
      </View>
    </View>
  );
};

const onShowMore = ({ pk }: { pk: number }) => {
  NavigationService.instance.navigate(
    new RelatedProductRouteSetting({
      fetchFunc: params =>
        getMagazineRelatedProducts({
          offset: params.offset ?? 0,
          magazine_id: pk,
        }),
    }),
  );
};
