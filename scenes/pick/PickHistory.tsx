import React from 'react';
import {List} from 'components/list/product/ProductList.v2';
import {SafeAreaView, Text, View} from "react-native";
import {Header} from "components/header/Header";
import {Typography} from "styles";
import {numberWithDots} from 'utils/helper';
import {getUserPickProducts} from "_api";

export const PickHistory = () => {
    const {fetch, count} = List.useHandler(undefined, ({offset}) => getUserPickProducts({offset}));

    return <View style={{flex: 1}}>
        <SafeAreaView>
            <Header title={'Sản phẩm đã chọn'}/>
        </SafeAreaView>
        <List.Product HeaderComponent={<View style={{paddingHorizontal: 16, paddingTop: 12}}>
            <Text style={Typography.description}>{numberWithDots(count)} kết quả</Text>
        </View>} fetch={fetch}/>
    </View>
}