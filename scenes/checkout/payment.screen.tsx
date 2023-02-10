import DabiFont from 'assets/icons/dabi.fonts';
import Button, { ButtonType } from 'components/button/Button';
import { first, isNil } from 'lodash';
import { IStoreMinifiedInfo } from 'model';
import { PaymentMethod } from 'model/checkout/checkout';
import { IShippingOptions, ISubCartSummary } from 'model/checkout/type';
import React, { useContext, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Ripple from 'react-native-material-ripple';
import { VoucherScreenRouteSetting } from 'routes/voucher/voucher.route';
import { useNavigator } from 'services/navigation/navigation.service';
import { Colors, Typography } from 'styles';
import { toPriceFormat } from 'utils/helper/FormatHelper';
import { SubtotalDetail } from './component/subtotal.detail';
import { SUMMARY_VIEW_HEIGHT } from './component/summary.view';
import { CheckoutContext, ShippingOptionContext } from './context';
import { useCouponSetter, useGetSubcartTotal, useShippingOptionGetter } from './helper.hook';
import { SubcartHeader } from './subcart.item';

export const PaymentScreen = () => {
  const { paymentMethods, checkoutSubcart, coupon } = useContext(CheckoutContext);
  const codPayment = first<PaymentMethod>(paymentMethods);
  const navigator = useNavigator();

  const setCoupon = useCouponSetter();

  const onSelectVoucher = () => {
    const subcartSum = checkoutSubcart.map((subcart) => subcart.summary);
    navigator.navigate(
      new VoucherScreenRouteSetting({
        selectedCoupon: coupon,
        setCoupon,
        subcartSummary: subcartSum,
      }),
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <Text style={[Typography.h1, { textAlign: 'center', paddingBottom: 14 }]}>
          Phương thức thanh toán
        </Text>
        {!isNil(codPayment) && (
          <View style={{ width: '100%', height: 106, flexDirection: 'row', paddingHorizontal: 16 }}>
            <PaymentItem item={codPayment} />
            <View style={{ width: 16 }} />
            <View style={{ flex: 1 }} />
          </View>
        )}
        <View style={{ height: 24 }} />

        <View style={{ height: 80, paddingHorizontal: 16 }}>
          <Text style={Typography.option}>Bạn có mã khuyến mãi không?</Text>
          <View style={{ height: 12 }} />
          <View style={{ height: 28 }}>
            <Button
              text={'Chọn mã khuyến mãi'}
              type={ButtonType.outlined}
              onPress={onSelectVoucher}
            />
          </View>
        </View>
        <View style={{ height: 24 }} />
        <Text style={[Typography.option, { marginLeft: 16 }]}>Tổng tiền cần thanh toán</Text>
        <View style={{ height: 12 }} />
        <StoreSubTotalView />
        <View style={{ height: SUMMARY_VIEW_HEIGHT }} />
      </ScrollView>
    </View>
  );
};

export const PaymentItem = ({
  item,
  displayAxis = 'vertical',
}: {
  item: PaymentMethod;
  displayAxis?: 'vertical' | 'horizontal';
}) => {
  const { setSelectedPayment, selectedPayment } = useContext(CheckoutContext);
  const isSelected = selectedPayment === item.pk;

  const onSelect = () => {
    setSelectedPayment(item.pk);
  };

  const textColor = isSelected ? Colors.white : Colors.text;

  return (
    <Ripple
      onPress={onSelect}
      rippleContainerBorderRadius={4}
      style={{
        flex: 1,
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: isSelected ? 'transparent' : Colors.background,
      }}>
      {isSelected && (
        <LinearGradient
          colors={Colors.gradient.purple}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex: 1 }}
        />
      )}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          padding: 12,
          ...(displayAxis === 'horizontal' ? { flexDirection: 'row', alignItems: 'center' } : {}),
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <DabiFont color={textColor} name={'cod'} size={16} />
          <View style={{ width: 4 }} />
          <Text style={[Typography.title, { color: textColor }]}>{item.name}</Text>
        </View>
        <View style={{ flex: 1 }} />
        <Text style={[Typography.description, { color: textColor }]}>{item.display_name}</Text>
      </View>
    </Ripple>
  );
};
interface StoreSubCart {
  store: IStoreMinifiedInfo;
  summary: ISubCartSummary;
  shipping?: IShippingOptions;
}

const StoreSubTotalView = () => {
  const { checkoutSubcart, optionMap, coupon } = useContext(CheckoutContext);

  const { optionMap: shippingOption } = useContext(ShippingOptionContext);
  const [activeSections, setActiveSections] = useState<number[]>([0, 1]);

  const getShippingOption = useShippingOptionGetter();

  const data = useMemo<StoreSubCart[]>(() => {
    return checkoutSubcart.map((subcart) => {
      const shipping = getShippingOption(subcart.store.pk);

      return {
        store: subcart.store,
        summary: subcart.summary,
        shipping,
      };
    });
  }, [checkoutSubcart]);

  // subcart select
  const _renderHeader = (session: StoreSubCart, index: number, isActive: boolean) => {
    return <_Header storeSubCart={session} isActive={isActive} />;
  };

  const _renderContent = (session: StoreSubCart) => {
    const { store } = session;
    const storePk = store.pk;

    return (
      <View style={{ paddingHorizontal: 16 }}>
        <SubtotalDetail storePk={storePk} />
        <View style={{ height: 12 }} />
      </View>
    );
  };

  return (
    <Accordion
      expandMultiple
      sections={data}
      activeSections={activeSections}
      // @ts-expect-error
      touchableComponent={TouchableWithoutFeedback}
      // renderSectionTitle={_renderSectionTitle}
      renderHeader={_renderHeader}
      renderContent={_renderContent}
      onChange={setActiveSections}
    />
  );
};

const styles = StyleSheet.create({
  priceLine: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 },
});

const _Header = ({ storeSubCart, isActive }: { storeSubCart: StoreSubCart; isActive: boolean }) => {
  const { store } = storeSubCart;
  const { total } = useGetSubcartTotal(store.pk);
  const renderTrailing = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={Typography.description}>Tổng cộng </Text>

      <Text style={[Typography.name_button, { color: Colors.primary, textTransform: 'none' }]}>{toPriceFormat(total)}</Text>
    </View>
  );

  return <SubcartHeader focused={isActive} store={store} renderTrailing={renderTrailing} />;
};
