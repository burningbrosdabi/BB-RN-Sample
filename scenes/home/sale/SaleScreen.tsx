import TipsTab from "scenes/home/magazine/MagazineListTab";
import React from 'react';
import { SafeAreaView, View } from "react-native";
import { Header } from "components/header/Header";
import SaleListTab from "./SaleListTab";
import {useRoute} from "@react-navigation/native";
import {get} from "lodash";

export const SaleScreen = () => {
    const route = useRoute();
    const is_ended = get(route, 'params.is_ended');
    return <View style={{ flex: 1 }}>
        <SafeAreaView>
            <Header title={is_ended ? "Khuyến mãi đã kết thúc":'Đang giảm giá'} />
        </SafeAreaView>
        <SaleListTab is_ended={is_ended} />
    </View>
}   