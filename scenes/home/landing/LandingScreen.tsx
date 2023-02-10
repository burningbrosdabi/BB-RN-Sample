import {useRoute} from '@react-navigation/native';
import {FlashSaleTimmer} from 'components/timmer/FlashSaleTimmer';
import {get, isEmpty, isNil} from 'lodash';
import {Collection, CollectionType, FlashSaleCollection} from 'model/collection/collection';
import React, {useMemo, useRef, useState} from 'react';
import {Image, ImageRequireSource, Text, View, Animated, ImageBackground} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {getCollectionDefaultStyle} from 'scenes/home/collection/CollectionContainer';
import {Colors, Typography} from 'styles';
import {ProductLanding} from './ProductLanding';
import {StoreLanding} from './StoreLanding';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {ScrollEvent} from 'recyclerlistview/dist/reactnative/core/scrollcomponent/BaseScrollView';
import {Animation} from 'components/animation';
import {ConnectionDetection} from 'components/empty/OfflineView';
import {GenericErrorView} from 'components/empty/EmptyView';
import {useAsync} from "utils/hooks/useAsync";
import {getCollectionByIdType} from "_api";
import {CollectionLandingContext} from "scenes/home/landing/context";

export const LandingScreen = () => {
    const {params} = useRoute();

    const type = get(params, 'type', null) as CollectionType;
    const id = get(params, 'id', null);
    const [collection, setCollection] = useState<Collection>()

    if (!type || !id) return <GenericErrorView/>;
    const animation = useRef(new Animated.Value(0)).current;

    const _onScroll = (rawEvent: ScrollEvent, _: number, __: number) => {
        if (rawEvent.nativeEvent.contentOffset.y < 0) return;
        Animated.event(
            [
                {
                    nativeEvent: {
                        contentOffset: {
                            y: animation,
                        },
                    },
                },
            ],
        )(rawEvent);
    };

    const children = useMemo(() => {
        if (type === CollectionType.flash_sale || type === CollectionType.product) {
            return <ProductLanding type={type} id={id} onScroll={_onScroll}/>;
        }

        return <StoreLanding id={id} onScroll={_onScroll}/>;
    }, [type]);

    return (
        <CollectionLandingContext.Provider
            value={{collection, setCollection}}>
            <View style={{flex: 1}}>
                <ConnectionDetection.View>
                    <View style={{flex: 1}}>{children}</View>
                </ConnectionDetection.View>
                <Animation.Header trailing={false} animation={animation} title={collection?.title ?? ''}/>
            </View>
        </CollectionLandingContext.Provider>
    );
};