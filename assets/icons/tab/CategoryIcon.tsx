import * as React from "react"
import { Colors } from "styles";
import DabiFont from "../dabi.fonts";

const Icon = ({ filled }: { filled: boolean }) => {
    if (filled) return <DabiFont name={'search'} size={24} color={Colors.primary} />
    return <DabiFont name={'search'} size={24} color={Colors.icon} />
}

export default Icon;