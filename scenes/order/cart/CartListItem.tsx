import { toast } from 'components/alert/toast';
import { isEmpty, isNil, last } from 'lodash';
import { CartProductOption } from 'model/product/product.options';
import React, { useContext, useMemo } from 'react';
import { Image, LayoutAnimation, StyleSheet, Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { ProductDetailParams, ProductDetailRouteSetting } from 'routes';
import { clearCartItem, partialAddToCart } from 'services/api/cart';
import { NavigationService } from 'services/navigation';
import { Colors, Typography } from 'styles';
import { fontExtraBold } from 'styles/typography';
import { toPriceFormat, unAwaited } from 'utils/helper';
import { CartContext } from './context';
import { CheckBox } from 'components/button/CheckBox';

export const OptionItem = ({ id, i }: { id: string; i: number }) => {
  const { option: options, selectedOption, setSelectedOption, index } = useContext(CartContext);
  const option = options[id] ?? {};

  const isLastItem = useMemo(() => {
    const [storeId, optionId] = id.split('.');
    const optionIds = index[storeId];
    if (isNil(optionIds)) return false;

    const lastOptionId = last(Object.keys(optionIds));

    return optionId === lastOptionId;
  }, [i, option]);

  const isOutOfStock = option.stock <= 0;

  const isSelected = !!selectedOption[id];

  const onSelect = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    selectedOption[id] = !isSelected;
    setSelectedOption({
      ...selectedOption,
    });
  };

  return (
    <View>
      <View style={styles.itemContainer}>
        <View style={{ paddingRight: 12, width: 36 }}>
          <CheckBox value={isSelected} toogle={onSelect} />
        </View>

        <View style={{ flex: 1, opacity: isOutOfStock ? 0.5 : 1 }}>
          <OptionMeta option={option} />
          <View style={{ height: 12 }} />
          <QuantityControlGroup disabled={isOutOfStock} id={id} />
        </View>
      </View>
      {isLastItem ? <SectionDivider /> : <ItemDivider />}
    </View>
  );
};

const OptionMeta = ({ option }: { option: CartProductOption }) => {
  const optionName = useMemo(() => {
    return [option.color, option.size, option.extra_option]
      .filter(val => !isEmpty(val))
      .join(' / ');
  }, [option]);
  const isOutOfStock = option.stock <= 0;
  const isExceedStock = option.stock < option.quantity;
  const onPress = () => {
    NavigationService.instance.navigate(
      new ProductDetailRouteSetting(new ProductDetailParams(option.product_pk)),
    );
  };

  return (
    <Ripple
      onPress={onPress}
      rippleContainerBorderRadius={4}
      style={{ flexDirection: 'row', flex: 1 }}>
      <Image
        source={{ uri: option.product_thumbnail_image }}
        style={{
          height: 96,
          width: 77,
          borderRadius: 8,
          backgroundColor: Colors.background,
        }}
      />
      <View style={{ width: 12 }} />
      <View style={{ flex: 1 }}>
        <Text style={[Typography.option, { flexWrap: 'wrap' }]} numberOfLines={1}>
          {option.name}
        </Text>
        <Text numberOfLines={2} style={[Typography.body, { color: Colors.text }]}>
          {optionName}
        </Text>
        {(isOutOfStock || isExceedStock) && (
          <Text style={[Typography.option, { color: Colors.primary }]}>
            {isOutOfStock ? 'Hết hàng' : isExceedStock ? `Còn lại ${option.stock} sản phẩm` : ''}
          </Text>
        )}
      </View>
    </Ripple>
  );
};

