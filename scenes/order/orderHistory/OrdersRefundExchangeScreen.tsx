import DabiFont from 'assets/icons/dabi.fonts';
import { toast } from 'components/alert/toast';
import { Button, ButtonState, ButtonType } from 'components/button/Button';
import { RadioCircleButton } from 'components/button/RadioCircleButton';
import { ConnectionDetection } from 'components/empty/OfflineView';
import BackButton from 'components/header/BackButton';
import ImageElement from 'components/images/ImageElement';
import ProfileImage from 'components/images/ProfileImage';
import DEPRECATED_InputField from 'components/inputs/InputField.v2';
import { HandledError } from 'error';
import { OrderItem, OrderProductItem } from 'model';
import React, { useEffect, useState } from 'react';
import { Image, Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Ripple from 'react-native-material-ripple';
import { RoutePath } from 'routes';
import { Colors, Outlines, Spacing, Typography } from 'styles';
import { fontExtraBold, fontRegular } from 'styles/typography';
import { openPermissionsDialog, toPriceFormat } from 'utils/helper';
import { useActions } from 'utils/hooks/useActions';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { exchangeOrderApi, getOrderDetailApi } from '_api';



interface OrdersRefundExchangProps {
  navigation: any;
  route: {
    params: {
      data: OrderItem
    }
  };
};

const MAX_LENGTH_PHOTOS = 5;

const OrdersRefundExchangScreen = ({ navigation, route }: OrdersRefundExchangProps) => {
  const { data: routeData } = route.params;
  const messengerLink = 'http://m.me/' + 'dabivietnam';
  const pageLink = 'https://www.facebook.com/' + '106467717966358';

  const { setLoading, showDialog } = useActions();
  const { exchangeReasons } = useTypedSelector((state) => state.order);
  const reasonList = exchangeReasons ? Object.values(exchangeReasons).map((res, index) => {
    return {
      id: index + 1,
      value: res
    }
  }) : [];

  const [isStoreSelected, setIsStoreSelected] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [selectedReason, setSelectedReason] = useState<any>(null);
  const [otherReason, setOtherReason] = useState('');
  const [media, setMedia] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);

  const { state, data, excecute, error } = useAsync<OrderItem>(() => getOrderDetailApi(routeData.code));
  const order_items = (data && data.order_items) ? data.order_items : [];

  useEffect(() => {
    setLoading(true);
    excecute();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!error) return;
    const handledError = new HandledError({
      error,
      stack: 'OrderList.getOrderDetail',
    });
    showDialog({
      title: handledError.friendlyMessage,
      actions: [
        {
          type: ButtonType.primary,
          text: 'Ok',
          onPress: () => { },
        },
      ],
    });
    handledError.log(true);
  }, [error]);

  const onSelecteStore = () => {
    setIsStoreSelected(!isStoreSelected);
    if (isStoreSelected) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(order_items);
    }
  }

  const onSelectedProduct = (product: OrderProductItem) => {
    const newList = JSON.parse(JSON.stringify(selectedProducts));
    const indexOf = newList.findIndex((res: any) => res.pk == product.pk);
    if (indexOf !== -1) {
      newList.splice(indexOf, 1);
      setSelectedProducts(newList);
    } else {
      newList.push(product);
      setSelectedProducts(newList);
    }
    setIsStoreSelected(newList.length == order_items.length);
  }

  const onStorePress = () => {
    navigation.navigate('StoreDetail', { store: data?.store });
  }

  const onProductDetailPress = (product: any) => {
    navigation.push(RoutePath.productDetail, { productPk: product?.product_pk });
  }

  const onChangeText = (text: string) => {
    setOtherReason(text);
  }

  const handleEmailChange = (email: string) => {
    const emailCheckRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    setEmail(email);
    if (emailCheckRegex.test(email)) {
      setValidEmail(true);
      setErrorEmail('');
    } else if (email && !emailCheckRegex.test(email)) {
      setValidEmail(false);
      setErrorEmail("Email không hợp lệ");
    } else {
      setErrorEmail('');
    }
  }

  const onAddPicture = () => {
    launchImageLibrary({
      quality: 0.5,
      mediaType: 'photo',
      selectionLimit: 5,
      includeBase64: true

    }, res => {
      if (res.didCancel) {
        return
      }
      if (res.errorCode) {
        // camera_unavailable	camera not available on device || permission	Permission not satisfied || others	other errors (check errorMessage for description)
        openPermissionsDialog("Yêu cầu truy cập vào thư viện ảnh bị từ chối.");
      } else {
        _onUploadImage(res.assets)
      }
    })
  }


  const _onUploadImage = (item: any) => {
    setMedia(media.concat(item));
  }

  const onRemoveImage = (item: any) => {
    setMedia(media.filter((res: any) => res.uri !== item.uri));
  }

  const isValid = () => {
    return (
      (selectedProducts.length > 0) &&
      (media.length > 0) && (
        (selectedReason && selectedReason.id === reasonList.length && otherReason) ||
        (selectedReason && selectedReason.id !== reasonList.length)
      )
    )
  }
  const onSubmit = async () => {
    try {
      setLoading(true);
      const products = selectedProducts;
      const params = {
        item_ids: products.map(res => res.pk),
        reason: selectedReason.id,
        message: selectedReason.id !== reasonList.length ? '' : otherReason,
        images: media,
        email,
      };
      await exchangeOrderApi(routeData?.pk, params);
      setLoading(false);
      toast("Cập nhật đơn hàng thành công");
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      showDialog({
        title: (error as HandledError).friendlyMessage,
        actions: [
          {
            type: ButtonType.primary,
            text: 'Ok',
            onPress: () => {/***/ },
          },
        ],
      });
    }
  }

  const onBack = () => {
    _renderExitAlert()
  };

  const _renderExitAlert = () => {
    showDialog({
      title: 'Bạn có muốn thoát khỏi màn hình đổi/trả hàng?',
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

  const _renderPrice = ({ product_is_discount, option_original_price, option_discount_price, option_discount_rate }: OrderProductItem) => {
    return (
      <View>
        {product_is_discount ? (
          <Text style={Typography.body}>
            <Text style={[Typography.description, { color: Colors.primary, fontFamily: fontExtraBold, }]}>-{option_discount_rate}% </Text>
            {toPriceFormat(option_discount_price)}
          </Text>
        ) : (
          <Text style={Typography.body}>{toPriceFormat(option_original_price)}</Text>
        )}
      </View>
    );
  };
  return (
    <ConnectionDetection.View>
      <SafeAreaView style={{}}>
        <View style={styles.header}>
          <View style={{ position: 'absolute', left: 0 }}>
            <BackButton mode={'cancel'} containerStyle={{ left: 0 }} handleOnPress={onBack} />
          </View>
          <TouchableHighlight
            onPress={() => {
              try {
                Linking.openURL(messengerLink);
              } catch {
                Linking.openURL(pageLink);
              }
            }}
            underlayColor="transparent"
            style={styles.chartIcon}>
            <DabiFont name={'chat'} />
          </TouchableHighlight>
        </View>
        {state === ConnectionState.hasData && (
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            extraScrollHeight={100}>
            <View style={styles.container}>
              {/* Title */}
              <View style={[styles.horizontalPadding, {
                paddingBottom: 24,
                marginBottom: 12,
                borderBottomWidth: Outlines.borderWidth.medium,
                borderColor: Colors.background,
              }]}>
                <Text style={styles.titleText}>{"Bạn muốn trả hàng / Hoàn tiền?"}</Text>
                <Text style={styles.descriptionTex}>{`Mã đơn hàng: ${data?.code}`}</Text>
              </View>
              {/* Store Info */}
              <View style={[styles.rowContainer, styles.horizontalPadding, { marginBottom: 12, paddingBottom: 12, }]}>
                <RadioCircleButton
                  radius={24}
                  color={isStoreSelected ? Colors.primary : Colors.white}
                  onPress={onSelecteStore}
                  selected={isStoreSelected}
                  colorCheck={true}
                  buttonStyle={styles.radioButton}
                />
                <TouchableOpacity
                  onPress={onStorePress}
                  style={[styles.rowContainer, { width: Spacing.screen.width - 32 - 24 - 12 }]}>
                  <ProfileImage size={40} source={data?.store?.profile_image} />
                  <View style={{ width: Spacing.screen.width - 32 - 24 - 12 - 40 - 12, marginLeft: 12 }}>
                    <Text numberOfLines={1}
                      style={{
                        ...Typography.name_button,
                        textTransform: 'none',
                        maxWidth: Spacing.screen.width - 32 - 24 - 12 - 40 - 12,
                        marginRight: 4,
                      }}>
                      {data?.store?.insta_id}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              {/* Product Infor */}
              <View style={styles.productContainer}>
                {order_items.map((product: OrderProductItem) => {
                  const { option_color = '', option_size = '', option_extra_option = '' } = product
                  const productOption = [option_color, option_size, option_extra_option].filter(res => res);;
                  const indexOf = selectedProducts.findIndex((res: any) => res.pk == product.pk);
                  const isSelected = indexOf != -1;
                  return (
                    <View key={product.pk} style={[styles.rowContainer, { alignItems: 'flex-start' }]}>
                      <RadioCircleButton
                        radius={24}
                        color={isSelected ? Colors.primary : Colors.white}
                        onPress={() => onSelectedProduct(product)}
                        selected={isSelected}
                        colorCheck={true}
                        buttonStyle={styles.radioButton}
                      />
                      <TouchableOpacity
                        style={styles.productItemContainer}
                        onPress={() => onProductDetailPress(product)}>
                        <ImageElement
                          sourceURL={product.product_product_thumbnail_image}
                          width={74}
                          height={92}
                          rounded
                        />
                        <View style={styles.productTextContainer}>
                          {product.product_is_new ?
                            <Text numberOfLines={1} style={[styles.productName, { color: Colors.primary }]}>{"NEW "}
                              <Text style={styles.productName} numberOfLines={1}>{product.product_name}</Text>
                            </Text> :
                            <Text style={styles.productName} numberOfLines={1}>{product.product_name}</Text>
                          }
                          <Text style={styles.productDescription} numberOfLines={1}>
                            {productOption.filter(Boolean).join(' / ')}
                          </Text>
                          {product.product_is_discount &&
                            <Text style={[Typography.description, { textDecorationLine: 'line-through', textAlign: 'right', marginTop: 12, }]}>
                              {toPriceFormat(product.option_original_price)}
                            </Text>}
                          <View style={[styles.rowSpaceContainer, { width: Spacing.screen.width - 32 - 24 - 12 - 74 - 12, marginTop: product.product_is_discount ? 0 : 24, marginBottom: 0 }]}>
                            <Text style={styles.priceText}>{`SL: ${product.quantity}`}</Text>
                            <View style={styles.priceContainer}>{_renderPrice(product)}</View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )
                })}
              </View>
              {/* Reason List */}
              <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
                <Text style={[Typography.title, { color: 'black', marginBottom: 6 }]}>{"Tại sao bạn muốn đổi/trả đơn hàng này vậy?"}</Text>
                {reasonList.map((item, index) => {
                  const isSelected = selectedReason && selectedReason.value == item.value;
                  return (
                    <Ripple key={index} onPress={() => setSelectedReason(item)}>
                      <RadioCircleButton
                        key={index}
                        radius={24}
                        color={Colors.white}
                        selected={isSelected}
                        nonIconChecked={true}
                        label={item.value}
                        buttonStyle={styles.radioButton}
                        labelStyle={{ ...Typography.body, fontFamily: fontRegular, color: 'black', marginTop: -4 }}
                        containerStyle={{ flexDirection: 'row', justifyContent: 'flex-start', paddingVertical: 6, }}
                      />
                    </Ripple>
                  );
                })}
                <DEPRECATED_InputField
                  multiline={true}
                  labelText="Lý do"
                  labelTextSize={12}
                  labelColor={Colors.black}
                  textColor={Colors.text}
                  borderBottomColor={Colors.primary}
                  inputType="text"
                  returnKeyType={'done'}
                  blurOnSubmit
                  customStyle={{ marginTop: 6, paddingVertical: 6 }}
                  onChangeText={onChangeText}
                  autoCapitalize={'none'}
                  comment="Nhập lý do cụ thể"
                  maxLength={75}
                  textInputStyle={{ maxHeight: null }}
                  editable={selectedReason && selectedReason.id == reasonList.length}
                />
              </View>
              {/* Upload Media */}
              <View>
                <Text style={{ ...Typography.option, marginBottom: 12, marginLeft: 16 }}>{"Ảnh chụp minh họa"}</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ paddingHorizontal: 10, marginRight: 16, marginBottom: 24 }}>
                  <TouchableOpacity disabled={media.length == 5} onPress={onAddPicture} style={styles.imageContainer}>
                    <Image style={styles.icon} source={require('_assets/images/fontable/camera_icon.png')} />
                    <Text style={Typography.description}>{`${media.length}/${MAX_LENGTH_PHOTOS}`}</Text>
                  </TouchableOpacity>
                  {media.map((item: any, index: number) => {
                    return (
                      <View key={item.uri} style={[styles.imageContainer, index == media.length - 1 && { marginRight: 16 }]}>
                        <ImageElement
                          containerStyle={styles.image}
                          width={78}
                          height={78}
                          sourceURL={item.uri} />
                        <TouchableOpacity style={styles.deleteIconContainer} onPress={() => onRemoveImage(item)}>
                          <Image
                            style={styles.deleteIcon}
                            source={require('_assets/images/icon/delete_white.png')} />
                        </TouchableOpacity>
                      </View>
                    )
                  })}
                </ScrollView>
              </View>
              {/* Email */}
              <DEPRECATED_InputField
                labelText="Email"
                labelTextSize={12}
                labelColor={Colors.black}
                textColor={Colors.text}
                borderBottomColor={Colors.primary}
                inputType="email"
                onChangeText={handleEmailChange}
                showCheckmark={validEmail}
                autoCapitalize={'none'}
                comment="Nhập email của bạn"
                errorMsg={errorEmail}
                customStyle={{ marginLeft: 16, width: Spacing.screen.width - 32 }}
              />
              {/* Apply Buton */}
              <View style={styles.nextButton}>
                <Button
                  type={ButtonType.primary}
                  state={!isValid() ? ButtonState.disabled : ButtonState.idle}
                  onPress={onSubmit}
                  disabled={!isValid()}
                  text={"Yêu cầu trả hàng"}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        )}
      </SafeAreaView>
    </ConnectionDetection.View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 12,
    ...ifIphoneX({
      marginBottom: 0
    }, {
      marginBottom: 40
    })
  },
  header: {
    height: 48,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartIcon: {
    position: 'absolute',
    right: 0,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 16
  },
  horizontalPadding: {
    paddingHorizontal: 16,
  },
  titleText: {
    ...Typography.h1,
  },
  descriptionTex: {
    ...Typography.description,
    fontFamily: fontRegular,
    textTransform: 'none',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSpaceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: -12,
    borderBottomWidth: Outlines.borderWidth.medium,
    borderColor: Colors.background,
  },
  productItemContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  productTextContainer: {
    width: Spacing.screen.width - 32 - 74 - 36 - 12,
    marginLeft: 12,
  },
  productName: {
    ...Typography.name_button,
    textTransform: 'none'
  },
  productDescription: {
    ...Typography.body,
    textTransform: 'none',
    color: Colors.surface.darkGray
  },
  priceText: {
    ...Typography.body,
    textTransform: 'none',
    color: Colors.surface.darkGray
  },
  priceContainer: {
    marginTop: 4,
  },
  radioButton: {
    marginRight: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
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
    justifyContent: 'center'
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
  nextButton: {
    paddingHorizontal: 16,
    paddingBottom: (40 - (14 - 8) / 2) * Spacing.AUTH_RATIO_H,
    backgroundColor: 'white',
    paddingTop: 24,
  },
});

export default React.memo(OrdersRefundExchangScreen);
