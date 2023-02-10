import DabiFont from 'assets/icons/dabi.fonts';
import { ButtonType } from 'components/button/Button';
import { ImageElementNative } from 'components/images/ImageElement';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Outlines, Spacing, Typography } from 'styles';
import theme from 'styles/legacy/theme.style';
import { useActions } from 'utils/hooks/useActions';
import { contactWithShop } from '_helper';

/** @deprecated   **/
export const ImageWithLinking = (props: { data: any }) => {
  const { data } = props;
  const { facebook_id, facebook_numeric_id, cover_image } = data;

  const facebook_link = `https://www.facebook.com/${facebook_numeric_id}`;

  const { showDialog } = useActions();

  const onPress = async () => {
    try {
      const contact = await contactWithShop(facebook_numeric_id);
      contact();
    } catch {
      showDialog({
        title: 'Không thể mở liên kết!',
        actions: [
          {
            type: ButtonType.primary,
            text: 'OK',
            onPress: () => {
              /** */
            },
          },
        ],
      });
    }
  };

  return (
    <View style={{ width: Spacing.screen.width, aspectRatio: 2 }}>
      <View
        style={{
          backgroundColor: 'rgba(0,0,0,0.3)',
          flex: 1,
          justifyContent: 'center',
        }}>
        <ImageElementNative image={cover_image}>
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.3)',
              position: 'absolute',
              top: 0,
              width: Spacing.screen.width,
              height: Spacing.screen.width / 2,
            }}
          />
        </ImageElementNative>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            zIndex: 1,
            position: 'absolute',
            alignSelf: 'center',
          }}>
          <Text style={Typography.name} numberOfLines={1}>
            {data.insta_id}
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 12,
              borderWidth: Outlines.borderWidth.base,
              borderColor: Colors.white,
              borderRadius: Outlines.borderRadius.base,
              paddingHorizontal: 12,
              flexDirection: 'row',
              paddingVertical: 4,
              alignItems: 'center',
            }}
            onPress={onPress}>
            <Text
              style={{
                marginLeft: 4,
                ...Typography.body,
                color: Colors.white,
              }}>
              Liên hệ cửa hàng
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Spacing.screen.width,

    aspectRatio: 2,
    zIndex: 5,
  },
  iconStyle: {
    paddingHorizontal: (theme.PADDING_16 * 3) / 2,
  },
});

export default ImageWithLinking;
