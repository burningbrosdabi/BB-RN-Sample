import React from 'react';
import {SafeAreaView, View} from "react-native";
import {Header} from "components/header/Header";
import {FeedTab} from "scenes/feed/FeedTab";

export const FeedListScreen = () => {
    return <View style={{flex: 1}}>
        <SafeAreaView>
            <Header title={'Bản tin'}/>
        </SafeAreaView>
        <FeedTab/>
    </View>
}