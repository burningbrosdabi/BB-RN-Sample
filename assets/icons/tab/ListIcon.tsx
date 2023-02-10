import * as React from "react"
import { Image } from "react-native";

const Icon = ({ filled }: { filled: boolean }) => {
    if (filled) return <Image style={{ width: 24, height: 24 }} source={require('assets/images/icon/list-filled.png')} />

    return <Image style={{ width: 24, height: 24 }} source={require('assets/images/icon/list-line.png')} />
}

export default Icon;