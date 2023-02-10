import { ImageElementFlex } from 'components/images/ImageElement'
import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { Colors, Typography } from 'styles'
import { defaultNPCAvatar, defaultNPCDialog } from 'utils/constant'
import { NUMB_OF_PICKS } from "_api";

interface Props {
    step: number
    color?: string
    dialog?: string
    avatar?: string
    lines?: number
    style?: ViewStyle
}

export const PickNPC = (props: Props) => {
    const { step: _steps } = props
    const step = Math.min(_steps, NUMB_OF_PICKS)

    const avatar = props.avatar || defaultNPCAvatar[step % NUMB_OF_PICKS]
    const dialog = props.dialog || defaultNPCDialog[step % NUMB_OF_PICKS].dialog
    const lines = props.lines || defaultNPCDialog[step % NUMB_OF_PICKS].lines
    const color = props.color || Colors.black
    return <View
        style={props.style}>
        <View style={{ width: 80, height: 80 }}>
            <ImageElementFlex
                transparent
                image={avatar} />
        </View>
        <View style={{
            ...styles.messageBox,
            top: -44 - lines * 20, //64 for one line
        }}>
            <Text style={{ ...styles.messageText, color: step === 6 ? Colors.primary : color }}>{dialog}
            </Text>
            <View style={styles.messageBoxArrow} />
        </View>
    </View>

}


const styles = StyleSheet.create({
    messageBox: {
        backgroundColor: Colors.white,
        paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8,
        alignItems: 'center',
        shadowColor: "#FF6984",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
        position: 'absolute',
    },
    messageBoxArrow: {
        position: 'absolute',
        bottom: -12,
        width: 0,
        height: 0,
        borderLeftWidth: 12,
        borderRightWidth: 12,
        borderTopWidth: 12,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: Colors.white,
        shadowColor: "#FF6984",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
    messageText: {
        ...Typography.name_button,
        textAlign: 'center'
    }
})