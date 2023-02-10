import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';

interface Props {
  children: JSX.Element | JSX.Element[];
}
export interface ModalRef {
  close: () => void;
  open: () => void;
}
export const Modal = forwardRef(({ children }: Props, ref) => {
  const modalizeRef = useRef<Modalize>(null);

  useImperativeHandle<unknown, ModalRef>(
    ref,
    () => ({
      close,
      open,
    }),
    [modalizeRef],
  );

  const close = () => {
    modalizeRef?.current?.close();
  };

  const open = () => {
    modalizeRef?.current?.open();
  };

  const _renderHeader = () => {
    return <View style={{ height: 22 }} />;
  };

  return (
    <Portal>
      <Modalize
        ref={modalizeRef}
        panGestureEnabled
        rootStyle={{ zIndex: 10, elevation: 10 }}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
        HeaderComponent={_renderHeader}
        adjustToContentHeight
        withHandle={false}>
        {children}
      </Modalize>
    </Portal>
  );
});
