import { Modal, ModalRef } from 'components/modal/modal';
import { GenericErrorView } from 'components/empty/EmptyView';
import { HandledError } from 'error';
import { isNil } from 'lodash';
import { IShippingOptions } from 'model/checkout/type';
import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { getShippingOptionMap } from 'services/api/checkout/checkout.api';
import { applyFakeOpacity, Colors, Typography } from 'styles';
import { useAsync } from 'utils/hooks/useAsync';
import { CheckoutContext, ShippingOptionContext } from '../context';
import moment from 'moment';
import 'moment/locale/vi';
import { toPriceFormat } from 'utils/helper';
moment.locale('vi');

export interface ShippingModalRef {
  close: () => void;
  open: (pk: number) => void;
}

export const ShippingModal = forwardRef(
  ({ setShipping }: { setShipping: (storePk: number, shippingPk: number) => void }, ref) => {
    const { optionMap: subcart } = useContext(CheckoutContext);

    const [pk, setPk] = useState<number | null>(null);

    const selectedShipping = useMemo(() => {
      if (!pk) return null;
      return subcart[pk]?.shipping_option_id ?? null;
    }, [pk, subcart]);

    const { optionMap } = useContext(ShippingOptionContext);

    const { excecute } = useAsync(() => {
      const storesIds = Object.keys(subcart).map((value) => Number.parseInt(value, 10));
      return getShippingOptionMap(storesIds);
    });

    const modalRef = useRef<ModalRef>();

    const shippingOption = useMemo<IShippingOptions[] | undefined>(() => {
      if (!pk) return undefined;
      const option = !isNil(pk) ? optionMap[pk] : undefined;

      if (isNil(option)) {
        new HandledError({
          error: new Error(`[Checkout] shipping option of store ${pk} is empty`),
          stack: 'ShippingModal.shippingOption',
        }).log(true);
      }

      return option;
    }, [optionMap, pk]);

    useImperativeHandle<unknown, ShippingModalRef>(
      ref,
      () => ({
        close: () => {
          modalRef.current?.close();
        },
        open,
      }),
      [modalRef],
    );

    const open = (pk: number) => {
      setPk(pk);
      modalRef.current?.open();
    };

    const onSetShipping = (shippingPk: number) => {
      if (!pk) return;
      setShipping(pk, shippingPk);
      modalRef?.current?.close();
    };

    return (
      <Modal ref={modalRef}>
        <View style={{ paddingHorizontal: 16 }}>
          {shippingOption ? (
            <View>
              {shippingOption.map((option, index) => {
                const isSelected = selectedShipping === option.pk;
                const textColor = isSelected ? Colors.primary : Colors.text;

                return (
                  <View key={index}>
                    <Ripple
                      style={{
                        padding: 12,
                        backgroundColor: isSelected
                          ? applyFakeOpacity(Colors.primary, 0.3)
                          : Colors.background,
                        borderRadius: 4,
                      }}
                      onPress={() => onSetShipping(option.pk)}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={[Typography.title, { color: textColor }]}>{option.name}</Text>
                        <View style={{ flex: 1 }} />
                        <Text
                          style={[
                            Typography.name_button,
                            { color: textColor, textTransform: 'none' },
                          ]}>
                          {toPriceFormat(option.total)}
                        </Text>
                      </View>
                      <View style={{ height: 4 }} />
                      <Text style={[Typography.description, { color: textColor }]}>
                        Ngày giao: {`${moment(option?.lead_time).format('DD-MMMM')}`} | 9am-6pm
                      </Text>
                    </Ripple>
                    <View style={{ height: 12 }} />
                  </View>
                );
              })}
            </View>
          ) : (
            <GenericErrorView />
          )}
          <View style={{ height: 12 }} />
        </View>
      </Modal>
    );
  },
);
