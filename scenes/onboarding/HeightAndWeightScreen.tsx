import { Button, ButtonState, ButtonType, floatingButtonContainer, LayoutConstraint } from 'components/button/Button';
import { ConnectionDetection } from 'components/empty/OfflineView';
import { InputBox } from 'components/inputs/InputField.v2';
import { isNil } from 'lodash';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RoutePath } from 'routes';
import { updateUserApi } from 'services/api';
import { Logger } from 'services/log/log.service';
import { Colors, Typography } from 'styles';
import { HEADER_HEIGHT } from 'utils/helper';
import { useActions } from 'utils/hooks/useActions';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';

interface Props {
  navigation: any;
}

const HeightAndWeightScreen = ({ navigation }: Props) => {
  const { userInfo } = useTypedSelector((state) => state.user);
  const { weight, height } = userInfo
  const [userWeight, setUserWeight] = useState<number | undefined>(weight)
  const [userHeight, setUserHeight] = useState<number | undefined>(height)
  const [buttonEnabled, setButtonEnabled] = useState(false)
  const { setLoading } = useActions();

  useEffect(() => {
    Logger.instance.logTutorialBegin();
  },[])

  useEffect(() => {
    if (userWeight > 0) {
      setButtonEnabled(true)
      return
    }
    if (userHeight > 0) {
      setButtonEnabled(true)
      return
    }
    setButtonEnabled(false)
  }, [userWeight, userHeight]);


  const handleOnPress = async (skip = false) => {
    setLoading(true)
    if (!skip) {
      try {
        await updateUserApi({ weight: userWeight, height: userHeight })
      } catch { }
    }
    navigation.navigate(RoutePath.styleSelection);
    setLoading(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ConnectionDetection.View>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingHorizontal: 16 }}
        >
          <View style={{
            height: HEADER_HEIGHT, alignItems: 'flex-end', justifyContent: 'center',
          }}>
            <TouchableOpacity onPress={() => handleOnPress(true)}>
              <Text style={{ ...Typography.name_button, color: Colors.primary }}>Bỏ qua</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 12 }} />
          <Text style={Typography.title}>.Dabi sẽ giúp bạn tìm các bài viết có trang phục tương tự với dáng người.</Text>
          <View style={{ height: 12 }} />
          <Text style={Typography.body}>Nếu bạn cập nhật chiều cao và cân nặng, .Dabi sẽ gợi ý cho bạn các bài viết có cùng dáng người với bạn.</Text>
          <View style={{ height: 48 }} />
          <View style={{ flex: 1, paddingBottom: 100 }}>
            <View style={{ flex: 1, marginBottom: 24 }}>
              <InputBox text={'Chiều cao (cm)'}
                initialValue={userHeight?.toString()}
                onChangeText={setUserHeight}
                placeholder={'Nhập chiều cao (cm)'}
                maxLength={3}
                keyboardType='number-pad' />
            </View>
            <View style={{ flex: 1, marginBottom: 24 }}>
              <InputBox text={'Cân nặng (kg)'}
                placeholder={'Nhập cân  (kg)'}
                initialValue={userWeight?.toString()}
                onChangeText={setUserWeight}
                maxLength={3}
                keyboardType='number-pad' />
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View style={floatingButtonContainer().style}>
          <Button
            type={ButtonType.primary}
            state={!buttonEnabled ? ButtonState.disabled : ButtonState.idle}
            disabled={!buttonEnabled}
            onPress={handleOnPress}
            text={'Lưu'}
            constraint={LayoutConstraint.matchParent}
          />
        </View>
      </ConnectionDetection.View>
    </SafeAreaView>
  );
};

export default React.memo(HeightAndWeightScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: Colors.surface.darkGray,
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
