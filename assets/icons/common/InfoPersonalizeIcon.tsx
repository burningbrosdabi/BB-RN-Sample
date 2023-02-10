import * as React from 'react';
import Svg, { Defs, LinearGradient, Stop, Rect, Path, Ellipse, SvgProps } from 'react-native-svg';

function InfoPersonalize(props: SvgProps & { size: number }) {
  const size = props.size;

  return (
    <Svg viewBox="0 0 48 48" width={size} height={size} {...props}>
      <Defs>
        <LinearGradient
          id="prefix__a"
          x1={15.79}
          y1={36.1}
          x2={16.63}
          y2={36.1}
          gradientUnits="userSpaceOnUse">
          <Stop offset={0} stopColor="#ff9fb3" />
          <Stop offset={1} stopColor="#fd7694" />
        </LinearGradient>
        <LinearGradient
          id="prefix__d"
          x1={27.87}
          y1={9.93}
          x2={13.63}
          y2={32.75}
          gradientUnits="userSpaceOnUse">
          <Stop offset={0} stopColor="#ffcbd6" />
          <Stop offset={1} stopColor="#feadbf" />
        </LinearGradient>
        <LinearGradient
          id="prefix__e"
          x1={17.16}
          y1={18.72}
          x2={37.57}
          y2={32.79}
          gradientTransform="rotate(63.4 27.177 25.624)">
          <Stop offset={0} stopColor="#ff9fb3" />
          <Stop offset={1} stopColor="#fd7694" />
        </LinearGradient>
        <LinearGradient
          id="prefix__b"
          x1={17.58}
          y1={25.62}
          x2={36.77}
          y2={25.62}
          gradientTransform="rotate(63.4 27.177 25.624)"
          gradientUnits="userSpaceOnUse">
          <Stop offset={0} stopColor="#fff5f7" />
          <Stop offset={1} stopColor="#ffecf0" />
        </LinearGradient>
        <LinearGradient
          id="prefix__f"
          x1={17.16}
          y1={18.72}
          x2={37.57}
          y2={32.79}
          gradientTransform="rotate(63.4 27.177 25.624)">
          <Stop offset={0} stopColor="#ff9fb3" />
          <Stop offset={1} stopColor="#fd7694" />
        </LinearGradient>
        <LinearGradient id="prefix__g" x1={23.97} y1={25.62} x2={30.37} y2={25.62}>
          <Stop offset={0} stopColor="#fff5f7" />
          <Stop offset={1} stopColor="#ffecf0" />
        </LinearGradient>
        <LinearGradient
          id="prefix__c"
          x1={36.84}
          y1={35.74}
          x2={39.19}
          y2={33.36}
          gradientUnits="userSpaceOnUse">
          <Stop offset={0} stopColor="#ffccd7" />
          <Stop offset={1} stopColor="#fea3b7" />
        </LinearGradient>
        <LinearGradient id="prefix__h" x1={37.31} y1={30.9} x2={42.83} y2={30.9}>
          <Stop offset={0} stopColor="#ff9fb3" />
          <Stop offset={1} stopColor="#fd7694" />
        </LinearGradient>
        <LinearGradient id="prefix__i" x1={28.28} y1={25.76} x2={27.64} y2={26.85}>
          <Stop offset={0} stopColor="#ffccd7" />
          <Stop offset={1} stopColor="#fea3b7" />
        </LinearGradient>
        <LinearGradient id="prefix__j" x1={34.74} y1={29.56} x2={34.1} y2={30.65}>
          <Stop offset={0} stopColor="#ffccd7" />
          <Stop offset={1} stopColor="#fea3b7" />
        </LinearGradient>
        <LinearGradient id="prefix__k" x1={40.38} y1={33.74} x2={41.56} y2={33.74}>
          <Stop offset={0} stopColor="#ff9fb3" />
          <Stop offset={1} stopColor="#fd7694" />
        </LinearGradient>
      </Defs>
      <Rect width={36} height={36} rx={12.6} fill="#c1daf7" />
      <Path d="M16.63 36.35a4.72 4.72 0 01-.84-.49z" fill="url(#prefix__a)" />
      <Path
        d="M35.49 8.79l-1.37 2.76-13.6 27.35-1.74 3.51-5.27-3-1.07-.63c-2.18-1.58-3.51-4.65-3.51-8.87 0-8.74 5.73-19.14 12.79-23.22 3.19-1.84 6.12-2.08 8.36-1a5.13 5.13 0 01.72.41z"
        fill="url(#prefix__d)"
      />
      <Ellipse
        cx={27.17}
        cy={25.62}
        rx={18.77}
        ry={10.79}
        transform="rotate(-63.4 27.178 25.62)"
        fill="url(#prefix__e)"
      />
      <Ellipse
        cx={27.17}
        cy={25.62}
        rx={14.08}
        ry={8.09}
        transform="rotate(-63.4 27.178 25.62)"
        fill="url(#prefix__b)"
      />
      <Ellipse
        cx={27.17}
        cy={25.62}
        rx={9.39}
        ry={5.39}
        transform="rotate(-63.4 27.178 25.62)"
        fill="url(#prefix__f)"
      />
      <Ellipse
        cx={27.17}
        cy={25.62}
        rx={4.69}
        ry={2.7}
        transform="rotate(-63.4 27.178 25.62)"
        fill="url(#prefix__g)"
      />
      <Path
        d="M36.75 32v3.19a1.85 1.85 0 00.94 1.61 1.84 1.84 0 002.75-1.61v-1.07z"
        fill="url(#prefix__c)"
      />
      <Path
        d="M37.31 30.73l2.79-1.57a1.83 1.83 0 011.8 0 1.83 1.83 0 010 3.17l-.92.54z"
        fill="url(#prefix__h)"
      />
      <Path
        d="M28.58 25.9a1.27 1.27 0 01-.59 1c-.32.19-.59 0-.59-.34a1.33 1.33 0 01.59-1c.33-.19.59-.04.59.34z"
        fill="url(#prefix__i)"
      />
      <Path fill="url(#prefix__j)" d="M41.4 33.02l-12.98-7.49-.85 1.43 12.98 7.5.85-1.44z" />
      <Path
        d="M41.56 33.39a1.3 1.3 0 01-.59 1c-.32.19-.59 0-.59-.34a1.33 1.33 0 01.59-1c.33-.18.59-.05.59.34z"
        fill="url(#prefix__k)"
      />
      <Path fill="none" d="M0 0h48v48H0z" />
    </Svg>
  );
}

const InfoPersonalizeIcon = React.memo(InfoPersonalize);
export default InfoPersonalizeIcon;
