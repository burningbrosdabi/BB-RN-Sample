import { isNil } from 'lodash';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { PlaceholderLine } from 'rn-placeholder/lib/PlaceholderLine';
import { Colors, Typography } from 'styles';
import { toPriceFormat } from 'utils/helper/FormatHelper';
import { useGetSubcartTotal } from '../helper.hook';

export const SubtotalDetail = ({ storePk }: { storePk: number }) => {

  const { subtotal, shipping, discount } = useGetSubcartTotal(storePk);

  return (
    <>
      <View style={styles.subtotalText}>
        <Text style={Typography.description}>Tổng tiền hàng</Text>
        <Text style={Typography.body}>{toPriceFormat(subtotal)}</Text>
      </View>
      <View style={styles.subtotalText}>
        <Text style={Typography.description}>Phí vận chuyển</Text>
        <Text style={Typography.body}>{toPriceFormat(shipping)}</Text>
      </View>
      {!isNil(discount) && discount > 0 && (
        <View style={styles.subtotalText}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={{ height: 24, width: 24 }}
              source={require('assets/images/icon/voucher_ic.png')}
            />
            <View style={{ width: 4 }} />
            <Text style={[Typography.description, { color: Colors.primary }]}>{'Giảm giá'}</Text>
          </View>
          <Text style={[Typography.name_button, { color: Colors.primary, textTransform: 'none' }]}>
            -{toPriceFormat(discount)}
          </Text>
        </View>
      )}
    </>
  );
};

export const SubtotalDetailPlaceholer = () => {
  return (
    <>
      <View style={styles.subtotalTextPlaceholder}>
        <PlaceholderLine
          noMargin
          style={{ width: 80, height: 16, backgroundColor: Colors.surface.white }}
        />
        <PlaceholderLine
          noMargin
          style={{ width: 100, height: 16, backgroundColor: Colors.surface.white }}
        />
      </View>
      <View style={styles.subtotalTextPlaceholder}>
        <PlaceholderLine
          noMargin
          style={{ width: 80, height: 16, backgroundColor: Colors.surface.white }}
        />
        <PlaceholderLine
          noMargin
          style={{ width: 120, height: 16, backgroundColor: Colors.surface.white }}
        />
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  subtotalText: {
    paddingTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  subtotalTextPlaceholder: {
    paddingTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
});
