import Button, { ButtonType, LayoutConstraint } from 'components/button/Button'
import BackButton from 'components/header/BackButton'
import { ImageElementFlex } from 'components/images/ImageElement'
import React, { useMemo } from 'react'
import { View, Text, Image, ImageBackground } from 'react-native'
import Ripple from 'react-native-material-ripple'
import { Colors, Typography } from 'styles'
import { useActions } from 'utils/hooks/useActions'
import { combiImageMap, styleContentMap, styleImageMap } from "scenes/pick/type";
import { useNavigator } from "services/navigation/navigation.service";
import { PickAnalysisRouteSetting, PickRecommendRouteSetting } from "routes/pick/pick.route";
import { PickType } from "_api";
import { PickResult } from "model/pick/pick";


interface Props {
    data: PickResult,
    type: PickType,
    onClose: () => void;
    onRetry: () => void;
}

export const StyleSummaryPopUp = ({ data, type, onClose, onRetry }: Props) => {
    const { hidePopup } = useActions();
    const { title, description } = styleContentMap[data.name];

    const navigator = useNavigator();

    const _onDetail = () => {
        hidePopup()
        navigator.navigate(new PickAnalysisRouteSetting({ data, type }), true)
    }

    const close = () => {
        if (onClose) onClose();
        hidePopup();
    }

    const _onRetry = () => {
        hidePopup();
        onRetry();
    }

    const _navigateRecommend = () => {
        hidePopup();
        navigator.navigate(new PickRecommendRouteSetting({ type }), true)
    }

    return <View style={{ width: '100%' }}>
        <View style={{ position: 'absolute', zIndex: 10, left: 8, top: 8 }}>
            <BackButton mode={'cancel'} leftPadding={0} handleOnPress={close} /></View>
        <View style={{ width: '100%', aspectRatio: 1, backgroundColor: data.color }}>
            <ImageElementFlex
                transparent
                image={styleImageMap[data.name]}
            />
        </View>

        <View style={{ marginBottom: 12, paddingHorizontal: 12 }}>
            <Text style={Typography.h1}>{title}</Text>
            <Text style={Typography.body} numberOfLines={2}>{description}</Text>
            {/*<View style={{alignItems: 'flex-start'}}>*/}
            {/*    <Ripple*/}
            {/*        rippleContainerBorderRadius={4}*/}
            {/*        onPress={_onDetail}*/}
            {/*    >*/}
            {/*        <Text style={Typography.name_button}>Xem chi tiết</Text>*/}
            {/*    </Ripple>*/}
            {/*</View>*/}
        </View>

        <View style={{ marginBottom: 8, paddingHorizontal: 12 }}>
            <View style={{ height: 48, width: '100%', marginBottom: 12 }}>
                <Button onPress={_onDetail} text={'Xem chi tiết'} />
            </View>
            {/*<View style={{height: 48, width: '100%', marginBottom: 8}}>*/}
            {/*    <Button onPress={_onShare} text={'SHARE TO FRIENDS'} type={ButtonType.outlined}/>*/}
            {/*</View>*/}
            <View style={{ alignItems: 'center' }}>
                <Ripple
                    onPress={_onRetry}
                    rippleColor={Colors.primary}
                    rippleContainerBorderRadius={8}
                    style={{ padding: 4 }}>
                    <Text style={{ ...Typography.body, color: Colors.primary }}>Thử lại</Text>
                </Ripple>
            </View>
        </View>
    </View>
}

export const MyStyleSummary = ({ data, onReady }: { data: PickResult, onReady?: () => void }) => {
    const { description, title } = styleContentMap[data.name];
    const color = data.color;
    return <View style={{ backgroundColor: 'white' }}>
        <ImageBackground onLoad={onReady} source={styleImageMap[data.name]}
            style={{ width: '100%', aspectRatio: 3 / 4, backgroundColor: color }} />
        <ImageBackground onLoad={onReady} source={combiImageMap[data.name]}
            style={{ width: '100%', aspectRatio: 9 / 4, backgroundColor: color }} />
        {/* <View style={{ height: 24 }} />
        <View style={{ paddingHorizontal: 16 }}>
            <Text style={Typography.h1}>{title}</Text>
            <View style={{ height: 12 }} />
            <Text style={Typography.body}>{description}</Text>
        </View> */}
    </View>
}