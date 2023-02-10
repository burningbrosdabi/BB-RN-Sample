import React, { useEffect, useMemo } from 'react';
import { SafeAreaView, Text, View } from "react-native";
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
import { Header } from 'components/header/Header';
import { Colors, Outlines, Typography } from 'styles';
import { numberWithDots } from 'utils/helper';

const _Screen = () => {
    const { params = {} } = useRoute();
    const type = get(params, 'type', PickType.IN6);
    return <View style={{ flex: 1 }}><SafeAreaView>
        <Header title={'Trang phục gợi ý'} /></SafeAreaView>
        <PickRecommendationTab type={type} />
    </View>
}

export const PickRecommendationTab = ({ type }: { type: PickType }) => {
    const { controller, fetch, count } = List.useHandler({ pickType: type, });

    return <List.Product
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

    />
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
            <View style={{
                flexDirection: 'row',
                paddingHorizontal: 16,
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <Text style={Typography.description}>{numberWithDots(count)} kết quả </Text>
                <ProductFilter.OrderingBtn />
            </View>
        </View>
    );
}
export const PickRecommendationScreen = ProductFilter.HOC(_Screen)