import React from 'react'
import { useNavigation } from "@react-navigation/native";
import { range } from "lodash";
import { useEffect } from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Rating } from "react-native-ratings";
import { RoutePath } from "routes";
import { getProductUserFeedbacksApi } from "services/api";
import { Typography } from "styles";
import { ConnectionState, useAsync } from "utils/hooks/useAsync";

export const RatingStar = ({ pk }: { pk: number }) => {
    const navigation = useNavigation();
    const { data: average_score, excecute, state } = useAsync(() =>
        getProductUserFeedbacksApi({ pk, limit: 3 }).then((val) => val.average_score),
    );

    useEffect(() => {
        excecute();
    }, []);

    const gotoUserFeedbackList = () => {
        navigation.push(RoutePath.productFeedbackListScreen, {
            pk,
        });
    };


    return (
        <TouchableOpacity onPress={gotoUserFeedbackList} style={styles.ratingContainer}>
            {
                state === ConnectionState.hasData || state === ConnectionState.hasEmptyData ?
                    <>
                        <Rating
                            type="custom"
                            ratingImage={require('_assets/images/icon/star.png')}
                            ratingColor="transparent"
                            ratingBackgroundColor="transparent"
                            tintColor="#DBDDDE"
                            tintColorSelected="#FDE9A6"
                            startingValue={Math.round(average_score ?? 0)}
                            ratingCount={5}
                            imageSize={12}
                            imagePadding={6}
                            readonly
                        />
                        <Text style={[Typography.smallCaption, { marginLeft: 4 }]}>
                            {(average_score ? average_score : 0).toFixed(1)}
                        </Text>
                    </>
                    :
                    <UnRating />
            }

        </TouchableOpacity>
    );
};

const UnRating = () => (
    <>
        <View style={{ flexDirection: 'row', paddingLeft: 3, paddingRight: 1 }}>
            {range(5).map((_, index) => {
                return <Image resizeMode={'contain'} key={`${index}`}
                    source={require('_assets/images/icon/unrating.png')}
                    style={{ width: 12, height: 12, marginRight: 6 }} />;
            })}
        </View>
        <Text style={[Typography.smallCaption, { marginLeft: 0 }]}>
            0.0
        </Text>
    </>
)

const styles = StyleSheet.create({
    ratingContainer: {
        paddingTop: 12,
        paddingBottom: 36,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: -2,
        textAlignVertical: 'center',
    },
});
