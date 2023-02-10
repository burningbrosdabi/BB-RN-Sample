import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { EmptyView } from 'components/empty/EmptyView';
import Button, { ButtonType } from 'components/button/Button';
import { useNavigator } from 'services/navigation/navigation.service';
import { toast } from 'components/alert/toast';
import {Header} from "components/header/Header";

export const BlockScreen = () => {
  const navigation = useNavigator();
  const onContactWithDabi = () => {
    try {
      Linking.openURL('http://m.me/dabivietnam');
    } catch (error) {
      Linking.openURL('https://www.facebook.com/106467717966358').catch((_) => {
        toast('Không thể truy cập đường dẫn');
      });
    }
  };

  return (
    <View style={styles.container}>
      <Header/>
      <View style={{ transform: [{ translateY: -48 }] }}>
        <EmptyView
          title={'Vui lòng thử lại sau 30 phút'}
          description={'Bạn đã nhập xác thực quá số lần cho phép. '}

          file={require('/assets/images/empty/waiting.png')}
        />
      </View>
      <View style={{ height: 48 * 2 + 12, position: 'absolute', bottom: 16, left: 16, right: 16 }}>
        <Button type={ButtonType.outlined} text={'Chat với dabi'} onPress={onContactWithDabi} />
        <View style={{ height: 12 }} />
        <Button text={'Thử lại'} onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
