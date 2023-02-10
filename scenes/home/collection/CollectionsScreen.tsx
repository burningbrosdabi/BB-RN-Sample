import React from 'react'
import {SafeAreaView, ScrollView, View} from "react-native";
import {Collections} from "scenes/home/collection/Collections";
import {Header} from "components/header/Header";

export const CollectionsScreen = () => {
    return <View style={{flex: 1}}>
        <SafeAreaView>
            <Header title={'Bộ sưu tập'}/>
        </SafeAreaView>
        <ScrollView>
            <Collections/>
            <View style={{height: 36}}/>
        </ScrollView>
    </View>
}