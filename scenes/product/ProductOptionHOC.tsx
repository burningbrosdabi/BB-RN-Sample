import { CartModal } from 'scenes/checkout/Cart/CartModal';
import { HandledError } from 'error';
import { isEmpty, isNil } from 'lodash';
import { ProductDetail } from 'model/product/product';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthRouteSetting, ProductDetailParams, ProductDetailRouteSetting } from 'routes';
import { ProductCategoryFilterRouteSetting } from 'routes/product/productCategoryFilter.route';
import { getProductOptions, getProductOptionsV2, OptionsMap, StockData } from 'services/api/cart';
import { Logger, ShowProductOptionEvent } from 'services/log';
import NavigationService from 'services/navigation/navigation.service';
import { Colors, Typography } from 'styles';
import { unAwaited } from 'utils/helper';
import { useActions } from 'utils/hooks/useActions';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { Button, ButtonState, ButtonType, LayoutConstraint } from 'components/button/Button';
import { useNetInfo } from '@react-native-community/netinfo';
import Clipboard from '@react-native-community/clipboard';
import { toast } from 'components/alert/toast';
import { linkService } from 'services/link/link.service';
import { storeKey } from 'utils/constant';
import { ToolTip } from 'components/tooltip';
import { screen } from 'styles/spacing';
import { contactWithShop } from '_helper';
import { ProductSource } from 'model/product/ProductSource';
import { DabiFont } from '_icons';
import { setLoading } from 'utils/state/action-creators';
import { defaultShare } from 'utils/hooks/useShare';

const isPurchasable = (product_source: ProductSource) =>
  [ProductSource.PARTNERSHIP, ProductSource.KOREA].includes(product_source);

export const ProductOptionHOC = ({
  product,
  children,
}: {
  product: ProductDetail | null;
  children: JSX.Element;
}) => {
  if (!product) return children;

  const [cartVisibled, setCartVisbled] = useState<boolean>(false);
  const { isLoggedIn } = useTypedSelector(state => state.auth);
  const { showDialog } = useActions();

  const validateEmptyOption = ([{ color, extra_option, size }]: [
    OptionsMap,
    StockData,
  ]): boolean => {
    const hasEmptyOption = isEmpty(color) && isEmpty(extra_option) && isEmpty(size);
    if (hasEmptyOption) {
      new HandledError({
        error: new Error(`Product id ${product.pk} has empty option.`),
        stack: 'CartOption.validateEmptyOption',
      }).log(true);
    }

    return hasEmptyOption;
  };

  const { state, data, excecute } = useAsync(
    () => {
      return getProductOptionsV2(product.pk);
    },
    {
      emptyDataLogical: validateEmptyOption,
    },
  );

  useEffect(() => {
    if (isPurchasable(product?.product_source)) {
      unAwaited(excecute());
    }
  }, [product]);

  // const { setCategoryFilter } = useActions();
  useEffect(() => {
    if (cartVisibled) {
      Logger.instance.logShowProductOption(new ShowProductOptionEvent(product?.pk));
    }
  }, [cartVisibled]);

  const setCategory = () => {
    if (product) {
      const routeSetting = new ProductCategoryFilterRouteSetting({
        subCategory: product.sub_category.name,
        category: product.category.name,
      });
      NavigationService.instance.navigate(routeSetting);
    }
  };

  const toogleCartModal = () => {
    if (!isLoggedIn) {
      showDialog({
        title: 'Bạn cần đăng nhập\nđể sử dụng chức năng này.',

        actions: [
          {
            type: ButtonType.primary,
            text: 'Đăng nhập',
            onPress: () => {
              NavigationService.instance.navigate(new AuthRouteSetting());
            },
          },
          {
            text: 'Bỏ qua',
            type: ButtonType.flat,
            onPress: () => { },
            textStyle: { color: Colors.primary },
          },
        ],
      });

      return;
    }
    setCartVisbled(!cartVisibled);
  };

  const netInfo = useNetInfo();

  return (
    <View style={{ flex: 1 }}>
      {children}
      {!isNil(product) && (
        <>
          {netInfo.isInternetReachable && (
            <Action state={state} data={data} toogleModal={toogleCartModal} product={product} />
          )}
          <CartModal
            data={data}
            refresh={excecute}
            connectionState={state}
            visible={cartVisibled}
            onClose={toogleCartModal}
            setCategory={setCategory}
            productData={product}
          />
        </>
      )}
    </View>
  );
};

