import { useNavigation, StackActions } from '@react-navigation/native';
import Button, { ButtonType } from 'components/button/Button';
import { IconButton } from 'components/button/IconButton';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RoutePath } from 'routes';
import { Typography } from 'styles';

export const ArchiveScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
      <View
        style={{
          width: '100%',
          height: 48,
          justifyContent: 'center',
          paddingHorizontal: 16,
        }}>
        <IconButton icon={'exit'} onPress={() => navigation.goBack()} />
      </View>

      <View style={{ height: 32 }} />
      <Text style={Typography.h1}>Đặt hàng thành công!</Text>
      <View style={{ height: 42 }} />
      <Image
        style={{ width: 150, height: 150 }}
        source={require('assets/images/empty/checkout_success.png')}
      />
      <View style={{ height: 22 }} />
      <Text style={[Typography.body, { textAlign: 'center' }]}>
        {'Cảm ơn bạn đã đặt hàng tại Dabi\nĐơn hàng sẽ được nhanh chóng chuẩn bị'}
      </Text>
      <View style={{ height: 22 }} />
      <View style={{ height: 48, width: '100%', paddingHorizontal: 16 }}>
        <Button
          text={'Tiếp tục mua sắm'}
          onPress={() => {
            navigation.dispatch(StackActions.popToTop());
          }}
        />
      </View>
      <View style={{ height: 12 }} />
      <View style={{ height: 48, width: '100%', paddingHorizontal: 16 }}>
        <Button
          type={ButtonType.outlined}
          text={'Xem đơn hàng'}
          onPress={() => {
            navigation.goBack();
            navigation.navigate(RoutePath.orderHistoryScreen, { initTabIndex: 0 });
          }}
        />
      </View>
    </SafeAreaView>
  );
};
