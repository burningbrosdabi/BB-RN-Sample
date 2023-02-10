import { Decorator } from 'components/decorator/Decorator';
import { ImageElementNative } from 'components/images/ImageElement';
import { FeedbackInfo } from "model";
import React, { useEffect, useRef } from 'react';
import { Animated, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { FeedDetailRouteSetting } from "routes/feed/feed.route";
import { getProductFeedback } from 'services/api/product/product.api';
import { useNavigator } from "services/navigation/navigation.service";
import { Colors } from 'styles';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';

const FeedbackListHorizontal = ({ pk }: { pk: number }) => {
    const navigator = useNavigator();
    const { data, excecute, state } = useAsync(() => getProductFeedback({ pk }), {
        animated: true,
        errorConfig: { stack: 'FeedbackListHorizontal' },
    });
    const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        excecute();
    }, []);

    useEffect(() => {
        if (state === ConnectionState.hasData) {
            Animated.spring(scaleAnim, {
                // duration: 120,
                useNativeDriver: false,
                toValue: 1,
            }).start();
        }
    }, [state]);

    const renderItem = ({ item }: { item: FeedbackInfo }) => {
        const onPress = () => {
            navigator.navigate(new FeedDetailRouteSetting({
                pk: item.pk
            }))
        }


        return (
            <TouchableOpacity style={{ marginRight: 12, width: 72, height: 72 }} onPress={onPress}>
                <ImageElementNative image={item.post_thumb_image} rounded />
            </TouchableOpacity>
        );
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    borderBottomWidth: scaleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 4],
                    }),
                    paddingVertical: scaleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 12],
                    }),
                    height: scaleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 136],
                    })
                },
            ]}>
            {state === ConnectionState.hasData && (
                <>
                    <Decorator.Feedback containerStyle={{ marginBottom: 12 }} />
                    <FlatList
                        data={data}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        initialNumToRender={5}
                        maxToRenderPerBatch={1}
                        updateCellsBatchingPeriod={25000}
                        keyExtractor={(item) => item.pk.toString()}
                        renderItem={renderItem}
                    />
                </>
            )}
            {state !== ConnectionState.hasData && <View style={{ height: 72 }} />}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingLeft: 12,
        alignItems: 'flex-start',
        borderBottomColor: Colors.line,
        overflow: 'hidden',
    },
});

export default FeedbackListHorizontal;
