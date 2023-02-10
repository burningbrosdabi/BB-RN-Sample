import { ButtonType } from 'components/button/Button';
import { isEmpty, pick, pickBy } from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, UIManager, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { OptionsMap, OptionType, StockData } from 'services/api/cart';
import { Colors, Spacing } from 'styles';
import { ConnectionState } from 'utils/hooks/useAsync';
import { ICart, IOptionContext, OptionContext } from './context';
import { OptionPickView } from './OptionPick';
import { ProductDetail } from 'model';
import { EmptyView } from 'components/empty/EmptyView';
import { CartSummary } from './CartSummary';

interface Props {
  onClose?: () => void;
  productData?: ProductDetail;
  visible: boolean;
  setCategory: () => void;
  connectionState: ConnectionState;
  data: [OptionsMap, StockData] | null;
  refresh: () => void;
}

interface MockProps {
  mockState?: ICart;
}

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const CartModal = ({
  onClose = () => {
    /*** */
  },
  visible,
  setCategory,
  data,
  productData,
  connectionState,
  refresh,
}: Props & MockProps) => {
  const [state, setState] = useState(connectionState);
  const [quantity, setQuantity] = useState<number>(1);
  const [initialOption, setInitialOption] = useState<
    { type: OptionType; key: string } | undefined
  >();
  const [selectedOptions, _setSelectedOptions] = useState<{
    [key in OptionType]?: string | undefined;
  }>({});
  const [stockData, setStockData] = useState<StockData>({});

  useEffect(() => {
    if (connectionState !== state) {
      setState(connectionState);
    }
  }, [connectionState]);

  const modalizeRef = useRef<Modalize>(null);

  const keys = useMemo(() => {
    return Object.keys(stockData).filter(stockKey => {
      const selectedKeys = Object.values(selectedOptions);
      return selectedKeys.every(k => stockKey.includes(k));
    });
  }, [stockData, selectedOptions]);

  const setSelectedOptions = (optionType: OptionType, value: string, reset?: boolean) => {
    if (!initialOption || reset) {
      setInitialOption({ type: optionType, key: value });
      _setSelectedOptions({ [optionType]: value });

      return;
    }
    if (initialOption && initialOption.type === optionType) {
      setInitialOption({ type: optionType, key: value });
      _setSelectedOptions({ [optionType]: value });
      return;
    } else if (selectedOptions[optionType] && selectedOptions[optionType] !== value) {
      selectedOptions[optionType] = value;
      _setSelectedOptions(pick(selectedOptions, [initialOption.type, optionType]));
      return;
    }
    selectedOptions[optionType] = value;
    _setSelectedOptions({ ...selectedOptions });
  };

  useEffect(() => {
    if (!data) return;
    const stock = data[1];
    setStockData(stock);
  }, [data]);

  const _refresh = () => {
    setQuantity(1);
    setInitialOption(undefined);
    _setSelectedOptions({});
    refresh();
  }

  const context = useMemo<IOptionContext>(
    () => ({
      quantity,
      setQuantity,
      optionData: data ? pickBy(data[0], value => !isEmpty(value)) : {},
      stockData,
      modalRef: modalizeRef.current,
      selectedOptions,
      setSelectedOptions,
      initialOption,
      availableKeys: keys,
      reset: _refresh,
    }),
    [keys, _refresh, stockData, quantity, data, modalizeRef.current, selectedOptions, initialOption],
  );

  useEffect(() => {
    if (visible) {
      modalizeRef.current?.open();
    } else {
      modalizeRef.current?.close();
    }
  }, [visible]);

  const selectSimilarProduct = () => {
    onClose();
    setCategory();
  };

  return (
    <Portal>
      <OptionContext.Provider value={context}>
        <Modalize
          panGestureEnabled={false}
          ref={modalizeRef}
          rootStyle={{ zIndex: 10, elevation: 10 }}
          scrollViewProps={{ showsVerticalScrollIndicator: false }}
          onClosed={onClose}
          adjustToContentHeight
          withHandle={false}>
          <_InnerCart state={state} onPress={selectSimilarProduct} data={productData} />

        </Modalize>
      </OptionContext.Provider>
    </Portal>
  );
};

export const _InnerCart = ({
  state,
  onPress,
  data,
}: {
  state: ConnectionState;
  onPress: () => void;
  data?: ProductDetail;
}) => {
  return (
    <View testID={'cart-modal-view'}>
      {(state === ConnectionState.waiting || state === ConnectionState.none) && (
        <View
          testID={'waiting-view'}
          style={{ height: Spacing.screen.height * 0.5, justifyContent: 'center' }}>
          <ActivityIndicator testID={'activity-indicator'} />
        </View>
      )}
      {(state === ConnectionState.hasError || state === ConnectionState.hasEmptyData) && (
        <View style={{ paddingHorizontal: 46, paddingVertical: 36 }}>
          <EmptyView
            file={require('/assets/images/empty/info_product.png')}
            title={'Ối, chuyện gì đang xảy ra!'}
            description={
              state === ConnectionState.hasEmptyData
                ? 'Sao không có lựa chọn nào cho chúng ta vậy!'
                : 'Hãy quay lại sau hoặc khám phá những sản phẩm tương tự nhé!'
            }
            action={{
              text: 'Sản phẩm tương tự',
              onPress,
              type: ButtonType.primary,
            }}
          />
        </View>
      )}
      {state === ConnectionState.hasData && (
        <View testID={'option-view'}>
          <OptionPickView />
          <CartSummary />
        </View>
      )}
    </View>
  );
};