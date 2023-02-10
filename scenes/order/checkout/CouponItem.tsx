import { VoucherIcon } from 'assets/icons/common';
import { RadioCircleButton } from 'components/button/RadioCircleButton';

import { ICoupon } from 'model/coupon/coupon';
import moment from 'moment';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Spacing, Typography } from 'styles';
import { fontRegular } from 'styles/typography';
import { toPriceFormat } from 'utils/helper';


interface Props {
  data: ICoupon,
  onSelectedItem?: (data: any) => void;
  selectedItem?: any;
  isActive?: boolean;
  style?: ViewStyle
}

const MAX_WIDTH = Spacing.screen.width - 32;
const MAX_TEXT_WIDTH = MAX_WIDTH - 24 - 48;
const AVAILABLE_TEXT_WIDTH = 100

const CouponItem = ({ data, isActive = true, onSelectedItem, selectedItem, style }: Props) => {
  const { name, description, deactivate_date, amount_off, percent_off } = data
  const time = (deactivate_date && moment(deactivate_date).isValid()) ? moment(deactivate_date).format("DD-MM-YYYY") : ""
  const isSelected = selectedItem && selectedItem.id === data.id

  const onPressItem = () => {
    onSelectedItem && onSelectedItem(data);
  }

  const separatorView = () => {
    return (
      <View style={styles.separatorContainer}>
        {/* <View style={styles.separatorLine} /> */}
        <Image style={[styles.icon, { tintColor: isSelected ? Colors.white : Colors.surface.lightGray }]} source={require('_assets/images/icon/vertical_line.png')} />
        <View style={styles.semiCicleTopContainer}>
          <View style={styles.semiCicle} />
        </View>
        <View style={styles.semiCicleBottomContainer}>
          <View style={styles.semiCicle} />
        </View>
      </View>
    );
  };

  const color = isSelected ? Colors.white : Colors.text
  return (
    <View style={[styles.container, style, { opacity: isActive ? 1 : 0.5 }]}>
      <LinearGradient useAngle angle={271}
        colors={isSelected ? Colors.gradient.pink : Colors.gradient.line} style={styles.topContainer}>
        <TouchableOpacity onPress={onPressItem} disabled={!isActive}>
          <View style={styles.leftContainer}>
            <Text
              style={[styles.titleText, { color }]}
              numberOfLines={2}>{name}</Text>
            <Text
              style={[styles.contentText, { color }]}
              numberOfLines={2}>{description}</Text>
            <View style={styles.bottomTextContainer}>
              <Text style={[styles.bodyText, { color, width: MAX_TEXT_WIDTH - AVAILABLE_TEXT_WIDTH }]}>{`HSD: ${time}`}</Text>
              <Text style={[styles.bodyText, { color, textAlign: 'right', width: AVAILABLE_TEXT_WIDTH }]}>{isActive ? "Khả dụng" : "Không khả dụng"}</Text>
            </View>
          </View>
        </TouchableOpacity>
        {separatorView()}
        <View style={styles.rightContainer}>
          <RadioCircleButton
            disabled={!isActive}
            key={data.id}
            radius={24}
            color={isSelected ? Colors.primary : Colors.white}
            onPress={onPressItem}
            selected={isSelected}
            colorCheck={true}
            border={false}
            buttonStyle={{ ...styles.radioButton, borderWidth: isSelected ? 0 : 2 }}
            containerStyle={{ flexDirection: 'row', alignSelf: 'center' }}
          />
        </View>
      </LinearGradient>
      <View style={[styles.bottomTextContainer, { width: MAX_WIDTH, marginBottom: 16 }]}>
        <View style={styles.rowView}>
          <VoucherIcon size={22} color={isSelected ? undefined : Colors.text} />
          <Text style={[styles.discountText, Typography.description, {
            color: isSelected ? Colors.primary : Colors.text,
            fontFamily: fontRegular,
            marginLeft: 4
          }]}>{'Giảm giá'}</Text>
        </View>
        <Text style={[styles.discountText, { color: isSelected ? Colors.primary : Colors.text }]}>{amount_off ? toPriceFormat(amount_off) : percent_off + '%'}</Text>
      </View>
    </View>
  );
};

export default React.memo(CouponItem);

const styles = StyleSheet.create({
  container: {
    width: Spacing.screen.width,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },
  topContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    width: MAX_WIDTH,
    borderRadius: 4,
  },
  leftContainer: {
    padding: 12,
    width: MAX_WIDTH - 48,
  },
  titleText: {
    ...Typography.title,
    width: MAX_TEXT_WIDTH,
  },
  contentText: {
    ...Typography.description,
    width: MAX_TEXT_WIDTH,
  },
  bodyText: {
    ...Typography.smallCaption,
    textTransform: 'none',
    width: MAX_TEXT_WIDTH,
  },
  discountText: {
    ...Typography.option,
    textTransform: 'none',
  },
  rightContainer: {
    width: 48,
    alignSelf: 'center',
  },
  bottomTextContainer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  editText: {
    ...Typography.option,
    color: Colors.text,
  },
  radioButton: {
    borderWidth: 2,
    borderColor: Colors.icon,
    alignItems: 'center',
    justifyContent: 'center'
  },
  separatorContainer: {
    height: '100%',
    position: 'absolute',
    right: 48,
  },
  separatorLine: {
    height: '100%',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.white
  },
  icon: {
    width: 1,
    height: '100%',
    resizeMode: 'contain'
  },
  semiCicleTopContainer: {
    overflow: 'hidden',
    width: 8,
    height: 4,
    position: 'absolute',
    top: 0,
    left: -3,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  semiCicleBottomContainer: {
    overflow: 'hidden',
    width: 8,
    height: 4,
    position: 'absolute',
    bottom: 0,
    left: -3,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  semiCicle: {
    width: 8,
    height: 8,
    backgroundColor: Colors.white
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});