import { useRoute } from '@react-navigation/native';
import { UpIcon } from 'assets/icons';
import { toast } from 'components/alert/toast';
import { Button, ButtonState, ButtonType, LayoutConstraint } from 'components/button/Button';
import { EmptyView } from 'components/empty/EmptyView';
import { ConnectionDetection } from 'components/empty/OfflineView';
import BackButton from 'components/header/BackButton';
import SearchBar from 'components/inputs/SearchBar';
import { get, isNil } from 'lodash';
import { ICoupon } from 'model/coupon/coupon';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { IVoucherRouteParam } from 'routes/voucher/voucher.route';
import { getVouchersList, searchVouchers } from 'services/api';
import { Colors, Outlines, Spacing, Typography } from 'styles';
import theme from 'styles/legacy/theme.style';
import { getUniqueListBy } from 'utils/helper';
import { useActions } from 'utils/hooks/useActions';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import CouponItem from './CouponItem';

const VoucherScreen = ({
  navigation,
  count = 20,
}: {
  navigation: any;

  count: number;
}) => {
  const voucherListRef = useRef(null);

  // get data from checkout page, shoud pass only sub_carts array
  // const { data = mockDataSubCarts } = route?.params || {};
  const route = useRoute();
  const { subcartSummary, setCoupon, selectedCoupon } = get(
    route,
    'params',
    {},
  ) as IVoucherRouteParam;
  if (!subcartSummary) {
    navigation.goBack();
  }

  const { vouchers } = useTypedSelector((state) => state.user);
  const { setVouchersList, setLoading, showDialog } = useActions();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchData, setSearchData] = useState<any>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [inProgressNetworkReq, setInProgressNetworkReq] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isDataEnd, setIsDataEnd] = useState(vouchers.length == 0);
  const [selectedItem, setSelectedItem] = useState<ICoupon | null>(selectedCoupon);

  useEffect(() => {
    _fetchMoreData(true);
  }, []);

  const _fetchMoreData = async (recreate = false) => {
    try {
      if (!inProgressNetworkReq) {
        setLoading(true);
        setInProgressNetworkReq(true);
        const { data: newData, totalCount } = await getVouchersList({
          offset: recreate ? 0 : offset,
        });
        setLoading(false);
        setInProgressNetworkReq(false);
        if (totalCount <= count || offset >= totalCount) {
          setIsDataEnd(true);
        }
        // Recreate Data
        if (recreate) {
          setVouchersList(newData);
          setOffset(count);
        } else {
          // Add Data
          const newList = getUniqueListBy(vouchers.concat(newData), 'id');
          setVouchersList(newList);
          setOffset(offset + count);
        }
      }
    } catch (error) {
      setLoading(false);
      showDialog({
        title: error.friendlyMessage,
        actions: [
          {
            type: ButtonType.primary,
            text: 'Ok',
            onPress: () => { },
          },
        ],
      });
    }
  };

  const _renderSearchbar = () => {
    return (
      <View style={styles.searchBoxContainer}>
        <SearchBar
          handleSearch={_handleSearch}
          handleInput={_handleInput}
          clearSearch={_clearSearch}
          searchKeyword={searchKeyword}
          returnKeyType={'go'}
          maxLength={6}
          placeholder="Nhập mã khuyến mãi"
        />
      </View>
    );
  };

  const _handleSearch = async () => {
    try {
      if (!searchKeyword) return;
      setSelectedItem(null);
      setLoading(true);
      const { data: newData } = await searchVouchers({
        code: searchKeyword,
      });
      setLoading(false);
      setIsSearching(!!newData?.length);
      toast(newData?.length > 0 ? 'Mã khuyến mãi được tìm thấy' : 'Mã khuyễn mãi không hợp lệ');
      setSearchData(newData);
    } catch (error) {
      setLoading(false);
      showDialog({
        title: error.friendlyMessage,
        actions: [
          {
            type: ButtonType.primary,
            text: 'Ok',
            onPress: () => { },
          },
        ],
      });
    }
  };

  const _clearSearch = () => {
    setSearchKeyword('');
    setSearchData([]);
    setIsSearching(false);
    setSelectedItem(null);
  };

  const _handleInput = (text: string) => {
    if (!text) setIsSearching(false);
    setSearchKeyword(text);
  };

  const _rowRenderer = ({ item, index }: { item: any; index: number }) => {
    const matchItems = subcartSummary ? subcartSummary.filter(
      (res) => Number(res.sub_cart_subtotal || 0) >= Number(item?.minimum_amount || 0),
    ) : [0];

    return (
      <>
        <CouponItem
          onSelectedItem={onSelectedItem}
          selectedItem={selectedItem}
          isActive={matchItems?.length > 0 && item?.availability > 0}
          data={item}
          style={{ marginBottom: vouchers.length - 1 === index ? 48 + 12 : 16 }}
        />
      </>
    );
  };

  const onSelectedItem = (item: any) => {
    if (item && item.id == selectedItem?.id) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
  };

  const _renderFooter = () => {
    return isDataEnd || searchKeyword ? (
      <View style={{ height: 37 * Spacing.AUTH_RATIO_H + 48 }} />
    ) : (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 40,
        }}>
        <ActivityIndicator />
      </View>
    );
  };

  const _renderEmpty = useCallback(() => {
    return (
      <View style={styles.emptyView}>
        <EmptyView
          title={'Bạn chưa có khuyến mãi nào!'}
          titleStyle={{ marginTop: 12, fontSize: 16 }}
          description={'Nếu bạn có mã khuyễn mãi hãy nhập vào\nô bên trên'}
          descriptionStyle={{ marginTop: 6 }}
          file={require('_assets/images/icon/info_coupon.png')}
          style={{ flex: undefined }}
        />
      </View>
    );
  }, []);

  const handleListEnd = async () => {
    console.log(isDataEnd);

    if (!isDataEnd && !searchKeyword) {
      await _fetchMoreData();
    }
  };

  const onGotoTop = () => {
    voucherListRef?.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });
  };

  const onApplyVoucher = () => {
    const { pk = null } = (selectedItem ?? {}) as ICoupon;

    if (!pk || isNil(selectedItem)) return;
    setCoupon && setCoupon(selectedItem);
    navigation.goBack();
  };

  const onRefresh = async () => {
    setIsDataEnd(false);
    await _fetchMoreData(true);
  };

  return (
    <ConnectionDetection.View>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={{ position: 'absolute', left: 0 }}>
            <BackButton mode={'cancel'} />
          </View>
          <Text numberOfLines={1} style={[Typography.title, styles.titleStyle]}>
            {'Chọn khuyến mãi'}
          </Text>
        </View>
        {_renderSearchbar()}
        <Text style={styles.subtitle}> {'Mã khuyến mãi'} </Text>
        <View style={styles.container}>
          <FlatList
            ref={voucherListRef}
            showsVerticalScrollIndicator={false}
            data={isSearching ? searchData : vouchers}
            renderItem={_rowRenderer}
            ListFooterComponent={_renderFooter}
            ListEmptyComponent={_renderEmpty}
            onEndReached={handleListEnd}
            onEndReachedThreshold={0.05}
            refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
            keyExtractor={(item: any) => `${item.id}`}
          />
        </View>
        <View style={styles.nextButton}>
          <Button
            type={ButtonType.primary}
            constraint={LayoutConstraint.matchParent}
            state={!selectedItem ? ButtonState.disabled : ButtonState.idle}
            onPress={onApplyVoucher}
            disabled={!selectedItem}
            text={'Sử dụng'}
          />
        </View>
        {vouchers.length > 0 ? (
          <View style={styles.upIconContainer}>
            <TouchableOpacity onPress={onGotoTop} style={{ alignItems: 'center' }}>
              <View style={[styles.buttonContainer]}>
                <UpIcon />
              </View>
            </TouchableOpacity>
          </View>
        ) : undefined}
      </SafeAreaView>
    </ConnectionDetection.View>
  );
};

