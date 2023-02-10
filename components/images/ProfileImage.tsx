import { isEmpty } from "lodash";
import React from 'react';
import { Image, ImageStyle, StyleSheet, Text, View } from 'react-native';
import { Colors, Outlines } from 'styles';
import { defaultAvatar } from "utils/constant";
import { ImageElementFlex } from "./ImageElement";


const ProfileImage =
    ({
        source,
        children,
        size = 48,
        style,
        pk,
        border = false
    }: {
        source: any;
        children?: any;
        size?: number;
        style?: ImageStyle;
        border?: boolean
        pk?: number
    }) => {


        const url = !isEmpty(source)
            ? source
            : require('_assets/images/avatar/default_ava.png')

        return (
            <View style={[styles.container, {
                backgroundColor: '#eee',
                width: size,
                height: size,
                borderRadius: size / 2,
                ...style,
            }]}>
                {border && <Image style={{
                    position: 'absolute',
                    width: size,
                    height: size,
                    zIndex: 1,
                }}
                    source={require('assets/images/avatar/ava_frame.png')} />}
                <ImageElementFlex image={url} />
                {children}
            </View>
        );
    };

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    }
})

export default ProfileImage;