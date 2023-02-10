import React from 'react'
import {ImageElementFlex} from "components/images/ImageElement"
import {useState} from "react"
import {TouchableOpacity, View, Image, ImageRequireSource} from "react-native"
import {applyOpacity, Colors} from "styles"

export const PickBox = ({
                            disabled = false, image, onPress
                        }: { disabled?: boolean, image?: string | ImageRequireSource, onPress: () => () => void }) => {
    const [pickLoading, setPickLoading] = useState(false)
    const [loadingIndicator, setLoadingIndicator] = useState(false)

    const _onPress = () => {
        const onSelect = onPress();
        setPickLoading(true)
        setLoadingIndicator(true)
        setTimeout(() => {
            setLoadingIndicator(false)
        }, 400)
        setTimeout(() => {
            setPickLoading(false)
            onSelect()
        }, 300)
    }
    return <TouchableOpacity
        disabled={disabled || pickLoading}
        onPress={_onPress}
        style={{flex: 1}}>
        <ImageElementFlex
            rounded
            image={image}
        />
        {pickLoading && <View style={{
            position: 'absolute', width: '100%', height: '100%',
            backgroundColor: applyOpacity(Colors.white, 0.3),
            justifyContent: 'center', alignItems: 'center'
        }}>
            {loadingIndicator && <View style={{
                width: 72, height: 72,
            }}>
                <ImageElementFlex
                    transparent
                    image={require('assets/images/pick/loading/single_heart_effect.gif')}/>
            </View>}
        </View>}
    </TouchableOpacity>
}