export default React.memo(VoucherScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleStyle: {
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.name_button,
    marginLeft: 16,
    marginBottom: 12,
  },
  searchBoxContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: Spacing.screen.width,
    borderBottomWidth: 4,
    borderColor: Colors.background,
    marginBottom: 12,
  },
  newAddressButton: {
    height: 48,
    width: Spacing.screen.width - 32,
    borderRadius: 4,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.boxLine,
    marginBottom: 12,
  },
  header: {
    height: 48,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextButton: {
    width: Spacing.screen.width - 32,
    marginLeft: 16,
    position: 'absolute',
    bottom: 0,
    paddingBottom: 37 * Spacing.AUTH_RATIO_H,
    backgroundColor: 'white',
    paddingTop: 12,
  },
  buttonContainer: {
    padding: 8,
    zIndex: 500,
    backgroundColor: theme.WHITE,
    borderWidth: Outlines.borderWidth.base,
    borderColor: theme.LIGHT_GRAY,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    borderRadius: 50,
  },
  upIconContainer: {
    zIndex: 1000,
    position: 'absolute',
    bottom: 37 * Spacing.AUTH_RATIO_H + 48 + 12,
    right: theme.MARGIN_20,
    alignItems: 'center',
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: Spacing.screen.height - 220 * Spacing.AUTH_RATIO_H - getStatusBarHeight(),
  },
});
