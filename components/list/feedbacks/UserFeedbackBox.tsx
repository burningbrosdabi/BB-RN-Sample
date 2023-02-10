import { useNavigation } from '@react-navigation/native';
import ImageElement from 'components/images/ImageElement';
import ViewTextMore from 'components/text/ViewTextMore';
import { UserFeedbackItem } from 'model';
import moment from 'moment';
import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Rating } from 'react-native-ratings';
import { RoutePath } from 'routes';
import { Colors, Outlines, Spacing, Typography } from 'styles';
import FeedProduct from '../post/FeedProduct';
import { isEmpty, isNil } from 'lodash';

interface UserFeedbackItemProps {
  data: UserFeedbackItem;
  style?: ViewStyle;
  showImage?: boolean;
  darkColor?: boolean;
  index?: number;
}

const UserFeedbackBox = ({
  data,
  style,
  showImage = true,
  darkColor = false,
  index = 0,
}: UserFeedbackItemProps) => {
  const navigation = useNavigation();
  const {
    created_at,
    score,
    content,
    image_1,
    image_2,
    image_3,
    image_4,
    image_5,
    product,
    product_thumbnail_image,
    option,
    store_name,
    product_name,
  } = data;
  const media = [image_1, image_2, image_3, image_4, image_5].filter(res => res);
  const {
    color = '',
    size = '',
    extra_option = '',
    product_discount_rate = 0,
    product_discount_price = 0,
    product_original_price = 0,
  } = option || {};
  const productOption = [color, size, extra_option].filter(res => res);
  const time =
    created_at && moment(created_at).isValid()
      ? moment(created_at).format('DD-MM-YYYY')
      : moment().format('DD-MM-YYYY');

  const openImageScreen = (_index: number) => {
    navigation.push(RoutePath.userFeedbackImageScreen, {
      data: data,
      currentIndex: _index,
      itemIndex: index,
    });
  };

  const renderProductInfo = () => {
    const productData = {
      pk: product,
      product_thumbnail_image: product_thumbnail_image,
      store: store_name,
      name: product_name,
      discount_rate: product_discount_rate,
      discount_price: product_discount_price,
      original_price: product_original_price,
    };
    return <FeedProduct data={productData} navigation={navigation} />;
  };

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
          sourceURL={item}
        />
      </TouchableOpacity>
    );
  }, []);

  return (
    <View style={[styles.container, style]}>
      {renderProductInfo()}
      <View style={{ paddingHorizontal: 16, alignItems: 'flex-start' }}>
        <View style={{ height: 12 }} />
        <Rating
          type="custom"
          ratingImage={require('_assets/images/icon/star.png')}
          ratingColor="transparent"
          ratingBackgroundColor="transparent"
          tintColor="#DBDDDE"
          tintColorSelected="#FDE9A6"
          startingValue={score || 0}
          ratingCount={5}
          imageSize={12}
          imagePadding={6}
          readonly={true}
          style={{ marginBottom: 12 }}
        />
        {productOption.length > 0 && (
          <Text style={Typography.description}>{'Loại: ' + productOption.join(', ')}</Text>
        )}
      </View>
      {!isEmpty(content) ? (
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={Typography.body}>{content}</Text>
        </View>
      ) : undefined}
      {showImage && media?.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingHorizontal: 12, marginRight: 16, marginTop: 12 }}>
          {media.map((item: string, index: number) => renderImageItem(item, index))}
        </ScrollView>
      )}
    </View>
  );
};

export default React.memo(UserFeedbackBox);

const imageSize = 78;
const styles = StyleSheet.create({
  container: {
    width: Spacing.screen.width,
    paddingVertical: 12,
    borderBottomWidth: Outlines.borderWidth.medium,
    borderColor: Colors.line,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    justifyContent: 'center',
  },
  image: {
    width: imageSize,
    height: imageSize,
    borderRadius: 4,
    resizeMode: 'cover',
  },
});
