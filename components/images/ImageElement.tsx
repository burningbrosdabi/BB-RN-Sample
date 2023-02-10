import { isNil } from 'lodash';
import React from 'react';
import {Image, ImageRequireSource, View, ViewStyle} from 'react-native';
import FastImage, {ImageStyle, ResizeMode} from 'react-native-fast-image';
import { Colors, Outlines, Spacing } from 'styles';

interface Props {
  sourceURL?: any | null;
  image?: string | null | ImageRequireSource;
  height: number;
  width: number;
  rounded?: boolean;
  children?: JSX.Element;
  containerStyle?: ViewStyle | ViewStyle[];
  imageStyle?: ImageStyle;
  transparent?: Boolean;
  resizeMode?:ResizeMode;
}

/** @deprecated   **/
export const ImageElement = ({
  sourceURL,
  height,
  width,
  rounded,
  children,
  containerStyle,
  imageStyle,
}: Props) => {
  let logoWidth = 22;
  let logoHeight = 15;
  if (width > Spacing.screen.width / 2) {
    logoWidth = 88;
    logoHeight = 60;
  }
  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius: rounded ? Outlines.borderRadius.base : 0,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors.surface.lightGray,
        },
        containerStyle,
      ]}>
      {sourceURL ? (
        <FastImage
          style={[
            { width, height, borderRadius: rounded ? Outlines.borderRadius.base : 0 },
            imageStyle,
          ]}
          source={typeof sourceURL == 'string' ? { uri: sourceURL } : sourceURL}
        />
      ) : (
        <></>
      )}
      {children ?? <></>}
    </View>
  );
};

export const ImageElementFlex = ({
  image,
  rounded,
  containerStyle,
  imageStyle,
  transparent,
  resizeMode = 'cover'
}: Omit<Props, 'height' | 'width'>) => {

  if (isNil(image)) {
    return <></>
  }
  return (
    <View
      style={[
        {
          flex: 1,
          borderRadius: rounded ? Outlines.borderRadius.base : 0,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: transparent ? 'transparent' : Colors.surface.lightGray,
        },
        containerStyle,
      ]}>
      {typeof image == 'string' ? (
        <FastImage
          resizeMode={resizeMode}
          style={{
            backgroundColor: transparent ? 'transparent' : Colors.surface.lightGray,
            width: '100%',
            height: '100%',
            borderRadius: rounded ? Outlines.borderRadius.base : 0,
          }}
          source={{ uri: image }}
        />
      ) : (
        <FastImage
          resizeMode={resizeMode}
          style={{
            backgroundColor: transparent ? 'transparent' : Colors.surface.lightGray,
            width: '100%',
            height: '100%',
            borderRadius: rounded ? Outlines.borderRadius.base : 0,
          }}
          source={image}
        />
      )}
    </View>
  );
};

export default ImageElement;


export const ImageElementNative = ({
  image,
  rounded,
  containerStyle,
  imageStyle,
  children
}: Omit<Props, 'height' | 'width'>) => {

  return (
    <View
      style={[
        {
          flex: 1,
          borderRadius: rounded ? Outlines.borderRadius.base : 0,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors.surface.lightGray,
        },
        containerStyle,
      ]}>
      {image ? (
        <Image
          style={{
            backgroundColor: Colors.surface.lightGray,
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            borderRadius: rounded ? Outlines.borderRadius.base : 0,
          }}
          source={typeof image == 'string' ? { uri: image, cache: 'force-cache' } : image}
        />
      ) : (
        <></>
      )}
      {children}
    </View>
  );
};