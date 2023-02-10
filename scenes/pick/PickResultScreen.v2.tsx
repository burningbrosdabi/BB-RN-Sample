import { useRoute } from '@react-navigation/native';
import { Header } from "components/header/Header";
import { TabBar } from "components/tabbar/TabBar";
import { get } from 'lodash';
import React, { useCallback, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { NavigationState, Route, SceneRendererProps, TabView } from "react-native-tab-view";
import { PickRecommendRouteSetting } from 'routes/pick/pick.route';
import { PickRecommendationTab } from "scenes/pick/PickRecomendation";
import { useNavigator } from 'services/navigation/navigation.service';
import { Spacing } from "styles";
import { PickType } from '_api';
import { PickAnalysis } from './pickResult/PickAnalysis';


const PickAnalysisScreen = () => {
    const [index, setIndex] = useState(0);
    const { params } = useRoute();
    const type: PickType = get(params, 'type', PickType.IN6);

    const [routes] = useState<Route[]>([
        {
            key: 'analysis',
            title: 'Phân tích'
        },
        {
            key: 'recommend',
            title: 'Gợi ý'
        },

    ]);

    const navigateRecommend = () => {
        navigation.navigate(new PickRecommendRouteSetting())
        setIndex(1);
    }

    const renderScene = <T extends Route>({
        route,
    }: SceneRendererProps & {
        route: Route;
    }) => {
        switch (route.key) {
            case 'recommend':
                return <PickRecommendationTab type={type} />
            case 'analysis':
                return
            default:
                return null;
        }
    };

    const navigation = useNavigator()
    const onBack = () => {
        navigation.backToRoot()
    }
    return <View style={{ flex: 1 }}>
        <SafeAreaView>
            <Header title={'Phong cách của bạn'} onBack={onBack} />
        </SafeAreaView>
        <PickAnalysis navigateRecommend={navigateRecommend} />
    </View>

};

export default PickAnalysisScreen;
