import { useNavigation, useRoute } from '@react-navigation/native';
import Button from 'components/button/Button';
import StoreFavoriteTextButton from 'components/button/store/StoreFavoriteTextButton';
import { Header } from 'components/header/Header';
import { ImageSlider } from 'components/images/ImageSlider';
import ProfileImage from 'components/images/ProfileImage';
import { List } from 'components/list/product/ProductList.v2';
import { FlashSaleTimmer } from 'components/timmer/FlashSaleTimmer';
import { get, isEmpty } from 'lodash';
import { FeedbackInfo, ProductInfo, StoreMinifiedInfo } from 'model';
import React, { useEffect, useMemo } from 'react';
import { Linking, SafeAreaView, ScrollView, Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { Colors, Outlines, Spacing, Typography } from 'styles';
import { dateTimeDiff } from '_helper';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { Fade, Placeholder, PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { screen } from 'styles/spacing';
import { GenericErrorView } from 'components/empty/EmptyView';
import { getFeedDetail } from '_api';

export const SaleDetailScreen = () => {
  const { params } = useRoute();
  const id = get(params, 'id');

  useEffect(() => {
    excecute();
  }, []);

  const { state, excecute, data } = useAsync(() => getFeedDetail(id));

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title={'Thông tin khuyến mãi'} />
      {state === ConnectionState.waiting && <Placeholder />}
      {state === ConnectionState.hasData && <_Screen data={data!} />}
      {state === ConnectionState.hasError && <GenericErrorView />}
    </SafeAreaView>
  );
};

export const _Screen = ({ data }: { data: FeedbackInfo }) => {
  const { pk, store } = data;

  const navigation = useNavigation();

  const { fetch } = List.useHandler({ storePk: store?.pk, isDiscount: true });
  const _fetch = (): Promise<[FeedbackInfo, ProductInfo[]]> => {
    return Promise.all([getFeedDetail(pk), fetch(0)]);
  };
  const { state, excecute, data: initialData } = useAsync(() => fetch(0));

  useEffect(() => {
    excecute();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {state === ConnectionState.waiting && <_Placeholder />}
      {state === ConnectionState.hasData && (
        <List.Product
          renderAheadMultiply={3}
          HeaderComponent={
            <>
              <_Header data={data} />
              <Text style={[Typography.name_button, { paddingHorizontal: 16 }]}>
                Các sản phẩm đang khuyến mãi
              </Text>
            </>
          }
          fetch={fetch}
        />
      )}
      {(state === ConnectionState.hasEmptyData || state === ConnectionState.hasError) && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <_Header data={data} />
        </ScrollView>
      )}
    </View>
  );
};

const _Header = ({ data }: { data: FeedbackInfo }) => {
  const {
    related_product,
    post_thumb_image,
    post_description,
    pk = 0,
    is_collected,
    like_count,
    post_url,
    promotion_end_at,
    influencerpostimage_set,
    store,
    is_promotion_ended,
  } = data || {};

  const time = dateTimeDiff(promotion_end_at!);

  const thumbs = useMemo(() => {
    if (!isEmpty(influencerpostimage_set)) {
      return influencerpostimage_set.map(value => value.source);
    }
    return [post_thumb_image];
  }, [influencerpostimage_set, post_thumb_image]);

  return (
    <View>
      <View style={{ width: Spacing.screen.width, aspectRatio: 1 }}>
        <ImageSlider onPress={() => { }} images={thumbs} />
      </View>
      <View style={{ height: 12 }} />
      <View style={{ paddingHorizontal: 16, alignItems: 'flex-start' }}>
        <StoreFollowButton store={store} />
        {is_promotion_ended ? (
          <View
            style={{
              backgroundColor: Colors.black,
              paddingVertical: 4,
              paddingHorizontal: 8,
              borderRadius: 4,
            }}>
            <Text
              style={{
                ...Typography.name_button,
                color: Colors.white,
              }}>
              Kết thúc
            </Text>
          </View>
        ) : (
          <FlashSaleTimmer
            end={promotion_end_at}
            style={{ paddingHorizontal: 0 }}
            boxStyle={{ backgroundColor: Colors.primary }}
            textStyle={{ color: Colors.white }}
          />
        )}
        <View style={{ height: 16 }} />
        <Text style={Typography.body}>{post_description}</Text>
      </View>
      <View style={{ height: 24 }} />
      <View style={{ padding: 24, backgroundColor: Colors.background, marginBottom: 24 }}>
        <Text style={Typography.name_button}>
          Thông tin khuyến mãi đôi lúc có thể sai lệch so với thông tin thực tế. Bạn vui lòng kiểm
          tra trên trang chính thức của cửa hàng để có thông tin chính xác nhất nhé!
        </Text>
        <View style={{ height: 12 }} />
        <Button
          color={'black'}
          text={'Xem trang chính thức'}
          onPress={() => {
            Linking.openURL(post_url);
          }}
        />
      </View>
    </View>
  );
};

const _Placeholder = () => {
  return (
    <Placeholder Animation={Fade} style={{ flex: 1 }}>
      <PlaceholderMedia style={{ width: screen.width, height: screen.width }} />
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <View
          style={{
            borderRadius: 8,
            borderColor: Colors.line,
            borderWidth: 1,
            padding: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <PlaceholderMedia style={{ width: 48, height: 48, borderRadius: 24 }} />
          <View style={{ width: 12 }} />
          <PlaceholderLine style={{ width: 80, height: 16 }} noMargin />
          <View style={{ flex: 1 }} />
          <PlaceholderLine style={{ width: 80, height: 28 }} noMargin />
        </View>
      </View>
      <View style={{ height: 12 }} />
      <View style={{ flexDirection: 'row', paddingHorizontal: 16 }}>
        <PlaceholderLine style={{ width: 33, height: 28 }} noMargin />
        <Text
          style={[Typography.name_button, { paddingHorizontal: 4, color: Colors.surface.lightGray }]}>
          :
        </Text>
        <PlaceholderLine style={{ width: 33, height: 28 }} noMargin />
        <Text
          style={[Typography.name_button, { paddingHorizontal: 4, color: Colors.surface.lightGray }]}>
          :
        </Text>
        <PlaceholderLine style={{ width: 33, height: 28 }} noMargin />
      </View>
      <View style={{ height: 24 }} />
      <View style={{ paddingHorizontal: 16 }}>
        {[60, 80, 100, 90, 100, 80, 70].map(e => {
          return <PlaceholderLine style={{ width: `${e}%`, height: 18 }} />;
        })}
      </View>
    </Placeholder>
  );
};

const StoreFollowButton = ({ store }: { store: StoreMinifiedInfo }) => {
  const { insta_id } = store;
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
      }}>
      <Ripple
        style={{
          flex: 1,
          padding: 12,
          justifyContent: 'space-between',
          ...Outlines.borderPreset.base,
        }}
        onPress={() => navigation.navigate('StoreDetail', { store })}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ProfileImage source={store.profile_image} />
          <Text numberOfLines={1} style={{ ...Typography.name_button, paddingLeft: 8, width: '50%' }}>
            {insta_id}
          </Text>
        </View>
      </Ripple>
      <View style={{ position: 'absolute', right: 12 }}>
        <StoreFavoriteTextButton data={store} />
      </View>
    </View>
  );
};
