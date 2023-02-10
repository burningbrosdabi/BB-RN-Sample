import {PaggingScrollList} from 'components/list/InfiniteScrollList';
import {ListController, ListOnScroll} from 'components/list/ListController';
import {RenderProps} from 'components/list/RenderProps';
import {range} from 'lodash';
import {StoreLandingItem} from 'model/collection/collection.item';
import React, {useEffect, useMemo, useRef} from 'react';
import {View} from 'react-native';
import {Fade, Placeholder} from 'rn-placeholder';
import {getStoreCollection} from 'services/api/collection';
import {Spacing} from 'styles';
import {Item, ItemPlaceholder} from './StoreLanding.item';
import {ConnectionState} from "utils/hooks/useAsync";
import {Banner} from "scenes/home/landing/Banner";
import {CollectionType} from "model/collection";

export const StoreLanding = ({
                                 id,
                                 onScroll,
                             }: {
    id: number;
    onScroll: ListOnScroll;
}) => {
    const fetch = (next?: string) => {
        return getStoreCollection(id, next);
    };
    const controller = useRef(new ListController<StoreLandingItem>()).current;

    useEffect(() => {
        controller.onScroll = onScroll;
    }, []);

    const productImageHeight = (((Spacing.screen.width - 12 * 2 - 16 * 2) / 3) * 5) / 4;
    const itemHeight = 12 * 3 + 48 + productImageHeight;

    return (
        <PaggingScrollList<StoreLandingItem>
            fetch={fetch}
            Header={<>
                <Banner type={CollectionType.store} id={id}/>
                <View style={{height: 24}}/>
            </>}
            controller={controller}
            infRender={(state) => {
                if (state === ConnectionState.waiting) {
                    return <View style={{height: itemHeight, width: Spacing.screen.width}}/>
                }
                return <></>
            }}
            item={
                new RenderProps({
                    getTypeByData: (_) => 'item',
                    builder: {
                        none: ({height, width}) => (
                            <Placeholder Animation={Fade}>
                                {range(3).map((_, index) => (
                                    <View key={`${index}`} style={{width, height: itemHeight}}>
                                        <ItemPlaceholder/>
                                    </View>
                                ))}
                            </Placeholder>
                        ),
                        hasData: ({height, width}, data) => (
                            <View style={{width, height}}>
                                <Item data={data!}/>
                            </View>
                        ),
                    },
                    dimension: {
                        'item': {
                            width: Spacing.screen.width,
                            height: itemHeight,
                        }
                    },
                })
            }
        />
    );
};
