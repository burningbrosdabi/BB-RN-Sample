import ArrowUpDown from 'components/animation/Icon/ArrowUpDown';
import { Button, ButtonState, ButtonType } from 'components/button/Button';
import { get, isEmpty, isNil } from 'lodash';
import type { IShippingOptions, ISubCartSummary, SubcartOption } from 'model/checkout/type';
import { CartProductOption } from 'model/product/product.options';
import { IStoreMinifiedInfo } from 'model/store/store';
import moment from 'moment';
import 'moment/locale/vi';
import React, { useContext, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';
import { PlaceholderLine } from 'rn-placeholder/lib/PlaceholderLine';
import { PlaceholderMedia } from 'rn-placeholder/lib/PlaceholderMedia';
import { Colors, Typography } from 'styles';
import { fontExtraBold } from 'styles/typography';
import { toPriceFormat } from 'utils/helper/FormatHelper';
import { SubtotalDetail, SubtotalDetailPlaceholer } from './component/subtotal.detail';
import { OrderListMode } from './component/type.d';
import { CheckoutContext, ShippingOptionContext } from './context';
import { useGetSubcartTotal, useShippingOptionGetter } from './helper.hook';

moment.locale('vi');

export const SubcartHeader = ({
  store,
  focused,
  renderTrailing = () => <></>,
}: {
  store: IStoreMinifiedInfo;
  focused: boolean;
  renderTrailing?: () => JSX.Element;
}) => {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: store.profile_image }} />
      <View style={{ width: 12 }} />
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={Typography.name_button}>
          {store.insta_id}
        </Text>
      </View>

      <View style={{ width: 16 }} />
      {!isNil(renderTrailing) && renderTrailing()}
      <View style={{ width: 4 }} />
      <ArrowUpDown value={focused ? 1 : 0} />
    </View>
  );
};

export const SubcartHeaderPlaceholder = () => {
  return (
    <View style={styles.container}>
      <PlaceholderMedia style={[styles.image, { backgroundColor: Colors.surface.white }]} />
      <View style={{ width: 12 }} />
      <PlaceholderLine
        noMargin
        style={{ width: 120, height: 16, backgroundColor: Colors.surface.white }}
      />
      <View style={{ flex: 1 }} />
      <PlaceholderLine
        noMargin
        style={{ width: 60, height: 16, backgroundColor: Colors.surface.white }}
      />
      <View style={{ width: 4 }} />
    </View>
  );
};

export const SubcartFooter = ({
  mode,
  pk,
  summary,
}: {
  pk: number;
  summary: ISubCartSummary;
  mode: OrderListMode;
}) => {
  const { optionMap: shippingOptions, showModal } = useContext(ShippingOptionContext);

  const { optionMap } = useContext(CheckoutContext);

  const getShippingOption = useShippingOptionGetter();

  const shippingOption = useMemo<IShippingOptions | undefined>(() => {
    return getShippingOption(pk);
  }, [shippingOptions, optionMap, pk]);

  const _showModal = () => {
    showModal(pk);
  };

  const { total } = useGetSubcartTotal(pk);

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <View style={styles.content}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          <Text style={Typography.description}>Tổng tiền</Text>
          <View style={{ width: 4 }} />
          <Text style={[Typography.name_button, { color: Colors.primary, textTransform: 'none' }]}>
            {toPriceFormat(total)}
          </Text>
        </View>
        <SubtotalDetail storePk={pk} />
        <View style={{ height: 12 }} />
        <View style={{ height: 48 }}>
          <Button
            disabled={mode === OrderListMode.overview}
            state={ButtonState.focused}
            text={shippingOption?.name ?? ''}
            type={ButtonType.option}
            onPress={_showModal}
            alignItems={'flex-start'}
            postfixIcon={mode === OrderListMode.compose ? 'small_arrow_right' : undefined}
            iconColor={Colors.primary}
          />
        </View>
        <View style={{ height: 8 }} />
        <Text style={[Typography.description, { color: Colors.primary }]}>{`Ngày giao: ${moment(
          shippingOption?.lead_time,
        ).format('DD-MMMM')}`}</Text>
        <View style={{ height: 12 }} />
        <MessageBox editable={mode === OrderListMode.compose} pk={pk} />
      </View>
    </View>
  );
};

export const SubcartFooterPlaceholder = () => {
  return (
    <View style={{ paddingHorizontal: 16 }}>
      <View style={styles.content}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          <PlaceholderLine
            noMargin
            style={{ width: 80, height: 16, backgroundColor: Colors.surface.white }}
          />
        </View>
        <SubtotalDetailPlaceholer />
        <View style={{ height: 12 }} />
        <PlaceholderMedia
          style={{
            height: 48,
            width: '100%',
            borderRadius: 4,
            backgroundColor: Colors.surface.white,
          }}
        />
        <View style={{ height: 8 }} />
        <PlaceholderLine
          noMargin
          style={{ width: 120, height: 16, backgroundColor: Colors.surface.white }}
        />
        <View style={{ height: 12 }} />
        <PlaceholderMedia
          style={{
            width: '100%',
            height: 62,
            borderRadius: 4,
            backgroundColor: Colors.surface.white,
          }}
        />
      </View>
    </View>
  );
};

