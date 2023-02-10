import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import { InfoAdsIcon, InfoPersonalizeIcon, InfoRecommendIcon } from 'assets/icons/common';
import { Button, ButtonType, LayoutConstraint, floatingButtonContainer } from 'components/button/Button';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  getTrackingStatus,
  requestTrackingPermission,
  TrackingStatus
} from 'react-native-tracking-transparency';
import { RoutePath } from 'routes';
import { Colors, Typography } from 'styles';
import { storeKey } from 'utils/constant';
import { useActions } from 'utils/hooks/useActions';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';


const AppTrackingScreen = () => {
  const [_, setTrackingStatus] = useState<TrackingStatus>('not-determined');
  const navigation = useNavigation()
  const { setLoading } = useActions();

  useEffect(() => {
    setLoading(false);
    getTrackingStatus()
      .then((status) => {
        setTrackingStatus(status);
      })
      .catch((e) => console.log('Error', e?.toString?.() ?? e));
  }, []);

  const requestTrakingPermission = useCallback(async () => {
    try {
      const status = await requestTrackingPermission();
      setTrackingStatus(status);
      navigation.navigate(RoutePath.main);
    } catch (e) {
      console.log('Error', e?.toString?.() ?? e);
    }
    await AsyncStorage.setItem(storeKey.passTutorial, 'true');
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ paddingHorizontal: 16, }}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}>
        <Image
          source={require('_assets/images/tutorial/info_transparency.png')}
          style={styles.topImage}
        />
        <Text style={styles.titleText}>{'Cá nhân hóa trải nghiệm'}</Text>
        <Text style={styles.descriptionText}>
          {'Hãy cho phép Dabi truy cập hoạt động của bạn trên ứng dụng nhằm:'}
        </Text>
        <View style={styles.line} />
        <View style={styles.itemContainer}>
          <Image
            source={require('_assets/images/tutorial/info_transparency_1.png')}
            style={{ width: 48, height: 48 }}
          />
          <Text style={styles.contentText}>{'Đề xuất các ưu đãi hấp dẫn dựa trên hành vi mua sắm'}</Text>
        </View>
        <View style={styles.itemContainer}>
          <Image
            source={require('_assets/images/tutorial/info_transparency_2.png')}
            style={{ width: 48, height: 48 }}
          />
          <Text style={styles.contentText}>
            {'Gợi ý các sản phẩm phù hợp dự theo kết quả tìm kiếm'}
          </Text>
        </View>
        <View style={styles.itemContainer}>
          <Image
            source={require('_assets/images/tutorial/info_transparency_3.png')}
            style={{ width: 48, height: 48 }}
          />
          <Text style={styles.contentText}>{'Cá nhân hóa trải nghiệm mua sắm của bạn'}</Text>
        </View>
        <View style={styles.line} />
        <Text style={[styles.contentText, Typography.name_button,]}>
          {'Dabi cam kết tuyệt đối không truy cập thêm bất kỳ thông tin nào khác'}
        </Text>
      </ScrollView>
      <View style={floatingButtonContainer().style}>
        <Button
          type={ButtonType.primary}
          onPress={requestTrakingPermission}
          text={'Tiếp tục'}
          constraint={LayoutConstraint.matchParent}
        />
      </View>
    </SafeAreaView>
  );
};

export default React.memo(AppTrackingScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  topImage: {
    marginTop: 12 * 4,
    marginBottom: 12,
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemImage: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  titleText: {
    ...Typography.h1,
    textAlign: 'center',
    marginBottom: 12,
  },
  descriptionText: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: 12,
    marginHorizontal: 28,
  },
  contentText: {
    ...Typography.body,
    marginLeft: 12,
    flex: 1,
    flexWrap: 'wrap',
  },
  line: {
    height: 1,
    backgroundColor: Colors.background,
    width: '100%',
    marginBottom: 12,
  },
});
