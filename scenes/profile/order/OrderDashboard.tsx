import { useNavigation } from '@react-navigation/native';
import { Button, ButtonType, LayoutConstraint } from 'components/button/Button';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { OrderHistoryRouteSetting } from 'routes';
import { NavigationService } from 'services/navigation';
import theme from 'styles/legacy/theme.style';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { Colors, Outlines, Spacing, Typography } from '_styles';


const OrderDashboard = () => {
  const navigation = useNavigation();
  const { userInfo } = useTypedSelector((state) => state.user);
  const { isLoggedIn, } = useTypedSelector((state) => state.auth);

  const { order_count_summary } = userInfo;
  const {
    confirmed_count = 0,
    waiting_count = 0,
    shipping_count = 0,
    shipped_count = 0,
    cancel_count = 0,
    exchange_refund_count = 0, } = order_count_summary || {};

  const onGotoOrderHistory = (initTabIndex?: number) => {
    const route = new OrderHistoryRouteSetting({ initTabIndex });
    NavigationService.instance.navigate(route)
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.rowView}>
          <Text
            style={{
              ...Typography.option,
            }}>{"Đơn hàng của tôi"}</Text>
          <Button
            constraint={LayoutConstraint.wrapChild}
            text={"Xem tất cả đơn"}
            onPress={onGotoOrderHistory}
            textStyle={{ ...Typography.description, textTransform: 'none' }}
            type={ButtonType.flat}
            innerHorizontalPadding={0}
            postfixIcon={'small_arrow_right'}
          />
        </View>
        <View style={[styles.rowView, { alignItems: 'flex-start', }]}>
          <Ripple onPress={() => onGotoOrderHistory(1)} style={styles.itemStatusContainer}>
            <View style={styles.iconContainer}>
              {waiting_count > 0 ? <View style={styles.dot}></View> : undefined}
              <Image style={styles.icon} source={require('_assets/images/icon/info_confirm.png')} />
            </View>
            <Text style={styles.statusText}>{"Chờ xác nhận"}</Text>
          </Ripple>
          <Ripple onPress={() => onGotoOrderHistory(2)} style={styles.itemStatusContainer}>
            <View style={styles.iconContainer}>
              {confirmed_count > 0 ? <View style={styles.dot}></View> : undefined}
              <Image style={styles.icon} source={require('_assets/images/icon/info_prepare.png')} />
            </View>
            <Text style={styles.statusText}>{"Chờ lấy hàng"}</Text>
          </Ripple>
          <Ripple onPress={() => onGotoOrderHistory(3)} style={styles.itemStatusContainer}>
            <View style={styles.iconContainer}>
              {shipping_count > 0 ? <View style={styles.dot}></View> : undefined}
              <Image style={styles.icon} source={require('_assets/images/icon/info_shipping.png')} />
            </View>
            <Text style={styles.statusText}>{"Đang giao"}</Text>
          </Ripple>
          <Ripple onPress={() => onGotoOrderHistory(4)} style={styles.itemStatusContainer}>
            <View style={styles.iconContainer}>
              {shipped_count > 0 ? <View style={styles.dot}></View> : undefined}
              <Image style={styles.icon} source={require('_assets/images/icon/info_receive.png')} />
            </View>
            <Text style={styles.statusText}>{"Đã giao"}</Text>
          </Ripple>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 32, }}>
        <Ripple onPress={() => onGotoOrderHistory(6)} style={styles.cancelOrderView}>
          <Image style={styles.icon} source={require('_assets/images/icon/refund_icon.png')} />
          <Text
            style={{
              ...Typography.option,
              color: Colors.surface.darkGray,
              marginLeft: 4,
            }}>{"Trả hàng"}
          </Text>
          <Text style={{ ...Typography.description, marginLeft: 12 }}>{exchange_refund_count}</Text>
        </Ripple>
        <Ripple onPress={() => onGotoOrderHistory(5)} style={styles.cancelOrderView}>
          <Image style={styles.icon} source={require('_assets/images/icon/cancel_order_icon.png')} />
          <Text
            style={{
              ...Typography.option,
              color: Colors.surface.darkGray,
              marginLeft: 4,
            }}>{"Hủy"}
          </Text>
          <Text style={{ ...Typography.description, marginLeft: 12 }}>{cancel_count}</Text>
        </Ripple>


      </View>
    </View>
  );
};

export default OrderDashboard;

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  contentContainer: {
    paddingVertical: 12,
    paddingHorizontal: theme.PADDING_16,
    borderBottomWidth: Outlines.borderWidth.base,
    borderTopWidth: Outlines.borderWidth.medium,
    borderColor: Colors.line,
    paddingTop: theme.MARGIN_10,
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemStatusContainer: {
    width: (Spacing.screen.width - 32) / 4,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelOrderView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: Outlines.borderWidth.base,
    borderColor: Colors.line,
    flex: 1,
  },
  statusText: {
    ...Typography.description, textTransform: 'none',
    width: '90%',
    textAlign: 'center'
  },
  iconContainer: {
    padding: 6
  },
  dot: {
    width: 6,
    height: 6,
    overflow: 'hidden',
    borderRadius: 3,
    backgroundColor: Colors.primary,
    position: 'absolute'
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  }
});
