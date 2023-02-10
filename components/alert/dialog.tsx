import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Text, View, Modal } from 'react-native';
import { isEmpty, isNil, last } from 'lodash';

import { Button, ButtonType } from 'components/button/Button';

import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import type { Dialog } from 'utils/state/reducers/app.reducer';
import { useActions } from 'utils/hooks/useActions';

import { NavigationService } from "services/navigation";

import { AuthRouteSetting } from "routes";

import { Colors, Typography } from 'styles';


interface Props {
  // visible: boolean;
}

export const ModalDialog = ({ }: Props) => {
  const { dialog } = useTypedSelector((state) => state.app);
  const { hideDialog } = useActions();
  const prevDialog = useRef<Dialog | undefined>();

  const memoDialog = useMemo(() => {
    return dialog ?? prevDialog.current;
  }, [dialog]);

  useEffect(() => {
    if (dialog) prevDialog.current = dialog;
  });

  return (
    <Modal transparent animationType={'fade'} visible={!isNil(dialog)} style={{ padding: 0 }}>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.container,
            {
              paddingBottom: last(memoDialog?.actions)?.type === ButtonType.flat ? 12 : 24,
            },
          ]}>
          <View style={styles.titleContainer}>
            <Text style={[Typography.name_button, { textAlign: 'center' }]}>
              {memoDialog?.title ?? ''}
            </Text>
            {!isEmpty(memoDialog?.description) && (
              <Text style={[Typography.body, { textAlign: 'center' }]}>
                {memoDialog?.description ?? ''}
              </Text>
            )}
          </View>
          <View style={{ height: 24 }} />
          {memoDialog?.actions?.map((action, index) => {
            const onPress = () => {
              if (!memoDialog?.persistOnBtnPressed) {
                hideDialog();
              }
              action.onPress();
            };
            return (
              <View key={`${index}`} style={styles.btnContainer}>
                <Button {...action} onPress={onPress} textStyle={action?.type == ButtonType.flat ? {
                  ...action.textStyle,
                  textTransform: 'none',
                  color: Colors.primary
                } : action.textStyle} />
              </View>
            );
          })}
        </View>
      </View>
    </Modal>
  );
};

export const AuthDialog = {
  title: 'Bạn cần đăng nhập\nđể sử dụng chức năng này.',
  actions: [
    {
      type: ButtonType.primary,
      text: 'Đăng nhập',
      onPress: () => {
        NavigationService.instance.navigate(new AuthRouteSetting());
      },
    },
    {
      text: 'Quay Lại',
      type: ButtonType.flat,
      onPress: () => { },
    },
  ],
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  container: {
    width: '100%',
    // minHeight: 48,
    backgroundColor: Colors.white,
    alignItems: 'center',
    padding: 24,
  },
  titleContainer: { justifyContent: 'center' },
  btnContainer: { height: 48, width: '100%' },
});
