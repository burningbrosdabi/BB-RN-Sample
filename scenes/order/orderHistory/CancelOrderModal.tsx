import Button, { ButtonState, ButtonType } from 'components/button/Button';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { Colors, Typography } from 'styles';
import { useActions } from 'utils/hooks/useActions';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import LoadingIndicator from 'components/loading/LoadingIndicator';
import Ripple from 'react-native-material-ripple';
import { RadioCircleButton } from 'components/button/RadioCircleButton';
import { fontRegular } from 'styles/typography';
import DEPRECATED_InputField from 'components/inputs/InputField.v2';
import {getCancelReasons} from "utils/state/action-creators";

const CancelOrderModal = ({
  visible,
  onClose,
  onCancelOrder,
}: {
  visible: boolean;
  onClose: () => void;
  onCancelOrder: (data: any, message?: string) => void;
}) => {
  const modalizeRef = useRef<Modalize>(null);
  const { showDialog } = useActions();

  const { data: reasons, state, excecute } = useAsync(getCancelReasons);

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [otherReason, setOtherReason] = useState('');

  useEffect(() => {
    excecute();
  }, []);

  const reasonList = reasons
    ? Object.values(reasons).map((res, index) => {
        return {
          id: index + 1,
          value: res,
        };
      })
    : [];

  const onChangeText = (text: string) => {
    setOtherReason(text);
  };

  const isValid = () => {
    return (
      (selectedItem && selectedItem.id == reasonList.length && otherReason) ||
      (selectedItem && selectedItem.id != reasonList.length)
    );
  };

  useEffect(() => {
    if (visible) {
      modalizeRef.current?.open();
      setSelectedItem(null);
      setOtherReason('');
    } else {
      modalizeRef.current?.close();
    }
  }, [visible]);

  const _renderCancelAlert = () => {
    showDialog({
      title: 'Bạn có chắc chắn muốn hủy đơn hàng này không?',
      actions: [
        {
          type: ButtonType.primary,
          text: 'Hủy',
          onPress: () => onCancelOrder(selectedItem, otherReason),
        },
        {
          text: 'Giữ lại',
          type: ButtonType.flat,
          onPress: () => {},
          textStyle: { color: Colors.primary },
        },
      ],
    });
  };

  return (
    <Portal>
      <Modalize
        ref={modalizeRef}
        panGestureEnabled
        rootStyle={{ zIndex: 10, elevation: 10 }}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
        onClose={onClose}
        adjustToContentHeight
        withHandle={false}>
        <View style={{ padding: 16, paddingBottom: 30 }}>
          {state !== ConnectionState.hasData ? (
            <View style={{ height: 300 }}>
              <LoadingIndicator />
            </View>
          ) : (
            <>
              <Text
                style={[
                  Typography.title,
                  {
                    color: 'black',
                    marginBottom: 6,
                  },
                ]}>
                {'Tại sao bạn muốn hủy đơn hàng này vậy?'}
              </Text>
              {reasonList.map((item, index) => {
                const isSelected = selectedItem && selectedItem.value == item.value;
                return (
                  <Ripple key={index} onPress={() => setSelectedItem(item)}>
                    <RadioCircleButton
                      key={index}
                      radius={24}
                      color={Colors.white}
                      selected={isSelected}
                      nonIconChecked={true}
                      label={item.value}
                      buttonStyle={styles.radioButton}
                      labelStyle={{
                        ...Typography.body,
                        fontFamily: fontRegular,
                        color: 'black',
                        marginTop: -4,
                      }}
                      containerStyle={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        paddingVertical: 6,
                      }}
                    />
                  </Ripple>
                );
              })}
              <DEPRECATED_InputField
                multiline={true}
                labelText="Lý do"
                labelTextSize={12}
                labelColor={Colors.black}
                textColor={Colors.text}
                borderBottomColor={Colors.primary}
                inputType="text"
                returnKeyType={'done'}
                blurOnSubmit={true}
                customStyle={{ marginBottom: 24, marginTop: 6, paddingVertical: 6 }}
                onChangeText={onChangeText}
                autoCapitalize={'none'}
                comment="Nhập lý do cụ thể"
                maxLength={75}
                textInputStyle={{ maxHeight: null }}
                editable={selectedItem && selectedItem.id == reasonList.length}
              />
              <Button
                type={ButtonType.primary}
                state={!isValid() ? ButtonState.disabled : ButtonState.idle}
                onPress={_renderCancelAlert}
                disabled={!isValid()}
                text={'Hủy đơn'}
              />
            </>
          )}
        </View>
      </Modalize>
    </Portal>
  );
};

export default React.memo(CancelOrderModal);

const styles = StyleSheet.create({
  radioButton: {
    marginRight: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