const Action = ({
  product,
  state,
  data,
  toogleModal,
}: {
  data: [OptionsMap, StockData] | null;
  state: ConnectionState;
  product: ProductDetail;
  toogleModal: () => void;
}) => {
  const purchasable = isPurchasable(product?.product_source);
  const {
    store: { facebook_numeric_id },
    name,
    thumbnail_image,
    original_thumbnail_image,
    description,
    product_link,
    pk,
  } = product;

  const onPressPurchase = async () => {
    const path = new ProductDetailRouteSetting().toURLPath(new ProductDetailParams(pk));
    const link = await linkService().buildLink({
      path,
      social: {
        imageUrl: original_thumbnail_image,
        descriptionText: name,
        title: 'Mình tìm thấy sản phẩm này trên ứng dụng Dabi.',
      },
    });

    toast('Thông tin sản phẩm đã được sao chép.');
    Clipboard.setString(link);

    const contact = await contactWithShop(facebook_numeric_id);

    setTimeout(() => {
      contact();
    }, 800);

    Logger.instance.logWillingToBuy({
      value: product?.original_price || 0,
      item: {
        item_brand: product?.store?.insta_id ?? '',
        item_id: `${product?.pk}`,
        item_category: product?.category?.name ?? '',
        item_category2: product?.sub_category?.name ?? '',
      },
    });
  };

  const onPressShare = async () => {
    try {
      setLoading(true);

      if (isNil(product)) {
        return;
      }
      const path = new ProductDetailRouteSetting().toURLPath(new ProductDetailParams(product.pk));
      const link = await linkService().buildLink({
        path,
        social: {
          imageUrl: product.original_thumbnail_image,
          descriptionText: product.description,
          title: product.name,
        },
      });
      defaultShare({
        title: product.name,
        message: link,
      });
    } catch (e) {
      toast('Không thể chia sẻ bài viết');
    } finally {
      setLoading(false);
    }
  };

  const shareButtonWidth = 42;
  const paddingBetween = 20;

  return (
    <View style={styles.actionContainer}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <TouchableOpacity
          style={{
            width: shareButtonWidth,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={onPressShare}>
          <DabiFont name={"share-1"} />
          <Text style={Typography.description}>Chia sẻ</Text>
        </TouchableOpacity>
        <View style={{ width: paddingBetween }} />
        <ToolTip
          cacheKey={storeKey.purchaseButtonTooltip}
          text={'Sau khi bấm "Mua hàng", hãy dán đường link đã được sao chép tự động bạn nha!'}
          placement={'top'}>
          <View
            style={{
              width: screen.width - 16 * 2 - paddingBetween - shareButtonWidth,
              height: 48,
            }}>
            {purchasable ? (
              <CartActionGroup
                onOpenCart={() => {
                  toogleModal();
                }}
                state={state}
                optionData={data}
              />
            ) : (
              <Button
                constraint={LayoutConstraint.matchParent}
                text={'Mua hàng'}
                type={ButtonType.primary}
                // onPress={onPressPurchase}
                onPress={onPressPurchase}
              />
            )}
          </View>
        </ToolTip>
      </View>
    </View>
  );
};

const CartActionGroup = ({
  optionData,
  state,
  onOpenCart,
}: {
  optionData: [OptionsMap, StockData] | null;
  state: ConnectionState;
  onOpenCart: () => void;
}) => {
  const outOfStock = useMemo(() => {
    if (state !== ConnectionState.hasData || isNil(optionData)) return false;

    const [_, data] = optionData;

    return (
      Object.values(data).reduce((prev, curr) => {
        return prev + curr.stock;
      }, 0) <= 0
    );
  }, [optionData, state]);

  if (state === ConnectionState.none || state === ConnectionState.waiting) {
    return (
      <Button
        disabled
        state={ButtonState.loading}
        constraint={LayoutConstraint.matchParent}
        text={'Sản phẩm đã hết hàng'}
        type={ButtonType.primary}
        // onPress={onPressPurchase}
        onPress={() => { }}
      />
    );
  }

  return (
    <>
      {!outOfStock ? (
        <>
          <Button
            constraint={LayoutConstraint.matchParent}
            text={'Giỏ hàng'}
            onPress={onOpenCart}
          />
        </>
      ) : (
        <Button
          disabled
          state={ButtonState.disabled}
          constraint={LayoutConstraint.matchParent}
          text={'Sản phẩm đã hết hàng'}
          type={ButtonType.primary}
          // onPress={onPressPurchase}
          onPress={() => { }}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  actionContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 10,
    paddingTop: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
  },
});
