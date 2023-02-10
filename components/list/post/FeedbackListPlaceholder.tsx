import { DabiFont } from "assets/icons";
import { DEFAULT_IC_BTN_PADDING } from "components/button/IconButton";
import { range } from "lodash";
import React from "react";
import { View } from "react-native";
import { Fade, Placeholder, PlaceholderLine, PlaceholderMedia } from "rn-placeholder";
import { Colors } from "styles";
import { screen } from "styles/spacing";
import { fontPlaceHolder } from "styles/typography";

export const FeedbackListPlaceholder = () => (
    <Placeholder Animation={Fade}>
        <View style={{
            paddingHorizontal: 16,
            flexDirection: 'row',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: Colors.boxLine
        }}>
            <PlaceholderMedia style={{ width: 48, height: 18, backgroundColor: 'white' }} />
            <View style={{ flex: 1 }} />
            <PlaceholderMedia style={{ width: 72, height: 28, backgroundColor: 'white' }} />
        </View>
        <FeedbackListItemPlaceholder />
    </Placeholder>
)

export const FeedbackListItemPlaceholder = ({ hasProduct }: { hasProduct?: boolean }) => {

    return <View>
        <PlaceholderMedia style={{ width: screen.width, height: screen.width, backgroundColor: 'white' }} />
        {
            hasProduct && <RelatedProductPlaceholder />
        }
        <View style={{ height: 12 }} />
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
        }}>
            <DabiFont size={24} name={'heart_line'} color={Colors.surface.lightGray} />
            <View style={{ flex: 1 }} />
            <DabiFont size={24} name={"share-1"} color={Colors.surface.lightGray} />
            <View style={{ width: 24 }} />
            <DabiFont size={24} name={'bookmark_line'} color={Colors.surface.lightGray} />
        </View>
        <View style={{ height: 12 }} />
        <PlaceholderLine noMargin style={{ ...fontPlaceHolder.description, paddingHorizontal: 16, width: 80, backgroundColor: 'white' }} />
        <View style={{ height: 4 }} />
        <View style={{ paddingHorizontal: 16 }}>
            {
                range(3).map((_, index) => <PlaceholderLine key={`${index}`} noMargin
                    style={{
                        width: `${Math.min(60 + index * 20, 100)}%`,
                        ...fontPlaceHolder.description,
                        backgroundColor: 'white',
                    }} />)
            }
        </View>

    </View>
}

const RelatedProductPlaceholder = () => (<View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
    <View style={[{
        borderRadius: 4,
        borderWidth: 1,
        borderColor: Colors.boxLine,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12
    }]}>
        <PlaceholderMedia style={{ width: 48, height: 64, backgroundColor: 'white' }} />
        <View style={{ width: 12 }} />
        <View style={{ flex: 1 }}>
            <PlaceholderLine noMargin style={{ width: '80%', height: 18, backgroundColor: 'white' }} />
            <View style={{ height: 4 }} />
            <PlaceholderLine noMargin style={{ width: '60%', height: 18, backgroundColor: 'white' }} />
        </View>
    </View>
</View>)