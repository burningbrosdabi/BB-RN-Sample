import { useNavigation } from '@react-navigation/native';
import { toast } from 'components/alert/toast';
import { Button, ButtonState, ButtonType, floatingButtonContainer } from 'components/button/Button';
import { GenericErrorView } from 'components/empty/EmptyView';
import { ImageElementFlex } from 'components/images/ImageElement';
import { usePagingFetch } from "components/list/PagingFlatList";
import { range } from 'lodash';
import { StyleItem } from 'model';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Fade, Placeholder, PlaceholderMedia } from 'rn-placeholder';
import { RoutePath } from 'routes';
import { PaginationFetch, PaginationResponse } from "services/http/type";
import { fontPlaceHolder } from 'styles/typography';
import { HEADER_HEIGHT } from 'utils/helper';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { getStylesList, updateUserApi, updateUserOnboardingData } from '_api';
import { Colors, Spacing, Typography } from '_styles';


const PickSelectionScreen = () => {
    const { state, data, excecute } = useAsync(getStylesList);
    const [selectedStyles, setSelectedStyles] = useState<StyleItem[]>([]);
    const navigation = useNavigation()

    useEffect(() => {
        excecute();
    }, []);

    const onSelectedStyles = (styles: StyleItem[], force?: boolean) => {
        setSelectedStyles(styles);
    };

    const handleOnPress = async (skip = false) => {
        if (!skip) {
            await updateUserOnboardingData({ data: selectedStyles });
            // How do we store onboarding data to server?
        }
        await updateUserApi({ is_pass_onboarding: true })
        navigation.navigate(RoutePath.followSuggestion)
    }

    const selectStyle = (item: StyleItem) => {
        const foundIdx = selectedStyles.findIndex((res: StyleItem) => res?.pk === item?.pk);
        const newList = JSON.parse(JSON.stringify(selectedStyles)) as StyleItem[];
        if (foundIdx !== -1) {
            newList.splice(foundIdx, 1)
        } else if (newList.length < 10) {
            newList.push(item)
        } else {
            toast("Bạn không thể chọn nhiều hơn 10 sản phầm")
        }
        onSelectedStyles(newList);
    };

    const isValid = () => {
        return selectedStyles.length > 4
    };


    switch (state) {
        case ConnectionState.hasData:
            const stylesList = data || []
            stylesList.length === 0 && onSelectedStyles(stylesList, true);
            return <>
                <SafeAreaView
                    style={{
                        flex: 1,
                        paddingHorizontal: 16,
                    }}
                >
                    <View style={{
                        height: HEADER_HEIGHT, alignItems: 'flex-end', justifyContent: 'center',
                    }}>
                        <TouchableOpacity onPress={() => handleOnPress(true)}>
                            <Text style={{ ...Typography.name_button, color: Colors.primary }}>Bỏ qua</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ ...Typography.h1 }}>Hãy lựa chọn nhiều hơn{'\n'}5 phong cách yêu thích</Text>
                    <View style={{ height: 12 }} />
                    <_List fetch={getStylesList} initData={data!} selectedStyles={selectedStyles}
                        onItemPress={selectStyle} />
                </SafeAreaView>
                <View style={floatingButtonContainer().style}>
                    <Button
                        type={ButtonType.primary}
                        state={!isValid() ? ButtonState.disabled : ButtonState.idle}
                        onPress={handleOnPress}
                        disabled={!isValid()}
                        text={'Bắt đầu'}
                    />
                </View>
            </>
        case ConnectionState.hasEmptyData:
            return (
                <GenericErrorView />
            );
        case ConnectionState.hasError:
            return (
                <GenericErrorView />
            );
        case ConnectionState.waiting:
        default:
            return <_Placeholder />;
    }
};

const _Placeholder = () => {

    return (
        <SafeAreaView>
            <Placeholder Animation={Fade}>
                <View style={{ marginBottom: 12, paddingHorizontal: 16 }}>
                    <View style={{ height: 48, alignItems: 'flex-end', justifyContent: 'center' }}>
                    </View>
                    <PlaceholderMedia style={{ width: 240, ...fontPlaceHolder.h1 }} />
                    <PlaceholderMedia style={{ width: 220, ...fontPlaceHolder.h1 }} />
                    <View style={{ height: 12 }} />
                    <PlaceholderMedia style={{ width: 300, ...fontPlaceHolder.description }} />
                    <PlaceholderMedia style={{ width: 80, ...fontPlaceHolder.description }} />
                    <View style={{ height: 24 }} />

                    {range(5).map((_, index) => {
                        return <ItemPlaceholder key={`${index}`} />
                    })}
                </View>
            </Placeholder>
        </SafeAreaView>
    );
};

const ItemPlaceholder = () => {
    const itemWidth = (Spacing.screen.width - 16 * 2 - 8 * 2) / 3;
    return <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, }}>
        <PlaceholderMedia
            style={{
                backgroundColor: 'white',
                width: itemWidth,
                height: (itemWidth * 5) / 4,
            }}
        />
        <PlaceholderMedia
            style={{
                backgroundColor: 'white',
                width: itemWidth,
                height: (itemWidth * 5) / 4,
            }}
        />
        <PlaceholderMedia
            style={{
                backgroundColor: 'white',
                width: itemWidth,
                height: (itemWidth * 5) / 4,
            }}
        />
    </View>
}

const _List = ({ initData, fetch, selectedStyles, onItemPress }: {
    fetch: PaginationFetch<StyleItem>,
    initData: PaginationResponse<StyleItem>,
    selectedStyles: StyleItem[], onItemPress: (value: StyleItem) => void
}) => {

    const { onScroll, data, state } = usePagingFetch<StyleItem>({
        initialData: initData.results,
        next: initData.next ?? undefined,
        fetch,
    });

    const _renderItem = ({ item, index }: { item: StyleItem; index: number, }) => {
        const found = selectedStyles.find((res: StyleItem) => res?.pk === item?.pk);
        const onPress = () => onItemPress(item);
        const itemWidth = (Spacing.screen.width - 16 * 2 - 8 * 2) / 3;
        const itemHeight = (itemWidth * 5) / 4;
        return (
            <View
                style={[
                    {
                        width: itemWidth,
                        height: itemHeight,
                        marginBottom: 8,
                        overflow: 'hidden',
                    },
                    index % 3 !== 2 && { marginRight: 8 },
                    found && { opacity: 0.3 },
                ]}>
                <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
                    <ImageElementFlex image={item.image || item.image_outlink} />
                </TouchableOpacity>
            </View>
        );
    };

    const _renderHeader = () => {
        return <View>
            <Text style={Typography.description}>Lựa chọn các sản phẩm ưng ý, Dabi sẽ tạo nên bản tin riêng biệt dành
                cho bạn</Text>
            <View style={{ height: 24 }} />
        </View>
    }

    const keyExtractor = (item: { pk: number }) => `${item.pk}`;

    return <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        onScroll={onScroll}
        // refreshing={refreshing}
        // onRefresh={onRefresh}
        ListFooterComponent={state === ConnectionState.waiting ?
            <Placeholder Animation={Fade}>
                <ItemPlaceholder />
            </Placeholder> : <></>}
        ListHeaderComponent={_renderHeader}
        // extraData={selectedStyles}
        numColumns={3}
        renderItem={({ item, index }) => _renderItem({ item, index })}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ paddingBottom: floatingButtonContainer().height }}
    />
}


export default React.memo(PickSelectionScreen);
