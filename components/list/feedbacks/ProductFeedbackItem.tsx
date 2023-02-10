import { useNavigation } from '@react-navigation/native';
import ImageElement from 'components/images/ImageElement';
import ProfileImage from 'components/images/ProfileImage';
import ViewTextMore from 'components/text/ViewTextMore';
import { ProductUserFeedbackItem } from 'model';
import moment from 'moment';
import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Rating } from 'react-native-ratings';
import { RoutePath } from 'routes';
import { Colors, Outlines, Spacing, Typography } from 'styles';


interface ProductFeedbackItemProps {
  data: ProductUserFeedbackItem;
  style?: ViewStyle;
  showImage?: boolean;
  darkColor?: boolean;
  fullDescription?: boolean;
  index?: number;
}

const ProductFeedbackItem = ({ data, style, showImage = true, darkColor = false, fullDescription = false, index = 0 }: ProductFeedbackItemProps) => {
  const navigation = useNavigation();
  const {
    image_1,
    image_2,
    image_3,
    image_4,
    image_5,
    created_at,
    content,
    user,
    option,
  } = data;
  const {
    color = '',
    size = '',
    extra_option = '',
  } = option || {};
  const media = [image_1, image_2, image_3, image_4, image_5].filter(res => res)
  const productOption = [color, size, extra_option].filter(res => res);
  const time = (created_at && moment(created_at).isValid()) ? moment(created_at).format("DD-MM-YYYY") : moment().format("DD-MM-YYYY");

  const openImageScreen = (_index: number) => {
    navigation.push(RoutePath.userFeedbackImageScreen, { data: data, currentIndex: _index, itemIndex: index });
  };

  const defaultAvatar = [
    require('_assets/images/icon/default_avatar.png'),
    require('_assets/images/icon/default_avatar_blue.png'),
    require('_assets/images/icon/default_avatar_green.png'),
    require('_assets/images/icon/default_avatar_violet.png'),
  ]

  const renderImageItem = useCallback((item: string, index: number) => {
    return (
      <TouchableOpacity
        onPress={() => openImageScreen(index)}
        key={index}
        style={[styles.imageContainer, index == media.length - 1 && { marginRight: 16 }]}>
        <ImageElement
          containerStyle={styles.image}
          width={imageSize}
          height={imageSize}
          sourceURL={item} />
      </TouchableOpacity>
    )
  }, []);

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.rowContainer, { width: '100%', paddingHorizontal: 16 }]}>
        <ProfileImage size={40} source={user?.profile_image || defaultAvatar[(user ? user.pk : index) % 4]} />
        <View style={{ width: Spacing.screen.width - 32 - 52, marginLeft: 12 }}>
          <View style={[styles.rowContainer]}>
            <Text numberOfLines={1}
              style={{
                ...Typography.name_button,
                textTransform: 'none',
                maxWidth: Spacing.screen.width - 32 - 52,
                marginRight: 8,
                color: darkColor ? Colors.white : Colors.black
              }}>
              {user?.name || "Ẩn danh"}
            </Text>
          </View>
          <Text style={{ ...Typography.description }}>
            {time}
          </Text>
        </View>
      </View>
      <View style={{ paddingHorizontal: 16, alignItems: 'flex-start', marginTop: 12 }}>
        {data.score ? <Rating
          type='custom'
          ratingImage={require('_assets/images/icon/star.png')}
          ratingColor='transparent'
          ratingBackgroundColor="transparent"
          tintColor='#DBDDDE'
          tintColorSelected='#FDE9A6'
          startingValue={data.score || 0}
          ratingCount={5}
          imageSize={12}
          imagePadding={6}
          readonly={true}
          style={{ marginBottom: 14 }}
        /> : undefined}
        {productOption.length > 0 && <Text style={{ ...Typography.description }}>{"Loại: " + productOption.join(', ')}</Text>}
      </View>
      {content && <ViewTextMore
        _key='content'
        style={{ paddingHorizontal: 16, marginTop: 0, marginBottom: 0, color: darkColor ? Colors.white : Colors.black }}
        numberOfLines={fullDescription ? 30 : 2}>
        {content || ''}
      </ViewTextMore>}
      {showImage && media?.length > 0 && <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingHorizontal: 12, marginRight: 16, marginTop: 12 }}>
        {media.map((item: string, index: number) => renderImageItem(item, index))}
      </ScrollView>}
    </View>
  );
};

export default React.memo(ProductFeedbackItem);

const imageSize = 78
const styles = StyleSheet.create({
  container: {
    width: Spacing.screen.width,
    paddingTop: 12,
    paddingBottom: 24,
    borderBottomWidth: Outlines.borderWidth.base,
    borderColor: Colors.background,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rowSpaceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  imageContainer: {
    marginHorizontal: 6,
    width: imageSize,
    height: imageSize,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.boxLine,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: imageSize,
    height: imageSize,
    borderRadius: 4,
    resizeMode: 'cover',
  },
});
