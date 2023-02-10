import { ImageElementNative } from 'components/images/ImageElement';
import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { MagazineDetailRouteSetting } from 'routes';
import { Banner } from 'services/api/home';
import { NavigationService } from 'services/navigation';
import { Colors, Spacing, Typography } from 'styles';
import { fontPlaceHolder } from 'styles/typography';


type Banners = 'height' | 'width';
export const banners: Record<Banners, number> = {
  width: Spacing.screen.width - 32,
  height: ((Spacing.screen.width - 32) / 16) * 9,
};


interface Props {
  banner: Banner;
  containerStyle?: StyleProp<ViewStyle>;
}

const BannerBox = (props: Props) => {
  const { banner, containerStyle } = props;
  const { pk: id, list_thumb_picture: sourceURL, title } = banner;
  const { bannerThumbnailImageContainer, bannerTitle } = styles;

  const onSelectMagazine = useMemo(
    () => (): void => {
      const route = new MagazineDetailRouteSetting({ id });
      NavigationService.instance.navigate(route);
    },
    [],
  );

  return (
    <Ripple onPress={onSelectMagazine}>
      <View style={[bannerThumbnailImageContainer, containerStyle]}>
        <View style={{ width: banners.width, height: banners.height }}>
          <ImageElementNative image={sourceURL} rounded />
        </View>
        <View style={{ height: 10 }} />
        {title && (
          <Text numberOfLines={1} style={bannerTitle}>
            {title}
          </Text>
        )}
      </View>
    </Ripple>
  );
};

export const BannerBoxPlaceholder = () => {
  return (
    <View style={styles.bannerThumbnailImageContainer}>
      <PlaceholderMedia
        style={{
          width: banners.width,
          height: banners.height,
          backgroundColor: Colors.surface.white,
        }}
      />
      <View style={{ height: 10 }} />
      <PlaceholderLine
        noMargin
        style={{ ...fontPlaceHolder.subTitle, width: '90%', backgroundColor: Colors.surface.white }}
      />
    </View>
  );
};

export default React.memo(BannerBox);
const styles = StyleSheet.create({
  bannerThumbnailImageContainer: {
    // width: Spacing.screen.width,
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  bannerTitle: {
    ...Typography.name_button,
  },
});
