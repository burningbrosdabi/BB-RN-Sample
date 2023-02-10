import Button, {ButtonType, floatingButtonContainer, LayoutConstraint} from 'components/button/Button';
import {ConnectionDetection} from 'components/empty/OfflineView';
import BackButton from 'components/header/BackButton';
import {isEmpty, isNil} from 'lodash';
import {IPickAB, PickAB} from 'model/pick/pick';
import React, {useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigator} from 'services/navigation/navigation.service';
import {Colors, Spacing} from 'styles';
import {ConnectionState, useAsync} from 'utils/hooks/useAsync';
import {getPickABList, PickType} from '_api';
import {PickAnalyzing} from '../component/PickAnalyzing';
import {PickBox} from '../component/PickBox';
import {PickNPC} from '../component/PickNPC';
import {useActions} from "utils/hooks/useActions";
import {useAnalyzePick} from "scenes/pick/hook";


interface PickResult {
    pick_id: number;
}

const PickABScreen = () => {
    const [index, setIndex] = useState(0);
    const [pickResults, setPickResults] = useState<{ pick_id: number }[]>([]);
    const [analyzing, setAnalyzing] = useState(false)
    const navigator = useNavigator();
    const {data, excecute, state} = useAsync(() => getPickABList());
    const [pickAB, setPickAB] = useState<IPickAB>()
    const {showPopup, setLoading} = useActions();
    //   ComponentDidMount
    useEffect(() => {
        excecute()
    }, []);

    useEffect(() => {
        if (!isNil(data) && index <= data.length - 1) {
            setPickAB(data[index]!)
        }
    }, [index, state])

    const retry = () => {
        setAnalyzing(false);
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
        type: PickType.AB_PICK, picks: pickResults, retry: () => {
            retry()
        },
    })

    useEffect(() => {
        if (data?.length === index) {
            setAnalyzing(true)
            submit()
        }
    }, [index]);

    const _onSelect = async (pk: number) => {
        setPickResults([...pickResults, {pick_id: pk}])
        setIndex(index + 1)

    }

    const _renderItem = (item: PickAB) => {
        const width = (Spacing.screen.width - 16 * 3) / 2;
        return (
            <View style={{paddingHorizontal: 16}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}
                >
                    {!isNil(item) && item.picks.map(({image, original_image, pk}, i) => {
                        return (
                            <View style={{width, aspectRatio: 4 / 5}}
                                  key={image + i.toString()}
                            >
                                <PickBox
                                    image={image || original_image}
                                    onPress={() => _onSelect(pk)}/>
                            </View>
                        );
                    })}
                </View>
            </View>
        );
    };

    const hasEmptyPickAtLastStep = useMemo(() => {
        return index === (data?.length ?? 0) - 2 && isEmpty(pickResults);
    }, [index, data, pickResults])

    return (
        <ConnectionDetection.View>
            {analyzing ? <PickAnalyzing/> : <>
                <LinearGradient colors={['#FF9FB3', '#FD7694']} angle={0}
                                style={{borderBottomLeftRadius: 24, borderBottomRightRadius: 24,}}>
                    <SafeAreaView/>
                    <BackButton color={Colors.white}/>
                    <PickNPC
                        step={index}
                        color={index == 4 ? Colors.primary : undefined}
                        style={{
                            marginBottom: 24,
                            marginTop: 80,
                            alignItems: 'center'
                        }}
                    />
                </LinearGradient>
                <View style={{flex: 1, justifyContent: 'center', marginBottom: floatingButtonContainer().height}}>
                    {!isNil(data) && _renderItem(pickAB)}
                </View>
                <View style={floatingButtonContainer().style}>
                    <Button
                        type={ButtonType.outlined}
                        onPress={() => {
                            hasEmptyPickAtLastStep ? retry() :
                                setIndex(index + 1)
                        }}
                        text={hasEmptyPickAtLastStep ? 'THỬ LẠI NHỮNG SẢN PHẨM KHÁC' : 'LỰA CHỌN SẢN PHẨM MỚI'}
                        constraint={LayoutConstraint.matchParent}
                    />
                </View></>}
        </ConnectionDetection.View>
    );
};

export default PickABScreen;
