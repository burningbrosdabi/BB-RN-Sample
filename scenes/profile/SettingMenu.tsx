import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Colors, Outlines } from 'styles';
import { Button, ButtonType, LayoutConstraint } from 'components/button/Button';


const MenuListData = [
  {
    name: 'Hỗ trợ',
    handleOnPress: () => {
      Linking.openURL('mailto:su.seo@burningb.com');
    },
  },
  {
    name: 'Chính sách thông tin cá nhân', //개인정보 처리 방침
    handleOnPress: () => {
      Linking.openURL('https://dabivn.com/privacy-policy/');
    },
  },
  {
    name: 'Điều khoản dịch vụ', //서비스 이용 약관
    handleOnPress: () => {
      Linking.openURL('https://dabivn.com/term-of-service/');
    },
  },
];

/** @deprecated   **/
const SettingMenu = () => {
  const navigation = useNavigation();
  const _renderItem = ({ name, handleOnPress }) => {
    return (
      <Button
        key={name}
        text={name}
        alignItems={'flex-start'}
        textStyle={{ flex: 1, textTransform: 'none' }}
        onPress={() => handleOnPress(navigation)}
        type={ButtonType.flat}
        constraint={LayoutConstraint.matchParent}
        innerHorizontalPadding={16}
      />
    );
  };

  return <View style={[styles.container]}>{MenuListData.map((item) => _renderItem(item))}</View>;
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: Outlines.borderWidth.medium,
    borderColor: Colors.line,
  },
});

export default SettingMenu;
