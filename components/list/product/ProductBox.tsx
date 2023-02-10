import { Decorator } from 'components/decorator/Decorator';
import { ProductInfo } from 'model/product/product';
import React, { useMemo } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { ProductDetailRouteSetting } from 'routes/product/productDetail.route';
import NavigationService from 'services/navigation/navigation.service';
import { Colors, Spacing, Typography } from 'styles';
import { fontBold, fontExtraBold, fontPlaceHolder } from 'styles/typography';
import { toPriceFormat } from 'utils/helper/FormatHelper';
import { get } from 'lodash';
import ProductHeartButton from 'components/button/product/ProductHeartButton';
import ImageElement, { ImageElementFlex, ImageElementNative } from 'components/images/ImageElement';
import { DEFAULT_IC_BTN_PADDING } from 'components/button/IconButton';
import { PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { DabiFont } from 'assets/icons';
import { getProductThumbnail } from '_helper';
import { ProductSource } from 'model/product/ProductSource';
import { createAffiliateLog } from 'services/api';
import { RelatedProduct } from 'model/product/related.product';

const getDecorator = ({
  is_feedback_exist,
  source,
  isShowText = true,
}: {
  is_feedback_exist: boolean;
  source: ProductSource;
  isShowText?: boolean;
}) => {
  const is_kbrand = source === ProductSource.KOREA;
  const child = useMemo(() => {
    if (is_feedback_exist && is_kbrand) {
      return (
        <View style={{ flexDirection: 'row' }}>
          <Decorator.KBrand isShowText={false} />
          <View style={{ width: 4 }} />
          <Decorator.Feedback isShowText={false} />
        </View>
      );
    } else
      if (is_feedback_exist) {
        return <Decorator.Feedback isShowText={isShowText} />;
      } else if (is_kbrand) {
        return <Decorator.KBrand isShowText={isShowText} />;
      }
  }, []);

  return <View style={{ position: 'absolute', left: 0, bottom: 0 }}>{child}</View>;
};


export const ProductBox = ({ data, relatedProduct = false }: {
  data: RelatedProduct; relatedProduct?: boolean
}) => {
  const _renderPrice = ({
    is_discount,
    original_price,
    discount_price,
    discount_rate,

  }: {
    is_discount?: number;
    original_price: number;
    discount_price?: number;
    discount_rate?: number;
  }) => {
    if (discount_price == 0 && original_price == 0) return
    return (
      <View>
        {is_discount ? (
          <Text style={{ ...Typography.name_button, textTransform: 'none' }}>
            <Text style={[Typography.body, { color: Colors.red, textTransform: 'none' }]}>
              -{discount_rate}%{' '}
            </Text>
            {toPriceFormat(discount_price)}
          </Text>
        ) : (
          <Text style={{ ...Typography.name_button, textTransform: 'none' }}>
            {toPriceFormat(original_price)}
          </Text>
        )}
      </View>
    );
  };
  const onPress = () => {
    console.log(data)
    // if (!affiliate) {
    console.log(data.product_pk)
    const routeSetting = new ProductDetailRouteSetting({
      productPk: relatedProduct ? data.product_pk : data.pk, affiliateLink: data.affiliate_link
    });
    NavigationService.instance.navigate(routeSetting);
    // }
    // else {
    //   Linking.openURL(data.affiliate_link ? data.affiliate_link : data.out_link).then(
    //     async () =>
    //       await createAffiliateLog({ pk: data.pk })
    //   )
    // }
  };

  const image = useMemo(() => {
    return getProductThumbnail(data);
  }, [data]);


  return (
    <View
      style={{
        flex: 1,
      }}>
      {/* <View style={styles.productHeartButtonContainer}>
        <ProductHeartButton data={data} />
      </View> */}
      <Ripple style={{ flex: 1 }} onPress={onPress}>
        <View style={{ width: '100%', aspectRatio: 4 / 5 }}>
          <ImageElementFlex image={image} />
          {/* {decorator} */}
        </View>
        <View style={{ height: 8 }} />
        <View style={{ paddingHorizontal: 6 }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}>
            <Text style={{
              ...Typography.mark,
              width: '80%',
            }} numberOfLines={1}>
              {`${get(data, 'store.insta_id', null) ?? data.store}`}
            </Text>
            {data.is_new && (
              <Text style={{
                ...Typography.mark,
                color: Colors.component,
              }} numberOfLines={1}>
                {'NEW'}
              </Text>
            )}
          </View>
          <Text style={Typography.description} numberOfLines={1}>
            {data.name}
          </Text>
          <View style={styles.priceContainer}>{_renderPrice(data)}</View>
        </View>
      </Ripple>
    </View>
  );
};

export const ProductBoxPlaceholder = () => {
  const width = (Spacing.screen.width - 16 * 3) / 2;

  return (
    <View>
      <View
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 2,
        }}>
        <DabiFont name={'heart_line'} color={Colors.surface.lightGray} />
      </View>
      <PlaceholderMedia
        style={{
          width,
          height: (width / 4) * 5,
          backgroundColor: Colors.surface.white,
        }}
      />
      <View style={{ height: 8 }} />
      <PlaceholderLine
        noMargin
        style={{
          ...fontPlaceHolder.description,
          width: '30%',
          backgroundColor: Colors.surface.white,
        }}
      />
      <View style={{ height: 4 }} />
      <PlaceholderLine
        noMargin
        style={{
          ...fontPlaceHolder.subTitle,
          width: '100%',
          backgroundColor: Colors.surface.white,
        }}
      />
      <View style={{ height: 4 }} />
      <PlaceholderLine
        noMargin
        style={{ ...fontPlaceHolder.title, width: '70%', backgroundColor: Colors.surface.white }}
      />
    </View>
  );
};

