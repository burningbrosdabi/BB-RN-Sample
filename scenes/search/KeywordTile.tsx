import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import ProfileImage from "components/images/ProfileImage";
import { Colors, Typography } from "styles";
import IconButton from "components/button/IconButton";
import React from "react";
import Ripple from "react-native-material-ripple";
import { isNil } from "lodash";
import { screen } from "styles/spacing";


export const KeywordTile = ({ onPress, image, title, description, onRemove }: {
    title: string, description?: string, image?: string,
    onRemove?: () => void,
    onPress: () => void;
}) => {
    return <TouchableOpacity onPress={onPress}>
        <View style={styles.keywordContainer}>
            {
                !isNil(image) ? <View style={{ width: 36 }}><ProfileImage size={24} source={image} />
                    <View style={{ width: 12 }} /></View> : <></>
            }
            <Text numberOfLines={1}
                style={[Typography.body, { alignSelf: 'center', flexShrink: 1 }]}>{title}<Text numberOfLines={1}
                    style={[Typography.body, { alignSelf: 'center', flexShrink: 1, color: Colors.component }]}> {description}</Text></Text>

            {
                onRemove && <IconButton icon={'small_delete'} iconSize={12} onPress={onRemove} />
            }
        </View>
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    keywordContainer: {
        height: 48,
        width: screen.width,
        flexDirection: 'row',
        paddingHorizontal: 16,
        alignItems: 'center',
    }
})
