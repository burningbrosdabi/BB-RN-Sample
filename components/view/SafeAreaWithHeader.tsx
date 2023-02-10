import { useNavigation } from '@react-navigation/native';
import { IconButton } from 'components/button/IconButton';
import { isEmpty } from 'lodash';
import React from 'react';
import {
    Animated, SafeAreaView, StyleSheet,
    TextStyle, View,
    ViewStyle
} from 'react-native';
import { CartRouteSetting } from 'routes/order/cart.route';
import { cartObservable } from 'services/api/cart';
import { NavigationService } from 'services/navigation';
import { getHeaderLayout } from "_helper";
import { Colors, Typography } from '_styles';

export interface Props {
    left?: any;
    right?: any;
    children: any;
    renderHeader?: any;
    searchIcon?: boolean;
    cartIcon?: boolean;
    style?: ViewStyle;
    title?: string;
    onBack?: () => void;
    titleStyle?: TextStyle;
}

/** @deprecated   **/
const SafeAreaWithHeader: React.FC<Props> = ({
    left,
    right,
    children,
    renderHeader,
    searchIcon,
    cartIcon,
    style,
    title,
    titleStyle,
    onBack,
}) => {
    const navigation = useNavigation();

    const navigateCart = () => {
        NavigationService.instance.navigate(new CartRouteSetting());
    };

    const navigateSearch = () => {
        navigation.navigate('Search');
    };

    const _renderHeader = () => {
        return (
            renderHeader ?? (
                <Animated.View style={[styles.container, style]}>
                    {!isEmpty(title) && (
                        <Animated.Text
                            numberOfLines={1}
                            style={[Typography.title, styles.titleStyle, titleStyle]}>
                            {title}
                        </Animated.Text>
                    )}
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        {left ?? <IconButton
                            onPress={() => {
                                onBack ? onBack() : navigation.goBack();
                            }}
                            icon={'arrow_left'}
                        />}
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        {right ?? <>
                            {searchIcon && (
                                <View style={styles.searchIcon}>
                                    <IconButton icon={'search'} onPress={navigateSearch} />
                                </View>
                            )}
                            {cartIcon && (
                                <View style={styles.cartIconContainer}>
                                    <IconButton
                                        icon={'cart'}
                                        onPress={navigateCart}
                                        badge={{
                                            observer: cartObservable,
                                            offset: { top: 8, right: 4 },
                                        }}
                                    />
                                </View>
                            )}</>}
                    </View>
                </Animated.View>
            )
        );
    };


    return (
        <SafeAreaView style={{ flex: 1, overflow: 'hidden' }}>
            {/*<View style={{borderWidth: 1, height: 100 , backgroundColor: 'transparent'}}/>*/}
            {_renderHeader()}
            {children}
        </SafeAreaView>

    );
};

const {
    extra,
    height
} = getHeaderLayout()

export default SafeAreaWithHeader;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        top: extra,
        position: 'absolute',
        zIndex: 1,
        height: 48,
        width: '100%',
        paddingHorizontal: 12,
        // backgroundColor: 'transparent',
        // backgroundColor: 'lightgrey'
    },
    titleStyle: {
        width: '100%',
        marginHorizontal: 12,
        paddingHorizontal: 40,
        textAlign: 'center',
        position: 'absolute',
    },
    backIcon: {
        zIndex: 1,
        justifyContent: 'center',
        paddingLeft: 12,
        paddingVertical: 12,
    },
    chartIcon: {
        zIndex: 1,
        justifyContent: 'center',
        paddingTop: 12,
        marginBottom: 12,
    },
    searchIcon: {
        zIndex: 1,
        justifyContent: 'center',
        paddingRight: 4,
        paddingVertical: 12,
    },
    cartIconContainer: {
        zIndex: 1,
        justifyContent: 'center',
        paddingVertical: 12,
    },
    cartIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        tintColor: Colors.icon,
    },
});