const MessageBox = ({ pk, editable = false }: { pk: number; editable: boolean }) => {
  const [text, setText] = useState('');
  const { setMessage, optionMap } = useContext(CheckoutContext);

  const message = useMemo(() => {
    const option = get(optionMap, `[${pk}]`) as SubcartOption | undefined;
    return option?.message_from_customer ?? '';
  }, [optionMap]);

  const onBlur = () => {
    setMessage(pk, text);
  };
  const onChange = (text: string) => {
    setText(text);
  };

  const ContainerStyle: ViewStyle = (() => {
    if (editable) {
      return {
        backgroundColor: Colors.background,
        paddingHorizontal: 12,
        paddingBottom: 12,
      };
    }
    return {
      backgroundColor: 'transparent',
      borderTopWidth: 1,
      borderColor: Colors.background,
      paddingHorizontal: 0,
    };
  })();

  return (
    <View
      style={[
        {
          borderRadius: 4,
          paddingTop: 12,
        },
        ContainerStyle,
      ]}>
      <Text style={Typography.description}>Tin nhắn lưu ý người bán</Text>
      {editable ? (
        <TextInput
          style={[Typography.body, { padding: 0, maxHeight: 90 }]}
          placeholder={'Soạn tin nhắn của bạn'}
          onChangeText={onChange}
          onBlur={onBlur}
          // multiline
          maxLength={320}
        />
      ) : (
        <Text style={Typography.title}>{message}</Text>
      )}
    </View>
  );
};

export const SubcartOptions = ({ items }: { items: CartProductOption[] }) => {
  const renderItem = (item: CartProductOption, index: number) => {
    const optionName = [item.color, item.size, item.extra_option]
      .filter(opt => !isEmpty(opt))
      .join(' / ');
    return (
      <View key={`${index}`} style={styles.itemContainer}>
        <Image
          source={{ uri: item.product_thumbnail_image }}
          style={{
            width: 74,
            height: '100%',
            backgroundColor: Colors.background,
            borderRadius: 4,
          }}
        />
        <View style={{ width: 12 }} />
        <View style={{ flex: 1, paddingVertical: 4 }}>
          <Text style={Typography.name_button} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={Typography.body}>{optionName}</Text>

          <View style={{ position: 'absolute', bottom: 0, left: 0 }}>
            <Text>SL: {item.quantity}</Text>
          </View>
          <View style={{ position: 'absolute', bottom: 0, right: 0, alignItems: 'flex-end' }}>
            {item?.discount_price > 0 && (
              <Text
                style={[
                  Typography.description,
                  { color: Colors.text, textDecorationLine: 'line-through' },
                ]}>
                {toPriceFormat(item.original_price)}
              </Text>
            )}
            <View
              style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
              {item?.discount_rate > 0 && (
                <Text
                  style={[
                    Typography.description,
                    { color: Colors.primary, fontFamily: fontExtraBold, lineHeight: 21 },
                  ]}>{`-${item.discount_rate}%`}</Text>
              )}
              <View style={{ width: 4 }} />
              <Text style={Typography.body}>{toPriceFormat(item.finalPrice)}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return <>{items.map(renderItem)}</>;
};

export const SubcartOptionsPlaceholder = () => {
  return (
    <View style={styles.itemContainer}>
      <PlaceholderMedia style={[styles.productImage, { backgroundColor: Colors.surface.white }]} />
      <View style={{ width: 12 }} />
      <View style={{ flex: 1, paddingVertical: 4 }}>
        <PlaceholderLine
          noMargin
          style={{ width: '100%', height: 16, backgroundColor: Colors.surface.white }}
        />
        <View style={{ height: 4 }} />
        <PlaceholderLine
          noMargin
          style={{ width: 140, height: 16, backgroundColor: Colors.surface.white }}
        />

        <View style={{ position: 'absolute', bottom: 0, left: 0 }}>
          <PlaceholderLine
            noMargin
            style={{ width: 40, height: 16, backgroundColor: Colors.surface.white }}
          />
        </View>
        <View style={{ position: 'absolute', bottom: 0, right: 0, alignItems: 'flex-end' }}>
          <PlaceholderLine
            noMargin
            style={{ width: 40, height: 16, backgroundColor: Colors.surface.white }}
          />
          <View style={{ height: 4 }} />
          <PlaceholderLine
            noMargin
            style={{ width: 80, height: 16, backgroundColor: Colors.surface.white }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
    backgroundColor: Colors.background,
    borderRadius: 20,
  },
  content: { borderTopWidth: 1, borderColor: Colors.background, paddingVertical: 12 },
  subtotalText: {
    paddingTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  container: {
    flexDirection: 'row',
    height: 64,
    alignItems: 'center',
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: Colors.background,
  },
  itemContainer: {
    flexDirection: 'row',
    height: 116,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  productImage: {
    width: 74,
    height: '100%',
    backgroundColor: Colors.background,
    borderRadius: 4,
  },
});
