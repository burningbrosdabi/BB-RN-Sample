import DabiFont from 'assets/icons/dabi.fonts';
import { toast } from 'components/alert/toast';
import Button, { ButtonState, ButtonType } from 'components/button/Button';
import { CheckBox } from 'components/button/CheckBox';
import { IconButton } from 'components/button/IconButton';
import { CartErrorCode, HandledError } from 'error';
import { isEmpty, last, unset } from 'lodash';
import React, { memo, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  SectionList,
  SectionListData,
  SectionListRenderItem,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Ripple from 'react-native-material-ripple';
import { PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { clearCart, clearMultiCartItem } from 'services/api/cart/cart.api';
import { useCheckout } from 'services/checkout/useCheckout';
import { useNavigator } from 'services/navigation/navigation.service';
import { applyFakeOpacity, Colors, Typography } from 'styles';
import { sleep, toPriceFormat } from 'utils/helper';
import { useActions } from 'utils/hooks/useActions';
import { OptionItem } from './CartListItem';
import { CartContext } from './context';

type SectionRenderHeader = (info: {
  section: SectionListData<
    string,
    {
      store: string;
      data: string[];
    }
  >;
}) => React.ReactElement<any, string>;

type RenderItem = SectionListRenderItem<
  string,
  {
    store: string;
    data: string[];
  }
>;

const WARNING_INCLUDE_SOLDOUT_HEIGHT = 40;
const FOOTER_HEIGHT = 86 + WARNING_INCLUDE_SOLDOUT_HEIGHT;

const _CartList = ({ refresh }: { refresh: () => Promise<void> }) => {
  const keyExtractor = (item: string, index: number) => `${item}.${index}`;
  const { index } = useContext(CartContext);
  const [refreshing, setRefreshing] = useState(false);

  const data = useMemo(() => {
    return Object.entries(index).map(([key, value]) => {
      return {
        store: key,
        data: Object.keys(value),
      };
    });
  }, [index]);

  const renderFooter: SectionRenderHeader = ({ section }) => {
    return last(data)?.store === section.store ? <View style={{ height: FOOTER_HEIGHT }} /> : <></>;
  };

  const renderItem: RenderItem = ({ item: optionId, section, index }) => (
    <OptionItem i={index} id={`${section.store}.${optionId}`} />
  );

  const renderHeader: SectionRenderHeader = ({ section: { store } }) => (
    <SectionHeader id={store} />
  );

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await refresh();
    } catch (_) {
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ActionHeader />
      <SectionList
        refreshing={refreshing}
        onRefresh={onRefresh}
        sections={data}
        keyExtractor={keyExtractor}
        renderSectionFooter={renderFooter}
        renderItem={renderItem}
        renderSectionHeader={renderHeader}
      />
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
        }}>
        <CartSummary />
      </View>
    </View>
  );
};

export const CartList = memo(_CartList);

