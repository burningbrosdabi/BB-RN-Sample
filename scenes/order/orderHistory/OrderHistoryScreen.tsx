import SafeAreaWithHeader from 'components/view/SafeAreaWithHeader';
import React, { useEffect, useMemo } from 'react';
import { Image, Text, View } from 'react-native';
import { NavigationState, Route } from 'react-native-tab-view';
import { useActions } from 'utils/hooks/useActions';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { HEADER_HEIGHT } from '_helper';
import { Typography } from '_styles';
import { getCancelReasons, getExchangeReasons } from 'utils/state/action-creators';
import Ripple from 'react-native-material-ripple';
import { useNavigator } from 'services/navigation/navigation.service';
import { OrdersRouteSetting } from 'routes';
import { OrderStatus, OrderStatusContentMap, OrderStatusMap } from 'scenes/order/orderHistory/type';
import { isNil } from 'lodash';

export type State = NavigationState<Route>;

const OrderHistoryScreen = () => {
  const { setLoading } = useActions();
  const { exchangeReasons } = useTypedSelector(state => state.order);

  const fetchReason = async () => {
    setLoading(true);
    await Promise.all([getCancelReasons().catch(), getExchangeReasons().catch()]).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchReason();
  }, []);

  return (
    <SafeAreaWithHeader title={'Đơn hàng của tôi'}>
      <View style={{ flex: 1, marginTop: HEADER_HEIGHT }}>
        {Object.keys(OrderStatusMap).map(status => (
          <StatusLine status={status as OrderStatus} />
        ))}
      </View>
    </SafeAreaWithHeader>
  );
};

export default React.memo(OrderHistoryScreen);

const StatusLine = ({ status }: { status: OrderStatus }) => {
  const navigator = useNavigator();
  const order_count = useTypedSelector(state => state.user.userInfo.order_count_summary);
  const count = useMemo(() => {
    if (status === OrderStatus.exchanged) {
      return order_count.exchange_refund_count;
    } else if (status === OrderStatus.cancelled) {
      return order_count.cancel_count;
    }
    return undefined;
  }, [order_count]);
  const { text, image } = useMemo(() => {
    return OrderStatusContentMap[status];
  }, [status]);

  return (
    <Ripple
      onPress={() => {
        navigator.navigate(new OrdersRouteSetting({ status }));
      }}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Image source={image} style={{ width: 24, height: 24 }} />
      <View style={{ width: 12 }} />
      <Text style={Typography.name_button}>{text}</Text>
      <View style={{ width: 12 }} />
      {!isNil(count) && (
        <Text style={[Typography.description, { lineHeight: 20, textAlignVertical: 'bottom' }]}>
          {count}
        </Text>
      )}
    </Ripple>
  );
};
