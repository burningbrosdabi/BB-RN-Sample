import React, { useEffect, useMemo } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { List } from 'components/list/product/ProductList.v2';
import { ProductFilter } from "components/list/product/filter";
import { getProductList, getUserPickProducts, getUserPickRecommendation, PickType } from "_api";
import { useRoute } from "@react-navigation/native";
import { get } from "lodash";
import ProductListHorizontal, { ProductListHorizontalPlaceholder } from "components/list/product/ProductListHorizontal";
import { ConnectionState, useAsync } from "utils/hooks/useAsync";
import { useNavigator } from "services/navigation/navigation.service";
import { PickHistoryRouteSetting } from "routes/pick/pick.route";
import { EmptyView } from "components/empty/EmptyView";
import { ProductInfo } from 'model';
import { Header } from 'components/header/Header';
import { Colors, Outlines, Typography } from 'styles';
import { numberWithDots } from 'utils/helper';

const _Screen = () => {
    const { params } = useRoute();
    const storePk = get(params, 'storePk')
    const { controller, fetch, count } = List.useHandler({ isDiscount: true, storePk });

    return <View style={{ flex: 1 }}><SafeAreaView >
        <Header title={'Thông tin khuyến mãi'} />
    </SafeAreaView>

        <List.Product
            controller={controller}
            customItemBuilder={
                {
                    HasEmptyDataView: <EmptyView
                        title={'Không có gợi ý nào'}
                        description={'Bạn hãy chờ dabi cập nhật thêm nhiều sản phẩm nhé!'}
                        // tslint:disable-next-line: no-unsafe-any
                        file={require('assets/images/empty/info_product.png')}
                    />
                }
            }
            fetch={fetch}
            HeaderComponent={<_Header count={count} />}

        /></View>
}

const _Header = ({ count }: { count: number }) => {
    return (
        <View style={{ width: '100%', height: 28 + 12 * 2 + 36 }}>
            <View style={{ height: 12 }} />
            <ProductFilter.ActionGroup />
            <View style={{
                borderBottomWidth: Outlines.borderWidth.base,
                borderBottomColor: Colors.line,
                marginTop: 12, marginBottom: 11
            }} />
            <View style={styles.orderingTab}>
                <Text style={Typography.description}>{numberWithDots(count)} kết quả </Text>
                <ProductFilter.OrderingBtn />
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    orderingTab: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export const SaleProductListScreen = ProductFilter.HOC(_Screen)