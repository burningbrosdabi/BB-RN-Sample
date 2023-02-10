import React, { useContext, useEffect, useMemo } from "react";
import { isIphoneX } from "react-native-iphone-x-helper";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { useAsync } from "utils/hooks/useAsync";
import { getCollectionByIdType } from "_api";
import { Image, ImageBackground, ImageRequireSource, Text, View } from "react-native";
import { isEmpty, isNil } from "lodash";
import { Colors, Typography } from "styles";
import { FlashSaleTimmer } from "components/timmer/FlashSaleTimmer";
import LinearGradient from "react-native-linear-gradient";
import { CollectionType, FlashSaleCollection } from "model/collection";
import { getCollectionDefaultStyle } from "scenes/home/collection/CollectionContainer";
import { CollectionLandingContext } from "scenes/home/landing/context";

export const Banner = ({ type, id }: { type: CollectionType, id: number }) => {
    const top = useMemo(() => {
        return isIphoneX() ? getStatusBarHeight() : 0;
    }, []);
    const { setCollection } = useContext(CollectionLandingContext)
    const { data, excecute } = useAsync(() => getCollectionByIdType({ type, id }))
    useEffect(() => {
        excecute();
    }, [])

    useEffect(() => {
        if (!data) return;
        setCollection(data);
    }, [data])
    const {
        gradient = [],
        image,
        end,
        title,
        color = 'white',
        imgUrl = '',
    } = useMemo<{
        gradient: string[],
        image?: ImageRequireSource,
        end?: Date,
        title: string,
        color?: string,
        imgUrl: string,
    }>(() => {
        if (!data) {
            return {
                gradient: [Colors.background, Colors.background],
                image: undefined,
                title: '',
                color: 'white',
                imgUrl: '',
            }
        }
        const { image, gradient } = getCollectionDefaultStyle(data.type, data.item_transition);
        return {
            image,
            gradient,
            title: data.title,
            imgUrl: data.background_image,
            color: data.color,
            end: data.type === CollectionType.flash_sale ? (data as FlashSaleCollection).end_at : undefined
        }
    }, [data])

    const children = useMemo(() => {
        return (
            <>
                <View style={{ height: 180 + top }}>
                    {isEmpty(imgUrl) && (
                        <Image style={{ position: 'absolute', right: 0, top }} source={image} />
                    )}
                    <View style={{ position: 'absolute', left: 16, right: 48, bottom: 12 }}>
                        <Text
                            numberOfLines={2}
                            style={[
                                Typography.h1,
                                {
                                    color
                                },
                            ]}>
                            {title}
                        </Text>
                    </View>
                </View>
                {!isNil(end) && (
                    <View>
                        <FlashSaleTimmer end={end} />
                        <View style={{ height: 12 }} />
                    </View>
                )}
                <View style={{ height: 12 }} />
            </>
        );
    }, [data]);

    if (!isEmpty(imgUrl)) {
        return (
            <ImageBackground
                source={{ uri: imgUrl }}
                resizeMode={'cover'}
                style={{
                    borderBottomRightRadius: 80,
                    backgroundColor: Colors.background,
                    overflow: 'hidden',
                }}>
                {children}
            </ImageBackground>
        );
    }

    return (
        <LinearGradient
            colors={gradient}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            style={{ borderBottomRightRadius: 80, backgroundColor: Colors.background }}>
            {children}
        </LinearGradient>
    );
};
