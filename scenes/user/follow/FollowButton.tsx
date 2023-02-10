import { FeatureDiscovery } from 'components/tutorial';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { PlaceholderLine } from 'rn-placeholder';
import { Colors, Typography } from 'styles';
import { useFollowKOL } from 'utils/hooks/useFollowKOL';

export const FollowButton = ({
    pk,
    name,
}: {
    pk: number;
    name: string
    onUnfollow?: () => void;
}) => {


    const { marked, excecute } = useFollowKOL({ pk, name });

    const buttonProps = useMemo(() => {
        if (marked) {
            return {
                text: 'Đang theo',
                textColor: Colors.black,
                buttonColor: Colors.white
            };
        }

        return {
            text: 'Theo dõi +',
            textColor: Colors.white,
            buttonColor: Colors.black
        };
    }, [marked]);

    return (
        <Ripple
            onPress={excecute}
            rippleContainerBorderRadius={14}>
            <View style={{
                paddingVertical: 3, paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.black,
                backgroundColor: buttonProps.buttonColor,
                borderRadius: 14,
            }}>
                <Text style={{ ...Typography.body, color: buttonProps.textColor }}>{buttonProps.text}</Text>
            </View>
        </Ripple>
    );
};


export const FollowButtonPlaceHolder = () => {
    return <PlaceholderLine noMargin style={{ width: 90, height: 28, backgroundColor: 'white', borderRadius: 14 }} />

}