const ActionHeader = () => {
  const {
    selectedOption,
    index,
    setIndex,
    option,
    setOptions,
    setSelectedOption,
    cartPk,
  } = useContext(CartContext);
  const { showDialog, setLoading } = useActions();
  const hasAnySelectedOption = useMemo(() => {
    return Object.values(selectedOption).some((value) => !!value);
  }, [selectedOption]);

  const selectedAll = useMemo(() => {
    for (const key of Object.keys(option)) {
      if (!selectedOption[key]) return false;
    }

    return Object.keys(option).length > 0 && true;
  }, [selectedOption, option]);

  const onDelete = () => {
    showDialog({
      title: 'Bạn muốn xóa sản phẩm này\nra khỏi giỏ hàng?',
      actions: [
        {
          text: 'XÓA',
          onPress: confirmRemove,
          type: ButtonType.primary,
        },
        {
          text: 'Giữ lại',
          onPress: () => { },
          type: ButtonType.flat,
          textStyle: { color: Colors.primary },
        },
      ],
    });
  };

  const onClearCart = async (): Promise<void> => {
    try {
      await clearCart(cartPk);
    } catch (e) {
      throw new HandledError({
        error: e as Error,
        stack: 'CartList.onClearCart',
      });
    }
  };

  const onClearItem = async (ids: string[]): Promise<void> => {
    try {
      const _ids = ids.map((id) => id.split('.')[1]?.replace('$', '') ?? '');
      const errorMap = await clearMultiCartItem(_ids);
      if (errorMap) {
        throw new HandledError({
          error: new Error(),
          stack: 'ActionHeader.onClearItem',
          code: CartErrorCode.FAILED_TO_REMOVE_SOME_ITEM,
        });
      }
    } catch (e) {
      throw new HandledError({
        error: e as Error,
        stack: 'ActionHeader.onClearItem',
      });
    }
  };

  const confirmRemove = async () => {
    try {
      const selectedIds = Object.keys(selectedOption).filter((key) => {
        return selectedOption[key];
      });
      setLoading(true);
      if (selectedAll) {
        await onClearCart();
      } else {
        await onClearItem(selectedIds);
      }
      // adding a delay for prevent conflict with dialog.
      await sleep(500);
      setLoading(false);

      selectedIds.forEach((key) => {
        if (selectedOption[key]) {
          unset(index, key);
          delete option[key];
          delete selectedOption[key];
        }
        const [store] = key.split('.');
        if (isEmpty(index[store])) {
          delete index[store];
        }
      });

      setSelectedOption({ ...selectedOption });
      setIndex({ ...index });
      setOptions({ ...option });

      toast('Sản phẩm đã được xóa');
    } catch (e) {
      setLoading(false);
      const error = new HandledError({
        error: e as Error,
        stack: 'ActionHeader.confirmRemove',
      });
      showDialog({
        title: error.friendlyMessage,
        actions: [{ text: 'OK', onPress: () => { } }],
      });
      error.log(true);
    }
  };

  const onSelectAll = () => {
    Object.keys(option).forEach((key) => {
      if (selectedAll) {
        delete selectedOption[key];
      } else selectedOption[key] = true;
    });
    setSelectedOption({ ...selectedOption });
  };

  return (
    <View style={styles.actionHeaderContainer}>
      <Ripple
        rippleContainerBorderRadius={4}
        onPress={onSelectAll}
        style={styles.checkboxContainer}>
        <CheckBox value={selectedAll} toogle={() => { }} />
        <View style={{ width: 12 }} />
        <Text style={Typography.option}>{selectedAll ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}</Text>
      </Ripple>
      <View style={{ flex: 1 }} />
      <IconButton state={!hasAnySelectedOption ? ButtonState.disabled : ButtonState.idle} icon={'bin'} onPress={onDelete} />
    </View>
  );
};

const SectionHeader = ({ id }: { id: string }) => {
  const { store, index } = useContext(CartContext);

  const { selectedOption, setSelectedOption, option } = useContext(CartContext);
  const _store = store[id] ?? {};

  const selected = useMemo(() => {
    const storeOptionIds = Object.keys(index[id] ?? []).map((k) => `${id}.${k}`);

    const optionIds = Object.keys(selectedOption).filter((key) => {
      return !!selectedOption[key] && storeOptionIds.indexOf(key) >= 0;
    });

    return optionIds.length === storeOptionIds.length;
  }, [selectedOption, index, option]);

  const toogle = () => {
    const storeOptionIds = Object.keys(index[id]).map((k) => `${id}.${k}`);
    storeOptionIds.forEach((key) => {
      selectedOption[key] = !selected;
    });

    setSelectedOption({ ...selectedOption });
  };

  return (
    <View style={styles.sectionHeaderContainer}>
      <CheckBox value={selected} toogle={toogle} />
      <View style={{ width: 12 }} />
      <Image style={styles.storeImage} source={{ uri: _store.profile_image ?? '' }} />
      <View style={{ width: 12 }} />
      <View style={{ flex: 1 }}>
        <Text style={Typography.option} numberOfLines={2}>{_store.insta_id}l</Text>
      </View>
    </View>
  );
};

