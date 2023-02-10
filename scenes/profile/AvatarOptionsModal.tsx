import { useNavigation } from '@react-navigation/native';
import Button, { ButtonType } from 'components/button/Button';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { RoutePath } from 'routes';
import { Colors } from 'styles';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';

interface Props {
  onClose?: () => void;
  visible: boolean;
  onSelect: (index: number) => void;
}

export const AvatarOptionsModal = ({ onClose, onSelect, visible }: Props) => {
  const navigation = useNavigation();
  const { userInfo } = useTypedSelector((state) => state.user);

  const modalizeRef = useRef<Modalize>(null);

  useEffect(() => {
    if (visible) {
      modalizeRef.current?.open();
    } else {
      modalizeRef.current?.close();
    }
  }, [visible]);

  const openImageScreen = (_index: number) => {
    onSelect(0);
    navigation.push(RoutePath.userFeedbackImageScreen, {
      data: {
        user: {
          ...userInfo,
          pk: userInfo.id
        },
        image_1: userInfo.profile_image
      },
      zoomable: true
    });
  };

  return (
    <Portal>
      <Modalize
        panGestureEnabled={false}
        ref={modalizeRef}
        rootStyle={{ zIndex: 10, elevation: 10 }}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
        onClosed={onClose}
        adjustToContentHeight
        withHandle={false}>
        <View style={styles.container}>
          <Button
            text={'Xem ảnh đại diện'}
            type={ButtonType.primary}
            alignItems="center"
            onPress={() => openImageScreen(0)}
            textStyle={styles.btnTextStyle}
            color={Colors.background}
            style={styles.btn}
          />
          <Button
            text={'Đổi ảnh đại diện'}
            type={ButtonType.primary}
            alignItems="center"
            onPress={() => onSelect(1)}
            textStyle={styles.btnTextStyle}
            color={Colors.background}
            style={styles.btn}
          />
          <Button
            text={'Xóa ảnh đại diện'}
            type={ButtonType.primary}
            alignItems="center"
            onPress={() => onSelect(2)}
            textStyle={styles.btnTextStyle}
            color={Colors.background}
          />
        </View>
      </Modalize>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    marginBottom: 24,
    marginHorizontal: 16,
  },
  btn: {
    marginBottom: 12,
  },
  btnTextStyle: { textTransform: 'none', color: Colors.text },
});
