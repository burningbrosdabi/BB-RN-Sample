import { isNil } from 'lodash';
import React, { useEffect, useMemo, useRef } from 'react';
import { KeyboardAvoidingView, Modal, StyleSheet, View } from 'react-native';
import { Colors } from 'styles';
import { useActions } from 'utils/hooks/useActions';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import type { PopUp } from 'utils/state/reducers/app.reducer';



interface Props {
  // visible: boolean;
}

export const ModalPopup = ({ }: Props) => {
  const { popUp } = useTypedSelector((state) => state.app);
  const { hidePopup } = useActions();
  const prevPopUp = useRef<PopUp | undefined>();

  const memoPopUp = useMemo(() => {
    return popUp ?? prevPopUp.current;
  }, [popUp]);

  useEffect(() => {
    if (popUp) prevPopUp.current = popUp;
  });

  return (
    <Modal transparent animationType={'fade'}
      visible={!isNil(popUp)}
      style={{ padding: 0 }}>
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          behavior="padding"
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={[
              { padding: memoPopUp?.padding ?? 12 }, styles.container,
            ]}>
            {memoPopUp?.children}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

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
    borderRadius: 8,
    alignItems: 'center',
    overflow: 'hidden'
  },
});
