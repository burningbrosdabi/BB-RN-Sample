import { useNavigation } from '@react-navigation/native';
import DabiFont from 'assets/icons/dabi.fonts';
import { DEFAULT_IC_BTN_PADDING, IconButton } from 'components/button/IconButton';
import { FeatureMeasurement } from 'components/tutorial';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { CartRouteSetting } from 'routes/order/cart.route';
import { cartObservable } from 'services/api/cart';
import { NavigationService } from 'services/navigation';
import { Colors, Outlines, Typography } from 'styles';
import { useActions } from 'utils/hooks/useActions';
import { HeaderNotificationButton } from './Header';
import { getHeaderLayout } from '_helper';

/** @deprecated   **/
export const HeaderTitle = () => {
  const { searchBoxContainer, searchBoxInputField } = styles;
  const navigation = useNavigation();
  const { resetStoreFilter } = useActions();
  const messengerLink = 'http://m.me/' + 'dabivietnam';
  const pageLink = 'https://www.facebook.com/' + '106467717966358';

  const onPressChat = () => {
    try {
      Linking.openURL(messengerLink);
    } catch {
      Linking.openURL(pageLink);
    }
  };
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        resetStoreFilter && resetStoreFilter();
        navigation.navigate('Search');
      }}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          marginTop: getHeaderLayout().extra + 12,
          marginBottom: 12
        }}>
        <View style={{
          flexDirection: 'row',
          paddingLeft: 16,
          paddingRight: 16,
          borderRadius: 20,
          alignItems: 'center',
          height: 40,
          backgroundColor: Colors.background,
          justifyContent: 'space-between',
          flex: 1,
        }}>
          <Text style={{
            ...Typography.body,
            textAlignVertical: 'center',
          }}>Bạn muốn tìm gì?</Text>
          {/* <FeatureMeasurement
            id={'search'}
            title={'Tìm kiếm theo từ khóa 👗'}
            description={'Bạn muốn tìm gì tại Dabi? Hãy gõ từ khóa tại đây nhé!'}
            backgroundColor={Colors.primary}
            overlay={<DabiFont name={'search_line'} size={24} color={Colors.icon} />}> */}
          <DabiFont name={'search_line'} size={24} color={Colors.icon} />
          {/* </FeatureMeasurement> */}
        </View>
        {/* <View style={{ width: 12 }} />
        <View style={{ transform: [{ translateX: DEFAULT_IC_BTN_PADDING }] }}> */}
        {/* <FeatureMeasurement
            id={'cart'}
            description={'Thêm sản phẩm vào giỏ và thỏa sức mua sắm cùng Dabi'}
            title={'Giỏ hàng của bạn 🛒'}
            backgroundColor={Colors.purple}
            overlay={<DabiFont name={'cart'} size={24} color={Colors.icon} />}>
            <IconButton
              icon={'cart'}
              onPress={() => {
                NavigationService.instance.navigate(new CartRouteSetting());
              }}
              badge={{
                observer: cartObservable,
                offset: { top: 8, right: 4 },
              }}
            />
          </FeatureMeasurement> */}
        {/* </View> */}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default HeaderTitle;

const styles = StyleSheet.create({
  searchBoxContainer: {
    flexDirection: 'row',
    paddingLeft: 12,
    paddingRight: 8,
    borderRadius: Outlines.borderRadius.base,
    alignItems: 'center',
    height: 32,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
    flex: 1,
  },
  searchBoxInputField: {

  },
});
