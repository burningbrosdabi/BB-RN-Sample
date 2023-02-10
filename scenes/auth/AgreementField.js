import React, { PureComponent } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fontSemiBold } from 'styles/typography';
import { Colors, Outlines, Typography } from '_styles';

export default class AgreementField extends PureComponent {
  render() {
    const { rowContainer, text, linkContainer } = styles;
    return (
      <View>
        <View style={rowContainer}>
          <Text style={text}>Đồng ý với </Text>
          <TouchableOpacity
            style={[linkContainer]}
            onPress={() => {
              Linking.openURL('https://dabivn.com/term-of-service/');
            }}>
            <Text style={{ ...text, fontFamily: fontSemiBold }}>Điều khoản dịch vụ</Text>
          </TouchableOpacity>
          <Text style={text}> cũng như </Text>
          <TouchableOpacity
            style={linkContainer}
            onPress={() => {
              Linking.openURL('https://dabivn.com/privacy-policy/');
            }}>
            <Text style={{ ...text, fontFamily: fontSemiBold }}>Chính sách thông tin cá nhân</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    paddingBottom: 1, flex: 1, flexWrap: 'wrap'
  },
  text: {
    ...Typography.description,
    color: Colors.black,
  },
  linkContainer: {
    borderBottomColor: Colors.text,
    borderBottomWidth: Outlines.borderWidth.base,
  },
});
