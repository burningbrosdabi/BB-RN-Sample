
import { FirebaseAnalyticsTypes } from '@react-native-firebase/analytics';
import { Link } from 'components/button/Link';
import { HandledError } from 'error';
import { isEmpty, isNil } from 'lodash';
import { CheckoutSubcart, PaymentMethod } from 'model/checkout/checkout';
import { IRecipient } from 'model/recipient/recipient';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Fade } from 'rn-placeholder/lib/animations/Fade';
import { Placeholder } from 'rn-placeholder/lib/Placeholder';
import { PlaceholderLine } from 'rn-placeholder/lib/PlaceholderLine';
import { RecipientRouteSetting } from 'routes/recipient/recipient.route';
import RecipientItem from 'scenes/profile/recipients/RecipientItem';
import { Logger } from 'services/log';
import { useNavigator } from 'services/navigation/navigation.service';
import { applyFakeOpacity, Colors, Typography } from 'styles';
import { ConnectionState } from 'utils/hooks/useAsync';
import { useGetProvinces } from 'utils/hooks/useGetProvinces';
import { CheckoutContext } from '../context';
import { PaymentItem } from '../payment.screen';
import {
  SubcartFooter,
  SubcartFooterPlaceholder,
  SubcartHeader,
  SubcartHeaderPlaceholder,
  SubcartOptions,
  SubcartOptionsPlaceholder
} from '../subcart.item';
import { SUMMARY_VIEW_HEIGHT } from './summary.view';
import { OrderListMode } from './type.d';

export const OrderList = ({ mode = OrderListMode.compose }: { mode?: OrderListMode }) => {
  const { checkoutSubcart: data, summary, selectedPayment, paymentMethods } = useContext(CheckoutContext);

  useEffect(() => {
    if (mode == OrderListMode.overview) {
      const paymentMethod = paymentMethods.find(res => res.pk == selectedPayment)
      const items: FirebaseAnalyticsTypes.Item[] = [];
      data.forEach(subcart => {
        subcart.items.forEach(subcartItem => {
          items.push({
            item_category: "Dabi",
            item_brand: subcart?.store.insta_id || '',
            item_id: (subcartItem?.product_pk + '') || '',
            item_name: subcartItem?.name || '',
            item_variant: `${subcartItem.color}.${subcartItem.size}.${subcartItem.extra_option}`,
            quantity: subcartItem.quantity || 0,
            item_location_id: '',
          })
        });
      });
      const logParams = {
        value: summary.total || 0,
        items: items,
        payment_type: paymentMethod?.name || '',
      }
      Logger.instance.logAddPaymentInfo(logParams);
    }
  }, []);

  const _updateSections = (activeSections: number[]) => {
    SetActiveSections(activeSections);
  };
  const [activeSections, SetActiveSections] = useState(data.map((_, index) => index));

  const _renderContent = (subcart: CheckoutSubcart) => {
    return <SubcartOptions items={subcart.items} />;
  };

  const _renderHeader = (subcart: CheckoutSubcart, index: number, isActive: boolean) => {
    const renderTrailing = () => (
      <Text style={Typography.description}>{`${subcart.summary.total_item} sản phẩm`}</Text>
    );

    return (
      <SubcartHeader focused={isActive} store={subcart.store} renderTrailing={renderTrailing} />
    );
  };

  const renderFooter = (subcart: CheckoutSubcart) => {
    return <SubcartFooter mode={mode} pk={subcart.store.pk} summary={subcart.summary} />;
  };

  return (
    <KeyboardAwareScrollView extraHeight={16}>
      {isEmpty(data) ? (
        <></>
      ) : (
        <View>
          <Text style={[Typography.h1, { textAlign: 'center', paddingBottom: 14 }]}>
            Thông tin đơn hàng
          </Text>
          {mode === OrderListMode.compose ? (
            <RecipientComposerHeader />
          ) : (
            <PaymentRecipientHeader />
          )}
          <View style={{ height: 12 }} />
          <View style={{ height: 4, backgroundColor: Colors.background }} />
          <Accordion
            expandMultiple
            sections={data}
            activeSections={activeSections}
            // @ts-expect-error
            touchableComponent={TouchableWithoutFeedback}
            // renderSectionTitle={_renderSectionTitle}
            renderHeader={_renderHeader}
            renderContent={_renderContent}
            onChange={_updateSections}
            renderFooter={renderFooter}
          />
        </View>
      )}

      <View style={{ height: SUMMARY_VIEW_HEIGHT }} />
    </KeyboardAwareScrollView>
  );
};