export const ProductBoxPlaceholderRow = () => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <ProductBoxPlaceholder />
      <View style={{ width: 12 }} />
      <ProductBoxPlaceholder />
    </View>
  );
};

export const ProductSmallBox = ({ data }: { data: ProductInfo }) => {
  const onPress = () => {
    const routeSetting = new ProductDetailRouteSetting({ productPk: data.pk });
    NavigationService.instance.navigate(routeSetting);
  };

  const image = useMemo(() => {
    return getProductThumbnail(data);
  }, [data]);

  const decorator = getDecorator({
    is_feedback_exist: data.is_feedback_exist,
    source: data.product_source,
    isShowText: false,
  });

  return (
    <View
      style={{
        width: 96,
        height: 168,
      }}>
      <Ripple style={{ flex: 1 }} onPress={onPress}>
        <View style={{ width: '100%', aspectRatio: 4 / 5 }}>
          <ImageElementNative image={image} />
          {/* {decorator} */}
        </View>
        <View style={{ marginTop: 4, paddingHorizontal: 4 }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              overflow: 'hidden',
            }}>
            {data.is_discount && (
              <Text
                style={{
                  ...Typography.description,
                  color: Colors.primary,
                  fontFamily: fontExtraBold,
                }}>
                -{data.discount_rate}%{' '}
              </Text>
            )}
            <Text style={{ ...Typography.description }} numberOfLines={1} ellipsizeMode={'clip'}>
              {data.name}
            </Text>
          </View>
          <View>
            {data.is_discount ? (
              <Text style={{ ...Typography.option, textTransform: 'none' }}>
                {toPriceFormat(data.discount_price)}
              </Text>
            ) : (
              <Text style={{ ...Typography.option, textTransform: 'none' }}>
                {toPriceFormat(data.original_price)}
              </Text>
            )}
          </View>
        </View>
      </Ripple>
    </View>
  );
};

const styles = StyleSheet.create({
  productBoxContainer: {
    elevation: 0,
    zIndex: 0,

    width: (Spacing.screen.width - 16 * 3) / 2,
  },
  productHeartButtonContainer: {
    position: 'absolute',
    top: 8 - DEFAULT_IC_BTN_PADDING,
    right: 8 - DEFAULT_IC_BTN_PADDING,
    zIndex: 2,
  },
  productInformationContainer: {
    marginTop: 8,
    marginHorizontal: 6,
  },
  priceContainer: {
    marginTop: 4,
  },

});
export default React.memo(ProductBox);
