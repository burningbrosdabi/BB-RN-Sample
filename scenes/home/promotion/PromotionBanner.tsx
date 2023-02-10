import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { getDiscountBanner } from '_api';
import { NavigationService } from 'services/navigation';
import { PromotionRouteSetting } from 'routes/promotion/promotion.route';
import { Text, TouchableOpacity, View } from 'react-native';
import { Spacing, Typography } from 'styles';
import { ImageElementNative } from 'components/images/ImageElement';
import { Fade, Placeholder, PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { Banner } from 'services/api/home';
import { Completer } from 'services/remote.config';

export type BannerRef = {
  refresh: () => void;
  dataPromise: Promise<Banner>;
};

const bannerHeight = (Spacing.screen.width / 16) * 9;

type Props = {
  showTitle?: boolean;
  disabled: boolean;
};
export const BannerHeader = forwardRef(({ disabled = false, showTitle = false }: Props, ref) => {
  const { excecute, data, state, error } = useAsync(getDiscountBanner);
  const completer = useRef(new Completer<Banner>()).current;

  useEffect(() => {
    excecute();
  }, []);

  useEffect(() => {
    if (state === ConnectionState.hasData) {
      completer.complete(data!);
    } else if (state === ConnectionState.hasError) {
      completer.reject(error!);
    }
  }, [state]);

  useImperativeHandle<unknown, BannerRef>(ref, () => ({
    refresh() {
      excecute();
    },
    dataPromise: completer.promise,
  }));

  const _onPress = () => {
    NavigationService.instance.navigate(new PromotionRouteSetting());
  };

  if (state === ConnectionState.none || state === ConnectionState.waiting) {
    return (
      <Placeholder Animation={Fade}>
        <PlaceholderMedia style={{ width: '100%', height: bannerHeight }} />

        {showTitle && (
          <View
            style={{
              paddingTop: 12,
              paddingHorizontal: 16,
            }}>
            <PlaceholderLine noMargin style={{ height: 18, width: '100%' }} />
            <View style={{ height: 4 }} />
            <PlaceholderLine noMargin style={{ height: 18, width: '70%' }} />
          </View>
        )}
      </Placeholder>
    );
  } else if (state === ConnectionState.hasData) {
    return (
      <View>
        <TouchableOpacity disabled={disabled} onPress={_onPress} style={{ height: bannerHeight }}>
          <ImageElementNative image={data?.list_thumb_picture} />
        </TouchableOpacity>
        {showTitle && (
          <Text
            numberOfLines={2}
            style={{
              ...Typography.title,
              width: Spacing.screen.width - 32,
              paddingTop: 12,
              marginLeft: 16,
            }}>
            {data?.title}
          </Text>
        )}
      </View>
    );
  }
  return <></>;
});
