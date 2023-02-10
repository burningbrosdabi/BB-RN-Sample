import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { OrderingInterface } from 'utils/data/filter';
import { Button, ButtonState, ButtonType, LayoutConstraint } from 'components/button/Button';
import { Spacing, Typography } from '_styles';
import Ripple from 'react-native-material-ripple';

interface Props {
  orderingType: OrderingInterface;
  orderList: OrderingInterface[];
  onPress: (orderingType: OrderingInterface) => void;
}

const OrderList = (props: Props) => {
  const { orderList, onPress, orderingType } = props;

  const renderOrderItem = ({ item, index }: { item: any; index: number }) => {
    const selected = orderingType.key == item.key;
    return (
      <View key={index} style={styles.itemStyle}>
        <Ripple
          onPress={() => onPress(item)}
          style={{ height: 48, justifyContent: 'center', flex: 1, paddingLeft: 16 }}>
          <Text style={Typography.name_button}>{item.description}</Text>
        </Ripple>
      </View>
    );
  };

  return (
    <View style={styles.iconRowContainer}>
      {orderList.map((item, index) => renderOrderItem({ item, index, ...props }))}
    </View>
  );
};

export default React.memo(OrderList);

const styles = StyleSheet.create({
  iconRowContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 24,
  },
  itemStyle: {
    width: '100%',
    marginBottom: 12,
  },
});
