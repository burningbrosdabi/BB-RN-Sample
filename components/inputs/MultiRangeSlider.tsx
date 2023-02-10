import MultiSlider from '@ptomasroos/react-native-multi-slider';
import React from 'react';
import { View } from 'react-native';
import { Colors, Outlines } from '_styles';

const MultiRangeSlider = (props: {
    length: number,
    onDrag: (values: [number, number]) => void,
    onEndDrag: (values: [number, number]) => void,
    initialMinValue: number,
    initialMaxValue: number | null,
    lineWidth?: number
}) => {
    const _renderCustomMarker = () => {
        return (
            <View
                style={{
                    width: 16,
                    height: 16,
                    borderRadius: 11,
                    top: lineWidth / 2,
                    backgroundColor: Colors.red,
                }}
            />
        );
    };
    const {
        length,
        onDrag,
        onEndDrag,
        initialMinValue,
        initialMaxValue,
        lineWidth = Outlines.borderWidth.base,
    } = props;
    const color = Colors.primary;
    const minValue = initialMinValue ? initialMinValue : 0;
    const maxValue = initialMaxValue ? initialMaxValue : 1000000;

    return (
        <View style={{ alignItems: 'center' }}>
            <View
                style={{
                    height: lineWidth,
                    backgroundColor: Colors.surface.lightGray,
                    width: length,
                    position: 'absolute',
                    top: 25 - lineWidth / 2,
                }} />
            <MultiSlider
                values={[minValue, maxValue]}
                sliderLength={length}
                trackStyle={{
                    height: lineWidth,
                }}
                selectedStyle={{
                    backgroundColor: color,
                }}
                unselectedStyle={{
                    backgroundColor: Colors.surface.lightGray,
                }}
                min={0}
                max={1000000}
                step={1000}
                customMarkerLeft={_renderCustomMarker}
                customMarkerRight={_renderCustomMarker}
                allowOverlap={false}
                snapped
                isMarkersSeparated
                minMarkerOverlapDistance={1}
                touchDimensions={{
                    height: 100,
                    width: 100,
                    borderRadius: 50,
                    slipDisplacement: 200,
                }}
                // @ts-ignore
                onValuesChangeFinish={onEndDrag}
                onValuesChange={onDrag as (value: number[]) => void}
            />
        </View>
    );
};
export default MultiRangeSlider;
