import { ConnectionDetection } from 'components/empty/OfflineView';
import { isNil } from 'lodash';
import { IPickItem, PickAB, PickItem } from 'model/pick/pick';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPickIn6List, NUMB_OF_PICKS, PickType } from 'services/api';
import { Colors, Typography } from 'styles';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { PickAnalyzing } from '../component/PickAnalyzing';
import { PickBox } from '../component/PickBox';
import { PickNPC } from '../component/PickNPC';
import { useAnalyzePick } from "scenes/pick/hook";
import { useActions } from "utils/hooks/useActions";
import { Header } from "components/header/Header";
import { getHeaderLayout } from "_helper";
import { PlaceholderMedia } from 'rn-placeholder';

interface PickResult {
    pick_id: number;
}


const PickIn6Screen = () => {
    const { data, excecute, state, } = useAsync(() => getPickIn6List());

    const [analyzing, setAnalyzing] = useState(false)
    const [index, setIndex] = useState(0);
    const [pickIn6, setPickIn6] = useState<IPickItem[]>([])
    const [pickResults, setPickResults] = useState<{ pick_id: number }[]>([]);
    const { setLoading } = useActions();
    const [pickEnabled, setPickEnabled] = useState(true);

    const retry = () => {
        setAnalyzing(false)
        excecute().finally(() => {
            setPickResults([]);
            setIndex(0);
        });
    }

    useEffect(() => {
        if (state === ConnectionState.waiting) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [state])

    const submit = useAnalyzePick({
        type: PickType.IN6, picks: pickResults, retry: () => {
            retry()
        },
    })

    useEffect(() => {
        if (data?.length === index) {
            setAnalyzing(true)
            submit()
        }
    }, [index]);


    useEffect(() => {
        excecute()
    }, []);

    useEffect(() => {
        if (!isNil(data) && index <= data.length - 1) {
            setPickIn6(data[index].picks)
        }
    }, [index, state])


    const _onSelect = (pk: number) => {
        setPickEnabled(false);
        return () => {
            setPickEnabled(true);
            setPickResults([...pickResults, { pick_id: pk }])
            setIndex(index + 1)
        }
    }

    const _renderItem = ({ item, index }: { item: PickItem, index: number }) => {
        const marginLeft = (index % 3 === 0) ? 0 : 12;
        return <View style={{
            flex: 1,
            aspectRatio: 4 / 5,
            marginLeft,
            marginBottom: 12
        }}>
            <PickBox
                disabled={!pickEnabled}
                image={item.image || item.original_image}
                onPress={() => _onSelect(item.pk)} />
        </View>
    }

    return (
        <ConnectionDetection.View>
            <LinearGradient colors={Colors.gradient.pink} style={{ flex: 1, justifyContent: 'center' }}>
                {analyzing ? <PickAnalyzing /> :
                    <SafeAreaView style={{ paddingHorizontal: 16 }}>
                        <View style={{
                            backgroundColor: Colors.white,
                            padding: 12,
                            borderRadius: 8, paddingTop: 52,
                        }}>
                            <PickNPC step={index} style={{
                                position: 'absolute',
                                zIndex: 1,
                                top: -40, left: 0, right: 0,
                                alignItems: 'center',
                            }} />
                            {state === ConnectionState.hasData ?
                                <FlatList
                                    numColumns={3}
                                    ListEmptyComponent={<View style={{ flex: 1, backgroundColor: 'white' }} />}
                                    showsVerticalScrollIndicator={false}
                                    data={pickIn6}
                                    renderItem={_renderItem}

                                /> : <PickListPlaceHolder />
                            }
                        </View>
                    </SafeAreaView>
                }
            </LinearGradient>
            <View style={{ position: 'absolute', top: getHeaderLayout().extra, left: 0, right: 0 }}>
                <Header icColor={'white'} mode={"cancel"}
                    trailing={<Text style={[Typography.name_button, { paddingRight: 16, color: 'white' }]}>{Math.min(index + 1, NUMB_OF_PICKS)}/{NUMB_OF_PICKS}</Text>} />
            </View>
        </ConnectionDetection.View>
    );
};

const PickListPlaceHolder = () => {
    const boxStyle = {
        flex: 1,
        aspectRatio: 4 / 5,
        marginLeft: 12,
        marginBottom: 12
    }
    return <View>
        <View style={{ flexDirection: 'row' }}>
            <PlaceholderMedia style={{ ...boxStyle, marginLeft: 0 }} />
            <PlaceholderMedia style={boxStyle} />
            <PlaceholderMedia style={boxStyle} />
        </View>
        <View style={{ flexDirection: 'row' }}>
            <PlaceholderMedia style={{ ...boxStyle, marginLeft: 0 }} />
            <PlaceholderMedia style={boxStyle} />
            <PlaceholderMedia style={boxStyle} />
        </View>
    </View>
}

export default PickIn6Screen;