const QuantityControlGroup = ({ id, disabled }: { id: string; disabled: boolean }) => {
  const { option: options, setOptions } = useContext(CartContext);
  const option = options[id] ?? {};
  const optionId = useMemo(() => {
    const [_, optionId] = id.split('.');

    return optionId.replace('$', '');
  }, []);

  const add = () => {
    if (option.stock <= option.quantity) {
      toast('Bạn đã chọn vượt quá số lượng sản phẩm'); //Maximum Quantity

      return;
    }

    option.quantity = option.quantity + 1;
    unAwaited(partialAddToCart(Number.parseInt(optionId, 10), 1));
    setOptions({
      ...options,
    });
  };

  const subtract = () => {
    if (option.quantity <= 1) {
      toast('Số lượng sản phẩm phải lớn hơn 0'); // Minimum Quantity

      return;
    }
    option.quantity = option.quantity - 1;

    unAwaited(clearCartItem(optionId).catch(_ => { }));
    setOptions({
      ...options,
    });
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Ripple
        disabled={disabled}
        onPress={subtract}
        style={{ width: 24, height: 24 }}
        rippleContainerBorderRadius={12}>
        <Image source={require('/assets/images/icon/minus.png')} />
      </Ripple>
      <View style={{ width: 28, alignItems: 'center' }}>
        <Text>{option.quantity}</Text>
      </View>
      <Ripple
        disabled={disabled}
        onPress={add}
        style={{ width: 24, height: 24 }}
        rippleContainerBorderRadius={12}>
        <Image source={require('/assets/images/icon/plus.png')} />
      </Ripple>
      <PricePanel option={option} />
      <View style={{ flex: 1 }} />
    </View>
  );
};

const PricePanel = ({ option }: { option: CartProductOption }) => {
  return (
    <View style={{ position: 'absolute', right: 0, bottom: 0, alignItems: 'flex-end' }}>
      {option.discount_price > 0 && (
        <Text
          style={[
            Typography.description,
            { color: Colors.icon, textDecorationLine: 'line-through' },
          ]}>{`${toPriceFormat(option.original_price)}`}</Text>
      )}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {option.discount_rate > 0 && (
          <>
            <Text
              style={[
                Typography.option,
                { color: Colors.primary, fontFamily: fontExtraBold },
              ]}>{`-${option.discount_rate}%`}</Text>
            <View style={{ width: 4 }} />
          </>
        )}
        <Text style={Typography.body}>{toPriceFormat(option.finalPrice)}</Text>
      </View>
    </View>
  );
};

const SectionDivider = () => {
  return <View style={{ height: 4, backgroundColor: Colors.line }} />;
};

const ItemDivider = () => {
  return <View style={{ marginLeft: 52, height: 1, backgroundColor: Colors.line }} />;
};

export const OptionItemPlaceholder = (props: { key: string }) => {
  return (
    <View>
      <View style={styles.itemContainer}>
        <View style={{ paddingRight: 12, width: 36 }}>
          <CheckBox color={Colors.background} value={false} toogle={() => { }} />
        </View>

        <View style={{ flex: 1 }}>
          <OptionMetadataPlaceholder />
          <View style={{ height: 12 }} />
          <QuantityControlGroupPlaceholder />
        </View>
      </View>
      <ItemDivider />
    </View>
  );
};

const OptionMetadataPlaceholder = () => {
  return (
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <PlaceholderMedia
        style={{
          height: 96,
          width: 77,
          borderRadius: 8,
          backgroundColor: Colors.surface.white,
        }}
      />
      <View style={{ width: 12 }} />
      <View style={{ flex: 1 }}>
        <PlaceholderLine
          noMargin
          height={16}
          style={{ width: '80%', backgroundColor: Colors.surface.white }}
        />
        <View style={{ height: 4 }} />
        <PlaceholderLine
          noMargin
          height={16}
          style={{ width: '60%', backgroundColor: Colors.surface.white }}
        />
        <View style={{ height: 4 }} />
        <PlaceholderLine
          noMargin
          height={16}
          style={{ width: '40%', backgroundColor: Colors.surface.white }}
        />
      </View>
    </View>
  );
};

const QuantityControlGroupPlaceholder = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <PlaceholderMedia
        style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.surface.white }}
      />
      <View style={{ width: 28, alignItems: 'center' }} />
      <PlaceholderMedia
        style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.surface.white }}
      />
      <View style={{ flex: 1 }} />
      <PlaceholderLine
        noMargin
        height={16}
        style={{ width: 80, backgroundColor: Colors.surface.white }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    height: 156,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
  },
});
