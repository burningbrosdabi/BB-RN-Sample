import { GenericErrorView } from 'components/empty/EmptyView';
import { ImageElementNative } from 'components/images/ImageElement';
import ProfileImage from 'components/images/ProfileImage';
import { usePagingFetch } from 'components/list/PagingFlatList';
import { FlashSaleTimmer } from 'components/timmer/FlashSaleTimmer';
import { isEmpty, range } from 'lodash';
import { FeedbackInfo } from 'model';
import React, { useEffect, useMemo } from 'react';
import { FlatList, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ripple from 'react-native-material-ripple';
import { Fade } from 'rn-placeholder/lib/animations/Fade';
import { Placeholder } from 'rn-placeholder/lib/Placeholder';
import { PlaceholderMedia } from 'rn-placeholder/lib/PlaceholderMedia';
import { SaleDetailRouteSetting, SalesRouteSetting } from 'routes/sale/sale.route';
import { PaginationResponse } from 'services/http/type';
import { NavigationService } from 'services/navigation';
import { applyOpacity, Colors, Spacing, Typography } from 'styles';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { getFeedbackListV2 } from '_api';
import Button, { ButtonType } from 'components/button/Button';
import { useNavigator } from 'services/navigation/navigation.service';

export const SaleListTab = ({ is_ended = false }: { is_ended?: boolean }) => {
  const { state, excecute, data, refresh } = useAsync(
    () => getFeedbackListV2(undefined, { is_promotion: true, is_ended }),
    {
      emptyDataLogical: data => isEmpty(data.results),
    },
  );

  useEffect(() => {
    excecute();
  }, []);

  switch (state) {
    case ConnectionState.waiting:
      return (
        <View testID={'waiting-view'} style={{ flex: 1 }}>
          <_ListPlaceholder showHeader />
        </View>
      );
    case ConnectionState.hasEmptyData:
      return <></>;
    case ConnectionState.hasData:
      return (
        <View testID={'has-data-view'} style={{ flex: 1 }}>
          <_List is_ended={is_ended} initialResponse={data!} />
        </View>
      );
    case ConnectionState.hasError:
      return (
        <View
          style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
          testID={'error-view'}>
          <GenericErrorView />
        </View>
      );
    default:
      return <></>;
  }
};

const _List = ({
  initialResponse,
  is_ended,
}: {
  is_ended?: boolean;
  initialResponse: PaginationResponse<FeedbackInfo>;
}) => {
  const { results, next, count = 0 } = initialResponse;

  const { data, endReached, onScroll } = usePagingFetch({
    initialData: results,
    next: next ?? undefined,
    fetch: getFeedbackListV2,
  });

  const itemBuilder = ({ item }: { item: FeedbackInfo }) => {
    return <BannerBox data={item!} />;
  };

  const keyExtractor = (item: FeedbackInfo, index: number) => `${item.pk}`;

  return (
    <FlatList
      renderItem={itemBuilder}
      keyExtractor={keyExtractor}
      data={data}
      showsVerticalScrollIndicator={false}
      onScroll={onScroll}
      ListFooterComponent={
        !endReached ? (
          <_ListPlaceholder showHeader={false} count={5} />
        ) : !is_ended ? (
          <View style={{ paddingBottom: 12, paddingTop: 4, paddingHorizontal: 16 }}>
            <SaleListFooterButton />
          </View>
        ) : (
          <></>
        )
      }
    />
  );
};

export default SaleListTab;

const SaleListFooterButton = () => {
  const { state, data, excecute } = useAsync(
    () => getFeedbackListV2(undefined, { is_promotion: true, is_ended: true }),
    {
      emptyDataLogical: ({ results }) => isEmpty(results),
    },
  );

  const navigator = useNavigator();

  useEffect(() => {
    excecute();
  }, []);

  if (state === ConnectionState.hasData) {
    return (
      <Button
        type={ButtonType.outlined}
        text={'Xem tất cả khuyến mãi đã kết thúc'}
        onPress={() => {
          navigator.navigate(new SalesRouteSetting({ is_ended: true }));
        }}
      />
    );
  }
  return <></>;
};

const BannerBox = ({ data }: { data: FeedbackInfo }) => {
  const { pk, post_thumb_image, promotion_end_at, store, influencer, is_promotion_ended } = data;
  const onSelectMagazine = useMemo(
    () => (): void => {
      const route = new SaleDetailRouteSetting({ id: pk });
      NavigationService.instance.navigate(route);
    },
    [],
  );

  return (
    <View
      style={{
        width: '100%',
        marginBottom: 12,
      }}>
      <Ripple rippleContainerBorderRadius={4} onPress={onSelectMagazine}>
        <View style={{ width: '100%', aspectRatio: 1 }}>
          <ImageElementNative image={post_thumb_image} />
          <LinearGradient
            colors={[applyOpacity(Colors.black, 0.5), 'transparent']}
            style={{
              position: 'absolute',
              flexDirection: 'row',
              paddingVertical: 12,
              paddingLeft: 16,
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
              }}>
              <ProfileImage source={store?.profile_image ?? influencer.profile_image} />
              <View style={{ width: 12 }} />
              <Text
                style={{ ...Typography.name_button, color: Colors.white, flex: 1 }}
                numberOfLines={1}>
                {store?.insta_id ?? influencer.name}
              </Text>
            </View>
            <View style={{ paddingHorizontal: 16 }}>
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
                <FlashSaleTimmer style={{ paddingHorizontal: 0 }} end={promotion_end_at} />
              )}
            </View>
          </LinearGradient>
        </View>
      </Ripple>
    </View>
  );
};

const _ListPlaceholder = ({ count = 16, showHeader }: { count?: number; showHeader: boolean }) => {
  return (
    <Placeholder Animation={Fade}>
      {range(count).map((_, index) => (
        <BannerPlaceholder key={`${index}`} />
      ))}
    </Placeholder>
  );
};

const BannerPlaceholder = (props: { key: string }) => {
  return (
    <View
      style={{
        width: Spacing.screen.width,
        aspectRatio: 1,
        marginBottom: 12,
      }}
      key={props.key}>
      <PlaceholderMedia
        style={{
          flex: 1,
          width: Spacing.screen.width,
          aspectRatio: 1,
          backgroundColor: Colors.surface.white,
          borderRadius: 0,
        }}
      />
    </View>
  );
};
