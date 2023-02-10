import DabiFont from 'assets/icons/dabi.fonts';
import { Badge } from 'components/button/badge/Badge';
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Ripple from 'react-native-material-ripple';
import { NotificationRouteSetting } from 'routes';
import { NavigationService } from 'services/navigation';
import { NotificationService } from 'services/notification';
import { Colors, Typography } from "styles";
import { HEADER_HEIGHT } from "_helper";
import { FeatureMeasurement } from '../tutorial';
import BackButton from "./BackButton";


export const Header = ({
    title = '',
    titleComponent,
    trailing,
    icColor = Colors.icon,
    mode = "back",
    onBack = undefined }:
    {
        icColor?: string,
        title?: string,
        trailing?: JSX.Element,
        mode?: string,
        onBack?: () => void,
        titleComponent?: JSX.Element
    }) => {
    return <View style={{
        paddingLeft: 0,
        paddingRight: 2,
        height: HEADER_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        width: '100%'
    }}>
        <View style={{ width: 52 }}>
            <BackButton color={icColor} mode={mode} handleOnPress={onBack} />
        </View>
        {titleComponent ?? <View style={{ flex: 1 }}>
            <Text style={Typography.subtitle}
                numberOfLines={1}
            >{title}</Text>
        </View>}
        {trailing ?? <View style={{ width: 32 + 16 }} />}
    </View>
}

/** @deprecated   **/
export const HeaderNotificationButton = () => {
    const onPress = () => {
        NavigationService.instance.navigate(new NotificationRouteSetting());
    };

    return (
        // <FeatureMeasurement
        //     id={'notification'}
        //     title={'Thông báo mới 📢'}
        //     description={'Những thông tin mới nhất về chương trình khuyến mãi, sự kiện hoặc những tips phối đồ... '}
        //     backgroundColor={Colors.blue}
        //     overlay={<DabiFont name={'noti_line'} size={24} color={Colors.icon} />}>
        <Ripple onPress={onPress} rippleContainerBorderRadius={24} style={styles.notiBtnContainer}>
            <View style={styles.iconContainer}>
                <DabiFont name={'noti_line'} size={24} color={Colors.icon} />
                <Badge observer={NotificationService.instance.hasNotificationObserver} />
            </View>
        </Ripple>
        // </FeatureMeasurement>
    );
};

const notiBtnSize = 32;

const styles = StyleSheet.create({
    notiBtnContainer: {
        width: notiBtnSize,
        height: notiBtnSize,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
    },
    iconContainer: { width: 24, height: 24 },
});
