import React, { useMemo } from 'react';
import { View } from 'react-native';

import ImageModal from 'react-native-image-modal';
import { Colors, applyOpacity } from '_styles';
import { screen } from 'styles/spacing';
import { PlaceholderMedia } from 'rn-placeholder/lib/PlaceholderMedia';
import BackButton from 'components/header/BackButton';
import ImageModalSlider from './ImageModalSlider';

/** @deprecated   **/
export default ({ data }: { data: any }) => {
  const children = useMemo(() => {
    const { product_image_type, product_image_set, product_thumbnail_image } = data;
    const image_set = [...product_image_set];
    const renderHeader = (onClose: () => void) => {
      return (
        <View style={{ marginTop: 60, alignItems: 'flex-start' }}>
          <BackButton color={Colors.white} handleOnPress={onClose} />
        </View>
      );
    };
    switch (product_image_type) {
      case 'SP':
        const sourceURL = product_thumbnail_image
          .replace('_tn', '')
          .replace('_compact', '')
          .replace('_large', '');
        return (
          <ImageModal
            resizeMode="contain"
            imageBackgroundColor={Colors.white}
            overlayBackgroundColor={applyOpacity(Colors.surface.darkGray, 0.8)}
            renderHeader={renderHeader}
            style={{
              width: screen.width,
              height: screen.width,
            }}
            source={{
              uri: sourceURL,
            }}
          />
        );
      case 'MP':
      default:
        return <ImageModalSlider imageSet={image_set} />;
    }

  }, [data]);

  return <View>{children}</View>;
};

export const ProductImagePlaceholder = () => {
  return (
    <PlaceholderMedia
      style={{
        width: screen.width,
        height: screen.width,
        backgroundColor: 'white',
      }}
    />
  );
};
