import { ImageElementFlex } from 'components/images/ImageElement'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Colors, Typography } from 'styles'

export const PickAnalyzing = () => {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 140, height: 140, marginBottom: 36 }}>
            <ImageElementFlex
                transparent
                image={require('assets/images/pick/loading/landing_indicator.gif')} />
        </View>
        <Text style={Typography.title}>Đang tạo bảng tin…</Text>
        <Text style={{ ...Typography.body, textAlign: 'center' }}>Tuyệt. Mình đang phân tích kết quả.{'\n'}Bạn hãy đợi tí nhé!</Text>
    </View >
}