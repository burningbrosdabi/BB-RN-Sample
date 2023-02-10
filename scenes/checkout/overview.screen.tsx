import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { OrderList } from './component/checkout.list';
import { OrderListMode } from './component/type.d';

export const OverviewScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1 }}>
      <OrderList mode={OrderListMode.overview} />
    </View>
  );
};

const Header = () => {
  return <></>;
};