enum StockState {
  outStock,
  exceedStock,
}

const CartSummary = () => {
  const { option, selectedOption } = useContext(CartContext);
  const [total, setTotal] = useState(0);
  const { showDialog } = useActions();
  const [stockStateMap, setStockStateMap] = useState<{ [id: string]: StockState }>({});

  const hasSelection = useMemo(
    () => Object.entries(selectedOption ?? {}).filter(([_, value]) => value).length > 0,
    [selectedOption],
  );

  const [hasOutStock, hasExceedStock] = useMemo(() => {
    const hasOutStock = Object.values(stockStateMap).some((value) => value === StockState.outStock);
    const hasExceedStock = Object.values(stockStateMap).some(
      (value) => value === StockState.exceedStock,
    );
    return [hasOutStock, hasExceedStock];
  }, [stockStateMap]);

  const hasSoldOutAnim = useRef(new Animated.Value(0));

  const navigator = useNavigator();

  useEffect(() => {
    Animated.timing(hasSoldOutAnim.current, {
      toValue: hasOutStock ? 1 : 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [hasOutStock]);

  useEffect(() => {
    let hasSoldOut = false;
    let hasExceed = false;
    let total = 0;
    const stockStateMap: { [id: string]: StockState } = {};
    for (const key of Object.keys(selectedOption)) {
      const opt = option[key];

      hasSoldOut = opt.stock <= 0 && selectedOption[key];
      hasExceed = opt.stock < opt.quantity && selectedOption[key];

      if (!hasSoldOut && selectedOption[key]) {
        total += opt.quantity * opt.finalPrice;
      }
      if (hasSoldOut) {
        stockStateMap[key] = StockState.outStock;
      } else if (hasExceed) {
        stockStateMap[key] = StockState.exceedStock;
      }
    }
    setTotal(total);
    setStockStateMap(stockStateMap);
  }, [option, selectedOption]);

  const stockStateValues = Object.values(stockStateMap);

  const checkout = useCheckout();

  const _getCheckoutDigest = () => {
    const ids = Object.keys(selectedOption)
      .filter((key) => selectedOption[key])
      .map((key) => option[key].item_id);

    return checkout({ item_ids: ids });
  };

  // const { state: connectionState, error, excecute } = useAsync(_getCheckoutDigest);

  const onCheckout = async () => {
    try {
      const isValid = verifyOptions();
      if (!isValid) return;
      await _getCheckoutDigest();
    } catch (error) {
      const _error = new HandledError({
        error: error as Error,
        stack: 'CartSummary.onDirectlyCheckout',
      });
      showDialog({
        title: 'Không thể thực hiện mua hàng',
        description: _error.friendlyMessage,
        actions: [{ text: 'OK', onPress: () => { } }],
      });
    }
  };

  const verifyOptions = () => {
    const allOutOfStock =
      !isEmpty(stockStateMap) &&
      stockStateValues.every((stockState) => stockState === StockState.outStock) &&
      stockStateValues.length === Object.values(selectedOption).filter((val) => val).length;

    if (allOutOfStock) {
      toast('Sản phẩm bạn chọn đều đã hết hàng');

      return false;
    }

    if (hasOutStock) {
      showDialog({
        title: 'Những sản phẩm đã hết hàng sẽ không được thêm vào bước thanh toán',
        actions: [
          {
            text: 'Xác nhận',
            onPress: () => { },
          },
          {
            text: 'Hủy',
            color: Colors.primary,
            type: ButtonType.flat,
            textStyle: { color: Colors.primary },
            onPress: () => { },
          },
        ],
      });

      return false;
    }
    if (hasExceedStock) {
      showDialog({
        title: 'Không thể mua hàng',
        description:
          'Bạn vui lòng điều chỉnh lại số lượng những sản phẩm vượt quá số lượng trong kho nhé.',
        actions: [
          {
            text: 'Xác nhận',
            onPress: () => { },
          },
        ],
      });

      return false;
    }

    return true;
  };

  return (
    <Animated.View
      style={[
        styles.summaryContainer,
        {
          transform: [
            {
              translateY: hasSoldOutAnim.current.interpolate({
                inputRange: [0, 1],
                outputRange: [WARNING_INCLUDE_SOLDOUT_HEIGHT, 0],
              }),
            },
          ],
        },
      ]}>
      <View style={styles.summaryContent}>
        <View style={styles.summaryInfo}>
          <Text style={Typography.description}>Tổng cộng</Text>
          <Text style={[Typography.title, { color: Colors.primary, textTransform: 'none' }]}>{toPriceFormat(total)}</Text>
        </View>
        <View style={{ width: 12 }} />
        <View style={{ flex: 1, height: 48 }}>
          <Button
            state={hasSelection ? ButtonState.idle : ButtonState.disabled}
            text={'MUA HÀNG'}
            onPress={onCheckout}
          />
        </View>
      </View>
      <View style={{ height: 12 }} />
      <Animated.View
        style={[
          styles.priceNoticedContainer,
          {
            opacity: hasSoldOutAnim.current,
          },
        ]}>
        <Text style={[Typography.description, { color: '#83B6EF' }]}>
          {'Không bao gồm giá sản phẩm đã hết hàng'}
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

export const CartSummaryPlaceholder = () => {
  return (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryContent}>
        <View style={styles.summaryInfo}>
          <PlaceholderLine
            noMargin
            height={16}
            style={{ width: 80, backgroundColor: Colors.surface.white }}
          />
          <View style={{ height: 8 }} />
          <PlaceholderLine
            noMargin
            height={16}
            style={{ width: 120, backgroundColor: Colors.surface.white }}
          />
        </View>
        <View style={{ width: 12 }} />
        <PlaceholderMedia style={{ flex: 1, height: 48, backgroundColor: Colors.surface.white }} />
      </View>
      <View style={{ height: 12 }} />
    </View>
  );
};

export const ActionHeaderPlaceholder = () => {
  return (
    <View style={styles.actionHeaderContainer}>
      <View style={styles.checkboxContainer}>
        <CheckBox color={Colors.background} value={false} toogle={() => { }} />
        <View style={{ width: 12 }} />
        <PlaceholderLine
          noMargin
          height={16}
          style={{ width: 80, backgroundColor: Colors.surface.white }}
        />
      </View>
      <View style={{ flex: 1 }} />
      <DabiFont name={'bin'} color={Colors.button} size={24} />
    </View>
  );
};

export const SectionHeaderPlaceholder = () => {
  return (
    <View style={styles.sectionHeaderContainer}>
      <CheckBox color={Colors.background} value={false} toogle={() => { }} />
      <View style={{ width: 12 }} />
      <PlaceholderMedia style={[styles.storeImage, { backgroundColor: Colors.surface.white }]} />
      <View style={{ width: 12 }} />
      <PlaceholderLine
        noMargin
        height={16}
        style={{ width: 80, backgroundColor: Colors.surface.white }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeaderContainer: {
    height: 64,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderRightWidth: 0,
    borderBottomColor: Colors.line,
    backgroundColor: Colors.white,
  },
  storeImage: {
    width: 40,
    height: 40,
    backgroundColor: Colors.background,
    borderRadius: 20,
  },
  actionHeaderContainer: {
    height: 54,
    flexDirection: 'row',
    borderBottomWidth: 4,
    borderBottomColor: Colors.line,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 4,
    transform: [
      {
        translateX: -4,
      },
    ],
  },
  summaryContainer: {
    paddingTop: 12,
    borderTopColor: Colors.line,
    borderTopWidth: 1,
    backgroundColor: Colors.white,
  },
  summaryContent: { height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  summaryInfo: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 48,
  },
  priceNoticedContainer: {
    height: 40,
    backgroundColor: applyFakeOpacity('#83B6EF', 0.3),
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
});
