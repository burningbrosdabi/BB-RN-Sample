import DabiFont from 'assets/icons/dabi.fonts';
import { ButtonType } from 'components/button/Button';
import { EmptyView, GenericErrorView } from 'components/empty/EmptyView';
import { ConnectionDetection } from 'components/empty/OfflineView';

import HandledError from 'error/error';
import { isEmpty, range } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { Fade, Placeholder } from 'rn-placeholder';
import { CartData, getUserCart, IndexMap, OptionMap } from 'services/api/cart';
import { NavigationService } from 'services/navigation';
import { Colors, Spacing, Typography } from 'styles';
import { useAnimatedState } from 'utils/hooks/useAnimatedState';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import {
  ActionHeaderPlaceholder,
  CartList,
  CartSummaryPlaceholder,
  SectionHeaderPlaceholder,
} from './CartList';
import { OptionItemPlaceholder } from './CartListItem';
import { CartContext } from './context';
import { Header } from 'components/header/Header';

export const CartScreen = () => {
  const { state, data, excecute, refresh, error } = useAsync<CartData>(getUserCart, {
    emptyDataLogical: ({ index }: CartData) => isEmpty(index),
    animated: true,
  });

  const [options, setOptions] = useAnimatedState<OptionMap>({});
  const [selectedOption, setSelectedOption] = useState<{ [id: string]: boolean }>({});
  const [index, setIndex] = useAnimatedState<IndexMap>({});

  const context = useMemo(() => {
    const { store = {}, cartPk } = data ?? {};

    return {
      index,
      option: options,
      store,
      setOptions,
      selectedOption,
      setSelectedOption,
      setIndex,
      cartPk,
    };
  }, [data, options, selectedOption, index]);

  useEffect(() => {
    excecute();
  }, []);

  useEffect(() => {
    setOptions(data?.option ?? {});
    setIndex(data?.index ?? {});
  }, [data]);

  useEffect(() => {
    if (state === ConnectionState.hasError) {
      new HandledError({
        error: error as Error,
        stack: 'CartScreen.useEffect',
      }).log(true);
    }
  }, [state]);

  const render = () => {
    switch (state) {
      case ConnectionState.waiting:
        return <PlaceholderScreen />;
      case ConnectionState.hasData:
        if (!isEmpty(data) && !isEmpty(options)) {
          return (
            <CartContext.Provider value={context}>
              <View style={{ flex: 1 }}>
                <CartList refresh={refresh} />
              </View>
            </CartContext.Provider>
          );
        }
      // if empty jump to empty case
      case ConnectionState.hasEmptyData:
        return (
          <View style={{ flex: 1 }}>
            <EmptyView
              file={require('/assets/images/empty/empty_cart.png')}
              title={'Bạn chưa có gì trong giỏ'}
              description={'Hãy lướt Dabi và mua sắm thật nhiều nhé!'}
            />
          </View>
        );
      case ConnectionState.hasError:
        return (
          <ScrollView
            contentContainerStyle={{ flex: 1 }}
            refreshControl={<RefreshControl refreshing={false} onRefresh={excecute} />}>
            <GenericErrorView />
          </ScrollView>
        );
      case ConnectionState.none:
      default:
        return <View style={{ flex: 1 }} />;
    }
  };

  const onPress = () => NavigationService.instance.goBack();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <Header mode={'cancel'} title={'Giỏ hàng của tôi'} />
        </View>
        <ConnectionDetection.View>{render()}</ConnectionDetection.View>
      </View>
    </SafeAreaView>
  );
};

const PlaceholderScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <Placeholder Animation={Fade} style={{ flex: 1 }}>
        <ActionHeaderPlaceholder />
        <SectionHeaderPlaceholder />

        {range(4).map(k => (
          <OptionItemPlaceholder key={`${k}`} />
        ))}
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 86 }}>
          <CartSummaryPlaceholder />
        </View>
      </Placeholder>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    borderBottomWidth:1,
    borderBottomColor: Colors.line
  },
  headerBackBtnContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingRight: 16,
    flexDirection: 'row',
    width: Spacing.screen.width,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: Colors.boxLine,
    borderBottomWidth: 1,
  },
});
