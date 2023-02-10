import TipsTab from "scenes/home/magazine/MagazineListTab";
import React, { useContext, useEffect } from 'react';
import { SafeAreaView, View, Text } from "react-native";
import { Header } from "components/header/Header";
import { useRoute } from "@react-navigation/native";
import { RoutePath } from "routes";
import { Typography } from "styles";
import { JobType } from "services/apptour/type";
import { FeatureDiscoveryContext } from "components/tutorial/context";
import { storeKey } from "utils/constant";
import { AppTourContext } from "services/apptour/context";
import { FeatureMeasurement } from "components/tutorial";

export const MagazinesScreen = () => {
    const route = useRoute();
    const { jobs } = useContext(AppTourContext);
    const { discover } = useContext(FeatureDiscoveryContext);

    // useEffect(() => {
    //     discover(storeKey.magazineFeatureDiscovery)
    // }, []);


    return <View style={{ flex: 1 }}>
        <SafeAreaView>
            {route.name === RoutePath.magazineList ? <SafeAreaView>
                <View style={{ paddingLeft: 16, paddingVertical: 12, alignItems: 'flex-start' }}>
                    <FeatureMeasurement
                        id={'mix-match'}
                        title={'Trở thành tín đồ thời trang với những tips siêu hot 😎'}
                        description={
                            'Bạn chưa biết cách phối đồ như thế nào cho bắt mắt? Hãy để Dabi giúp bạn nhé!!'
                        }
                        overlay={
                            <View
                                style={{
                                    justifyContent: 'center', alignItems: 'center',
                                    paddingHorizontal: 6,
                                    width: 200,
                                }} >
                                <View style={{ paddingTop: 4, borderTopWidth: 4, marginTop: 8 }}>
                                    <Text style={Typography.h1}>Mix-Match</Text>
                                </View>
                            </View>
                        }>
                        <View style={{ borderTopWidth: 4, paddingTop: 4, marginTop: 8 }}>
                            <Text style={Typography.h1}>Mix-Match</Text>
                        </View>
                    </FeatureMeasurement>
                </View>
            </SafeAreaView> : <Header title={'Mix-Match'} />}
        </SafeAreaView>
        <TipsTab />
    </View>
}