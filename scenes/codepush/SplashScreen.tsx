import React, { useMemo, useEffect } from 'react';
import {
    ActivityIndicator,
    Image,
    Platform,
    StyleSheet,
    Text,
    View,
    StatusBar,
} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from 'styles';
import { unAwaited } from 'utils/helper/function.helper';

export const DefaultSplashScreen = () => {
    useEffect(() => {
        StatusBar.setBarStyle('dark-content');
    }, []);

    return (
        <_PlatformContainer>
            <View
                style={{
                    position: 'absolute',
                    bottom: 24,
                    height: 56,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}>
                <View style={{ flex: 2 }}>
                    <ActivityIndicator color={Colors.surface.midGray} size={'small'} />
                </View>
                <View style={{ flex: 2 }}>
                    <Text style={[Typography.body, { color: Colors.surface.midGray }]}>
                        {'Kiểm tra bản cập nhật'}
                    </Text>
                </View>
            </View>
        </_PlatformContainer>
    );
};

const _PlatformContainer = ({ children }: { children: JSX.Element }) => {
    const onLoadEnd = () => {
        unAwaited(RNBootSplash.hide());
    };
    const _Image = useMemo(
        () => (
            <Image
                onLoadEnd={onLoadEnd}
                fadeDuration={0}
                style={{
                    width: Platform.OS === 'android' ? 250 : Spacing.screen.width - 160,
                    height: Platform.OS === 'android' ? 250 : Spacing.screen.width - 160,
                    resizeMode: 'contain',
                    flex: 1,
                    backgroundColor: Colors.black
                }}
                source={require('assets/images/logo_square.png')}
            />
        ),
        [],
    );

    const Container = () => {
        if (Platform.OS === 'android') {
            return (
                <View style={styles.container}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>{_Image}</View>
                    {children}
                </View>
            );
        } else {
            return (
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.container}>
                        <View
                            style={{
                                justifyContent: 'center',
                            }}>
                            {_Image}
                        </View>
                        {children}
                    </View>
                </SafeAreaView>
            );
        }
    };

    return Container();
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    restartToggleButton: {
        color: 'blue',
        fontSize: 17,
    },
    syncButton: {
        color: 'green',
        fontSize: 17,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 20,
    },
});
