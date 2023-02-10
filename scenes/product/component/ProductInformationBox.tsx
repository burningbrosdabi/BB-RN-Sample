import { useNavigation } from '@react-navigation/native';
import { MultiColorIcon } from 'assets/icons';
import { toast } from 'components/alert/toast';
import { GradientTextBoxPlaceHolder } from 'components/box/GradientTextBox';
import IconButton from 'components/button/IconButton';
import ProductHeartButton from 'components/button/product/ProductHeartButton';
import { RadioCircleButton } from 'components/button/RadioCircleButton';
import { isNil, range } from 'lodash';
import { ProductColor, ProductDetail } from 'model';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { ProductDetailParams, ProductDetailRouteSetting } from 'routes';
import { linkService } from 'services/link/link.service';
import { Colors, Outlines, Typography } from 'styles';
import { fontPlaceHolder } from 'styles/typography';
import { defaultShare } from 'utils/hooks/useShare';
import { setLoading } from 'utils/state/action-creators';
import { toPriceFormat } from '_helper';

/** @deprecated   **/
const ProductInformationBox = ({ data }: { data: ProductDetail }) => {
  const navigation = useNavigation();
  const { store, color, size, name, is_new, is_discount, product_source, style } = data;

  const _renderPrice = ({
    original_price,
    discount_price,
    is_discount,
    discount_rate,
    is_free_ship,
  }: ProductDetail) => {
    if (discount_price == 0 && original_price == 0) return

    return (
      <View
        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
            }}>
            {is_discount && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={{
                    ...Typography.body,
                    textDecorationLine: 'line-through',
                    color: Colors.text,
                  }}>
                  {toPriceFormat(original_price)}
                </Text>
              </View>
            )}
          </View>
          <Text style={[Typography.h1, { textTransform: 'none' }]}>
            {is_discount ? toPriceFormat(discount_price) : toPriceFormat(original_price)}
          </Text>
        </View>
        <View style={{ top: -4 }}>
        </View>
      </View>
    );
  };

  const _renderOption = () => {
    return (
      <View style={{ paddingBottom: 12 }}>
        <Text style={[Typography.description]}>Loại sản phẩm</Text>
        <View style={{ height: 12 }} />
        {color?.length > 0 && (
          <View>
            <Text style={[Typography.name_button, { paddingBottom: 12 }]}>Màu</Text>
            <View style={[{ flexDirection: 'row', flexWrap: 'wrap' }]}>
              {color.map((item: ProductColor, index: number) => {
                const { display_name = '', color_code } = item;
                return (
                  <View
                    style={[
                      { marginBottom: 12, paddingRight: 12 },
                      (index + 1) % 5 === 0 ? null : null,
                    ]}
                    key={index}>
                    {display_name === 'MULTIPLE' ? (
                      <MultiColorIcon />
                    ) : (
                      <RadioCircleButton
                        color={color_code}
                        radius={24}
                        border={color_code.toLowerCase() === Colors.white.toLowerCase()}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}
        {size?.length > 0 && (
          <View>
            <Text style={[Typography.name_button, { paddingBottom: 12 }]}>Kích Thước</Text>
            <View style={[{ flexDirection: 'row', flexWrap: 'wrap' }]}>
              {size.map((item, index) => {
                return (
                  <View
                    style={{
                      marginBottom: 12,
                      paddingHorizontal: 12,
                      paddingVertical: 4,
                      marginRight: 4,
                      borderRadius: Outlines.borderRadius.base,
                      backgroundColor: Colors.background,
                    }}
                    key={`${index}`}>
                    <Text style={Typography.description}>Size {item}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </View>
    );
  };

  const Actions = ({ data }: { data: ProductDetail }) => {
    const { pk } = data;
    const onPressShare = async () => {
      try {
        setLoading(true);

        if (isNil(data)) {
          return;
        }
        const path = new ProductDetailRouteSetting().toURLPath(new ProductDetailParams(data.pk));
        const link = await linkService().buildLink({
          path,
          social: {
            imageUrl: data.original_thumbnail_image,
            descriptionText: data.description,
            title: data.name,
          },
        });
        defaultShare({
          title: data.name,
          message: link,
        });
      } catch (e) {
        toast('Không thể chia sẻ bài viết');
      } finally {
        setLoading(false);
      }
    };

    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12 }}>
        <ProductHeartButton data={data} />
        <IconButton icon={"share-1"} onPress={onPressShare} />
      </View>
    );
  };


  return (
    <View >
      <View style={{ height: 12 }} />
      <Actions data={data} />
      <View style={{ paddingHorizontal: 16 }}>
        <View style={{ height: 12 }} />
        <Text style={Typography.mark} numberOfLines={1}>{store.insta_id}</Text>
        <View style={{ height: 12 }} />
        <Text style={Typography.body} numberOfLines={2}>{name}</Text>
        {!isNil(style) && <Text style={{ ...Typography.body, color: Colors.blue, marginTop: 12 }} numberOfLines={2}>{style && `#${style}`}</Text>}
        <View style={{ height: 24 }} />
        {_renderPrice(data)}
        <View style={{ height: 36 }} />
        {/* {(color?.length > 0 || size?.length > 0) && _renderOption()} */}
        {/* {_renderStoreFollowButton()} */}
      </View>
    </View>
  );
};

export const ProductInformationPlaceholder = () => {
  return (
    <View style={{ paddingHorizontal: 16 }}>
      <View style={{ height: 12 }} />
      <GradientTextBoxPlaceHolder />
      <View style={{ height: 4 }} />
      <PlaceholderLine noMargin style={{ width: '80%', height: 20, backgroundColor: 'white' }} />
      <View style={{ height: 2 }} />
      <PlaceholderLine noMargin style={{ width: '70%', height: 20, backgroundColor: 'white' }} />
      <View style={{ height: 12 }} />
      <View style={{ width: '100%', height: 1, backgroundColor: Colors.background }} />
      <View style={{ height: 12 }} />
      <PlaceholderLine
        noMargin
        style={{ width: '50%', ...fontPlaceHolder.title, backgroundColor: 'white' }}
      />
      <PlaceholderLine
        noMargin
        style={{ width: '40%', ...fontPlaceHolder.h1, backgroundColor: 'white' }}
      />
      <View style={{ height: 20 }} />
      <PlaceholderLine
        noMargin
        style={{ width: '20%', ...fontPlaceHolder.description, backgroundColor: 'white' }}
      />
      <View style={{ height: 12 }} />
      <View style={{ flexDirection: 'row' }}>
        {range(3).map((_, index) => {
          return (
            <PlaceholderMedia
              key={`${index}`}
              style={{
                marginRight: 12,
                width: 24,
                height: 24,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: Colors.boxLine,
                backgroundColor: 'white',
              }}
            />
          );
        })}
      </View>
      <View style={{ height: 12 }} />
      <View style={{ flexDirection: 'row' }}>
        {range(3).map((_, index) => {
          return (
            <View
              key={`${index}`}
              style={{
                width: 56,
                height: 24,
                borderWidth: 1,
                borderColor: Colors.boxLine,
                borderRadius: 4,
                marginRight: 4,
              }}
            />
          );
        })}
      </View>
      <View style={{ height: 24 }} />
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: Colors.boxLine,
          padding: 12,
          borderRadius: 4,
          flexDirection: 'row',
        }}>
        <PlaceholderMedia
          style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'white' }}
        />
        <View style={{ width: 12 }} />
        <PlaceholderLine noMargin style={{ width: '30%', height: 18, backgroundColor: 'white' }} />
        <View style={{ flex: 1 }} />
        <PlaceholderLine noMargin style={{ width: 80, height: 28, backgroundColor: 'white' }} />
      </View>
      <View style={{ height: 28 }} />
    </View>
  );
};

export default ProductInformationBox;
const styles = StyleSheet.create({
  nameText: { ...Typography.name_button },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  storeDetailBtn: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
    ...Outlines.borderPreset.base,
    color: Colors.boxLine,
  },
  followBtnContainer: { position: 'absolute', right: 12 },
  newProductText: {
    ...Typography.title,
    color: Colors.primary,
    textTransform: 'uppercase',
  },
});
