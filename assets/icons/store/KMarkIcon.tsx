import * as React from "react"
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"

function KMarkIcon(props) {
    return (
        <Svg
            width={12}
            height={12}
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M10.56 10.06a1.5 1.5 0 01-2.12 0L6.5 8.12 8.62 6l1.94 1.94a1.49 1.49 0 010 2.12z"
                fill="url(#paint0_linear_304_1214)"
            />
            <Path
                d="M10.56 4.06L6.5 8.12 4.38 6l4.06-4.06a1.5 1.5 0 012.12 2.12z"
                fill="url(#paint1_linear_304_1214)"
            />
            <Path
                d="M2.5 10.5A1.5 1.5 0 011 9V3a1.5 1.5 0 013 0v6a1.5 1.5 0 01-1.5 1.5z"
                fill="url(#paint2_linear_304_1214)"
            />
            <Defs>
                <LinearGradient
                    id="paint0_linear_304_1214"
                    x1={10.9747}
                    y1={7.55612}
                    x2={6.47181}
                    y2={7.61256}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#FF9FB3" />
                    <Stop offset={1} stopColor="#FD7694" />
                </LinearGradient>
                <LinearGradient
                    id="paint1_linear_304_1214"
                    x1={4.37988}
                    y1={4.80994}
                    x2={10.9999}
                    y2={4.80994}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#FF9FB3" />
                    <Stop offset={1} stopColor="#FD7694" />
                </LinearGradient>
                <LinearGradient
                    id="paint2_linear_304_1214"
                    x1={3.98122}
                    y1={4.61316}
                    x2={0.980798}
                    y2={4.62568}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#FF9FB3" />
                    <Stop offset={1} stopColor="#FD7694" />
                </LinearGradient>
            </Defs>
        </Svg>
    )
}

export default KMarkIcon
