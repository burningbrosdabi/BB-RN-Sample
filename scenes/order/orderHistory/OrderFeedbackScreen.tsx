import { toast } from 'components/alert/toast';
import { Button, ButtonState, ButtonType } from 'components/button/Button';
import { RadioCircleButton } from 'components/button/RadioCircleButton';
import { ConnectionDetection } from 'components/empty/OfflineView';
import BackButton from 'components/header/BackButton';
import ImageElement from 'components/images/ImageElement';
import { OrderItem, OrderProductItem } from 'model';
import React, { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Rating } from 'react-native-ratings';
import { RoutePath } from 'routes';
import { feedbackProductApi, productFeedbackStream } from 'services/api';
import { Colors, Outlines, Spacing, Typography } from 'styles';
import { openPermissionsDialog } from 'utils/helper';
import { useActions } from 'utils/hooks/useActions';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';

interface OrderFeedbackProps {
  navigation: any;
  route: {
    params: {
      data: OrderItem;
      product: OrderProductItem;
    };
  };
}

const MAX_LENGTH_COMMENT = 250;
const MAX_LENGTH_PHOTOS = 5;

const OrderFeedbackScreen = ({ navigation, route }: OrderFeedbackProps) => {
  const { data, product } = route.params;
  const { userInfo } = useTypedSelector(state => state.user);

  const { option_color = '', option_size = '', option_extra_option = '' } = product || {};
  const productOption = [option_color, option_size, option_extra_option].filter(res => res);
  const { setLoading, showDialog, } = useActions();

  const [star, setStar] = useState(0);
  const [comment, setComment] = useState('');
  const [hidden, setHidden] = useState(false);
  const [media, setMedia] = useState<any>([]);

  useEffect(() => { }, []);

  const onAddPicture = () => {
    launchImageLibrary(
      {
        quality: 0.5,
        mediaType: 'photo',
        selectionLimit: 5,
        includeBase64: true,
      },
      res => {
        if (res.didCancel) {
          return;
        }
        if (res.errorCode) {
          // camera_unavailable	camera not available on device || permission	Permission not satisfied || others	other errors (check errorMessage for description)
          openPermissionsDialog('Yêu cầu truy cập vào thư viện ảnh bị từ chối.');
        } else {
          _onUploadImage(res.assets);
        }
      },
    );
  };

  const _onUploadImage = (item: any) => {
    setMedia(media.concat(item));
  };

  const onRemoveImage = (item: any) => {
    setMedia(media.filter((res: any) => res.uri !== item.uri));
  };

  const onTextChange = (text: string) => {
    setComment(text);
  };

  const onProductDetailPress = () => {
    product && navigation.push(RoutePath.productDetail, { productPk: product.product_pk });
  };

  const handleNextButton = async () => {
    try {
      setLoading(true);
      const params = {
        is_anonymous: hidden,
        score: star,
        content: comment,
        images: media,
        order_item: product.pk,
      };
      await feedbackProductApi(product?.product_pk, params);

      productFeedbackStream.next({ orderPk: data.pk, optionPk: product?.option_pk });

      setLoading(false);
      toast('Đánh giá sản phẩm thành công');
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      showDialog({
        title: error.friendlyMessage,
        actions: [
          {
            type: ButtonType.primary,
            text: 'Ok',
            onPress: () => { },
          },
        ],
      });
    }
  };

  const onFinishRating = (rating: number) => {
    setStar(rating);
  };

  const isValid = () => {
    return star;
  };

  const onBack = () => {
    _renderExitAlert();
  };

  const _renderExitAlert = () => {
    showDialog({
      title: 'Bạn có muốn thoát khỏi màn hình đánh giá?',
      actions: [
        {
          type: ButtonType.primary,
          text: 'Tiếp tục ở lại',
          onPress: () => { },
        },
        {
          text: 'Rời khỏi',
          type: ButtonType.flat,
          onPress: () => navigation.goBack(),
          textStyle: { color: Colors.primary },
        },
      ],
    });
  };

  return (
    <ConnectionDetection.View>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          enableAutomaticScroll
          extraScrollHeight={100}>
          <View style={styles.header}>
            <View style={{ position: 'absolute', left: 0 }}>
              <BackButton mode={'cancel'} containerStyle={{ left: 0 }} handleOnPress={onBack} />
            </View>
            <Text numberOfLines={1} style={[Typography.title, styles.titleStyle]}>
              {'Đánh giá đơn hàng'}
            </Text>
          </View>
          <View style={styles.rowContainer}>
            {product ? (
              <TouchableOpacity style={styles.productContainer} onPress={onProductDetailPress}>
                <ImageElement
                  sourceURL={product.product_product_thumbnail_image}
                  width={74}
                  height={92}
                  rounded
                />
                <View style={styles.productTextContainer}>
                  {product.product_is_new ? (
                    <Text numberOfLines={2} style={[styles.productName, { color: Colors.primary }]}>
                      {'NEW '}
                      <Text style={styles.productName} numberOfLines={2}>
                        {product.product_name}
                      </Text>
                    </Text>
                  ) : (
                    <Text style={styles.productName} numberOfLines={2}>
                      {product.product_name}
                    </Text>
                  )}
                  <Text style={styles.productDescription} numberOfLines={1}>
                    {productOption.filter(Boolean).join(' / ')}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : undefined}
          </View>
          <View style={styles.ratingContainer}>
            <Text
              style={[
                Typography.h1,
                {
                  textAlign: 'center',
                  marginBottom: 12,
                  textTransform: 'none',
                },
              ]}>
              {'Điểm đánh giá'}
            </Text>
            <Rating
              type="custom"
              ratingImage={require('_assets/images/icon/star.png')}
              ratingColor="transparent"
              ratingBackgroundColor="transparent"
              tintColor="#DBDDDE"
              tintColorSelected="#FDE9A6"
              startingValue={0}
              ratingCount={5}
              imageSize={24}
              imagePadding={12}
              onFinishRating={onFinishRating}
            />
          </View>
          <View style={[styles.rowSpaceContainer, styles.commentSection]}>
            <Text style={[Typography.title, { textTransform: 'none' }]}>{'Viết đánh giá'}</Text>
            <Text style={Typography.description}>{`${comment.length}/${MAX_LENGTH_COMMENT}`}</Text>
          </View>
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ paddingHorizontal: 10, marginRight: 16, marginBottom: 12 }}>
              <TouchableOpacity
                disabled={media.length == 5}
                onPress={onAddPicture}
                style={styles.imageContainer}>
                <Image
                  style={styles.icon}
                  source={require('_assets/images/fontable/camera_icon.png')}
                />
                <Text style={Typography.description}>{`${media.length}/${MAX_LENGTH_PHOTOS}`}</Text>
              </TouchableOpacity>
              {media.map((item: any, index: number) => {
                return (
                  <View
                    key={item.uri}
                    style={[
                      styles.imageContainer,
                      index == media.length - 1 && { marginRight: 16 },
                    ]}>
                    <ImageElement
                      containerStyle={styles.image}
                      width={78}
                      height={78}
                      sourceURL={item.uri}
                    />
                    <TouchableOpacity
                      style={styles.deleteIconContainer}
                      onPress={() => onRemoveImage(item)}>
                      <Image
                        style={styles.deleteIcon}
                        source={require('_assets/images/icon/delete_white.png')}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
          <View style={{}}>
            <TextInput
              style={[Typography.body, { paddingHorizontal: 16, color: Colors.black }]}
              placeholder={'Nhập phản hồi của bạn, tối đa 250 kí tự'}
              placeholderTextColor={Colors.text}
              onChangeText={onTextChange}
              multiline
              maxLength={250}
              returnKeyType={'done'}
            />
          </View>
        </KeyboardAwareScrollView>
        <View style={styles.nextButton}>
          <RadioCircleButton
            radius={24}
            color={hidden ? Colors.primary : Colors.white}
            onPress={() => setHidden(!hidden)}
            selected={hidden}
            colorCheck={true}
            label={'Ẩn danh'}
            border={false}
            buttonStyle={styles.radioButton}
            labelStyle={{ ...Typography.name_button, marginTop: -4 }}
            containerStyle={{ flexDirection: 'row', alignSelf: 'flex-start', marginBottom: 12 }}
          />
          <View style={{ height: 48 }}>
            <Button
              type={ButtonType.primary}
              state={!isValid() ? ButtonState.disabled : ButtonState.idle}
              onPress={handleNextButton}
              disabled={!isValid()}
              text={'Đánh giá'}
            />
          </View>
        </View>
      </SafeAreaView>
    </ConnectionDetection.View>
  );
};

export default React.memo(OrderFeedbackScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleStyle: {
    textAlign: 'center',
  },
  header: {
    height: 48,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextButton: {
    width: Spacing.screen.width - 32,
    marginLeft: 16,
    // position: 'absolute',
    // bottom: 0,
    // paddingBottom: 37 * Spacing.AUTH_RATIO_H,
    backgroundColor: 'white',
    paddingVertical: 12,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productContainer: {
    flexDirection: 'row',
    paddingBottom: 12,
    borderBottomWidth: Outlines.borderWidth.medium,
    borderColor: Colors.background,
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  productTextContainer: {
    width: Spacing.screen.width - 32 - 74 - 12,
    marginLeft: 12,
  },
  productName: {
    ...Typography.name_button,
    textTransform: 'none',
  },
  productDescription: {
    ...Typography.body,
    textTransform: 'none',
    color: Colors.surface.darkGray,
  },
  rowSpaceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceText: {
    ...Typography.body,
    textTransform: 'none',
    color: Colors.surface.darkGray,
  },
  priceContainer: {
    marginTop: 4,
  },
  ratingContainer: {
    paddingBottom: 24,
    borderBottomWidth: Outlines.borderWidth.medium,
    borderColor: Colors.background,
    marginVertical: 12,
    marginTop: 0,
  },
  commentSection: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: Outlines.borderWidth.base,
    borderColor: Colors.background,
  },
  imageContainer: {
    marginHorizontal: 6,
    width: 78,
    height: 78,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.boxLine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  deleteIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },
  deleteIconContainer: {
    padding: 8,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  image: {
    width: 78,
    height: 78,
    borderRadius: 4,
    resizeMode: 'cover',
  },
  radioButton: {
    marginRight: 4,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
