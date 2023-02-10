import { toast } from 'components/alert/toast';
import Button, { ButtonType, floatingButtonContainer } from 'components/button/Button';
import { GenericErrorView } from 'components/empty/EmptyView';
import { ConnectionDetection } from 'components/empty/OfflineView';
import { Header } from 'components/header/Header';
import ProductImage, { ProductImagePlaceholder } from 'components/images/ProductImage';
import { FeedbackList } from 'components/list/post/FeedbackList.v2';
import { isNil } from 'lodash';
import { ProductDetail } from 'model/product/product';
import { ProductSource } from 'model/product/ProductSource';
import { RelatedProductSourceType } from 'model/product/related.product';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, Linking, SafeAreaView, ScrollView, Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { Fade, Placeholder } from 'rn-placeholder';
import { ProductDetailProps, RoutePath } from 'routes';
import ProductInformationBox, {
  ProductInformationPlaceholder
} from 'scenes/product/component/ProductInformationBox';
import { Logger } from 'services/log';
import { Colors, Spacing, Typography } from 'styles';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { useGetPreviousRoute } from 'utils/hooks/useGetPreviousRoute';
import { getAffiliateLink, getProduct, getProductFeedback, productWatchedStream } from '_api';

const Screen = ({ route }: { route: { params: ProductDetailProps } }) => {

  const { productPk, } = route.params;
  const [affiliateLink, setAffiliateLink] = useState(route.params.affiliateLink)

  const previousRoute = useGetPreviousRoute();

  const {
    data: product,
    state,
    excecute,
  } = useAsync(() => {
    return getProduct(productPk,
      { is_search_result: previousRoute === RoutePath.searchRecommend });
  });

  useEffect(() => {
    if (state !== ConnectionState.hasData || isNil(product)) return;
    trackViewedProduct(product);
    productWatchedStream.next(product.pk);
  }, [state, product]);

  useEffect(() => {
    excecute();
    const getAffiliate = async () => {
      const { affiliate_link } = await getAffiliateLink(productPk)
      if (affiliate_link) {
        setAffiliateLink(affiliate_link)
      }
    }
    if (isNil(product?.affiliate_link)) {
      if (!affiliateLink) {
        getAffiliate()
      }
    }

  }, []);

  const child = useMemo(() => {
    if (state === ConnectionState.hasError) {
      return (
        <View style={{ height: Spacing.screen.height }}>
          <GenericErrorView
            action={{
              text: 'Thử lại',
              onPress: excecute,
            }}
          />
        </View>
      );
    }
    if (state === ConnectionState.hasData || state === ConnectionState.waiting && !isNil(product)) {
      return (
        <View>
          <ProductImage data={product} />
          <ProductInformationBox data={product} />
          {/* {user_type == UserType.SUPPORTER ?
                        <Text style={{ ...Typography.description, paddingLeft: 12 }}>[Supporter Only] Product Number
                            : {product.pk}</Text> : <></>} */}
          <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
            {product.is_feedback_exist ? (
              <Text style={Typography.subtitle}>Các bài viết có đánh giá</Text>
            ) : (
              <></>
            )}
          </View>
        </View>
      );
    }
    return <_Placeholder />
  }, [state, product]);

  const fetch = (next?: string) => {
    return getProductFeedback(next, {
      pk: productPk,
    });
  };
  const _renderLandingButton = () => {
    if (isNil(product)) return
    let iconSource, boxColor, text
    switch (product?.product_source) {
      case ProductSource.INSTAGRAM:
        iconSource = require('/assets/images/social/Insta/Instagram_W.png')
        boxColor = Colors.black
        text = 'Đến Instagram'
        break
      case ProductSource.SHOPEE:
        iconSource = require('/assets/images/social/Shopee/W.png')
        boxColor = Colors.black
        text = 'Đến Shopee'
        break
      default:
        iconSource = require('/assets/images/social/Homepage/Homepage_W.png')
        boxColor = Colors.black
        text = 'Mua hàng'
    }

    const _onPress = () => {
      Linking.openURL(affiliateLink ?? product.product_link);
    }

    return <View style={floatingButtonContainer().style}>
      <Ripple onPress={_onPress} style={{ backgroundColor: boxColor, flexDirection: 'row', height: 48, alignItems: 'center', justifyContent: 'center' }}>
        <Image
          width={24}
          height={24}
          style={{ width: 24, height: 24, marginRight: 8 }}
          source={iconSource}
        />
        <Text style={{ ...Typography.name_button, color: Colors.white, textTransform: 'uppercase' }}>{text}</Text>
      </Ripple>
    </View>
  }

  return (
    <View style={{ flex: 1 }}>
      <ConnectionDetection.View>
        <SafeAreaView>
          <Header title={product?.name ?? ''} />
        </SafeAreaView>
        {product?.is_feedback_exist ? <FeedbackList
          Header={child}
          fetch={fetch}
          renderAheadMultiply={1}
          showSpec
          renderEmpty={() => { return <></>; }}
        /> : <ScrollView>{child}</ScrollView>}
        <View style={{ height: floatingButtonContainer().height }}></View>
      </ConnectionDetection.View>
      {_renderLandingButton()}
    </View>
  );
};

const trackViewedProduct = (product: ProductDetail) => {
  let category;
  let subcategory;
  let storePk;
  try {
    category = product.category.name;
    subcategory = product.sub_category.name;
    storePk = product.store.pk;
  } catch {
    category = 'all';
    subcategory = 'all';
    storePk = null;
  }
  Logger.instance.logViewProduct({
    value: product.original_price,
    item: {
      item_brand: `${product.store.insta_id}`,
      item_id: `${product.pk}`,
      item_name: product.name,
      item_category: category,
      item_category2: subcategory,
    },
  });
};

const _Placeholder = () => {
  return (
    <Placeholder Animation={Fade}>
      <ProductImagePlaceholder />
      <ProductInformationPlaceholder />
    </Placeholder>
  );
};

export default React.memo(Screen);