const RecipientComposerHeader = () => {
  const { recipient, setRecipient } = useContext(CheckoutContext);
  const navigator = useNavigator();

  const { state, error } = useGetProvinces();

  const _setRecipient = (data: IRecipient) => {
    setRecipient(data);
    navigator.goBack();
  };

  const onNavigateRecipientList = () => {
    navigator.navigate(new RecipientRouteSetting({ onSelectItem: _setRecipient }));
  };

  useEffect(() => {
    if (!error) return;
    new HandledError({
      error: new Error('Failed to get provinces'),
      stack: 'RecipientComposerHeader.useEffect',
    }).log(true);
  }, [error]);

  return (
    <>
      {!isNil(recipient) && (
        <>
          <View style={{ alignItems: 'center' }}>
            <RecipientItem canEdit={false} data={recipient} />
          </View>
          {state !== ConnectionState.hasError && (
            <View style={{ alignItems: 'flex-end', paddingHorizontal: 8 }}>
              <Link text={'Thay đổi địa chỉ'} onPress={onNavigateRecipientList} />
            </View>
          )}
        </>
      )}
    </>
  );
};

const PaymentRecipientHeader = () => {
  const { recipient, selectedPayment, paymentMethods } = useContext(CheckoutContext);

  const payment = useMemo(() => {
    return (
      paymentMethods.find((payment) => payment.pk === selectedPayment) ??
      ({
        pk: 1,
        name: 'cod',
        display_name: 'Thanh toán khi nhận hàng',
      } as PaymentMethod)
    );
  }, [selectedPayment, paymentMethods]);

  if (!recipient) return <></>;
  const {
    recipient_name,
    contact_number,
    additional_address,
    ward,
    district,
    province,
  } = recipient;

  return (
    <View>
      <View style={styles.warningBar}>
        <Text style={[Typography.description, { color: '#83B6EF', textAlign: 'center' }]}>
          Vui lòng kiểm tra thông tin nhận hàng thật chính xác, để có thể đảm bảo nhận được hàng
          đúng thời hạn.
        </Text>
      </View>
      <View style={{ height: 72, marginTop: 12, paddingHorizontal: 16 }}>
        <PaymentItem displayAxis={'horizontal'} item={payment} />
      </View>

      <View style={styles.recipientLine}>
        <Text style={Typography.description}>{'Người nhận'}</Text>
        <Text style={Typography.title}>{recipient_name}</Text>
      </View>
      <View style={styles.recipientLine}>
        <Text style={Typography.description}>{'Số điện thoại'}</Text>
        <Text style={Typography.title}>{contact_number}</Text>
      </View>
      <View style={styles.recipientLine}>
        <Text style={Typography.description}>{'Địa chỉ'}</Text>
        <Text
          style={
            Typography.title
          }>{`${additional_address}, ${ward}, ${district}, ${province}.`}</Text>
      </View>
    </View>
  );
};

const RecipientItemPlaceholder = () => {
  return (
    <View
      style={{
        paddingHorizontal: 16,
        width: '100%',
      }}>
      <View
        style={{
          paddingHorizontal: 12,
          paddingVertical: 16,
          marginBottom: 12,
          borderColor: Colors.surface.lightGray,
          borderWidth: 1,
          borderRadius: 4,
        }}>
        <PlaceholderLine
          noMargin
          style={{ height: 16, width: 60, backgroundColor: Colors.surface.white }}
        />
        <View style={{ height: 8 }} />
        <PlaceholderLine
          noMargin
          style={{ height: 16, width: 120, backgroundColor: Colors.surface.white }}
        />
        <View style={{ height: 8 }} />
        <PlaceholderLine
          noMargin
          style={{ height: 16, width: 180, backgroundColor: Colors.surface.white }}
        />
        <View style={{ height: 8 }} />
        <PlaceholderLine
          noMargin
          style={{ height: 16, width: 200, backgroundColor: Colors.surface.white }}
        />
      </View>
    </View>
  );
};

export const PlaceholderList = () => {
  return (
    <Placeholder style={{ flex: 1 }} Animation={Fade}>
      <PlaceholderItemGroup />
      <PlaceholderItemGroup />
    </Placeholder>
  );
};

const PlaceholderItemGroup = () => (
  <>
    <View style={[Typography.h1, { alignItems: 'center', paddingBottom: 14 }]}>
      <PlaceholderLine
        noMargin
        style={{ height: 21, width: 200, backgroundColor: Colors.surface.white }}
      />
    </View>
    <View style={{ alignItems: 'center' }}>
      <RecipientItemPlaceholder />
    </View>
    <View style={{ alignItems: 'flex-end', paddingHorizontal: 16 }}>
      <PlaceholderLine
        noMargin
        style={{ height: 16, width: 80, backgroundColor: Colors.surface.white }}
      />
    </View>
    <View style={{ height: 12 }} />
    <View style={{ height: 4, backgroundColor: Colors.background }} />
    <SubcartHeaderPlaceholder />
    <SubcartOptionsPlaceholder />
    <SubcartFooterPlaceholder />
  </>
);

const styles = StyleSheet.create({
  warningBar: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: applyFakeOpacity('#83B6EF', 0.3),
  },
  recipientLine: { paddingHorizontal: 16, marginTop: 24 },
});
