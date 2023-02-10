import MultiRangeSlider from 'components/inputs/MultiRangeSlider';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, Typography } from 'styles';
import { toPriceFormat } from '_helper';
import Button, { ButtonState, ButtonType } from 'components/button/Button';
import { screen } from 'styles/spacing';
import { RadioCircleButton } from 'components/button/RadioCircleButton';

export type PriceFilterRef = {
  reset: () => void;
};

type Props = {
  initialPrice: [number, number | null];
  initialIsDiscount: boolean;
  setPrice: (value: [number, number | null]) => void;
  setIsDiscount: (value: boolean) => void;
};

const MAX_PRICE = 1e6;

const PriceFilter = forwardRef(
  ({ initialPrice, initialIsDiscount, setPrice, setIsDiscount }: Props, ref) => {
    const [priceValues, setPriceValues] = useState<[number, number | null]>(initialPrice);
    const [isDiscount, _setIsDiscount] = useState(initialIsDiscount);
    useImperativeHandle<unknown, PriceFilterRef>(ref, () => ({
      reset: () => {
        setPriceValues([0, null]);
          _setIsDiscount(false);
      },
    }));
    const onDrag = ([minValue, maxValue]: [number, number]) => {
      setPriceValues([minValue, maxValue === MAX_PRICE ? null : maxValue]);
    };

    const onEndDrag = ([minValue, maxValue]: [number, number]) => {
      setPrice([minValue, maxValue === MAX_PRICE ? null : maxValue]);
    };

    const onPress = () => {
      setPriceValues([1e5, 3e5]);
    };

    useEffect(() => {
      setIsDiscount(isDiscount);
    }, [isDiscount]);

    const ranges = useMemo<[number, number | number][]>(() => {
      return [
        [0, 2e5],
        [2e5, 4e5],
        [4e5, 6e5],
        [6e5, null],
      ];
    }, []);

    const rangeString = useMemo(() => {
      return ['0 ~ 200k', '200k ~ 400k', '400k ~ 600k', '600k ~'];
    }, []);

    return (
      <View style={styles.multiRangeSliderContainer}>
        <Text style={styles.priceText}>
          {toPriceFormat(priceValues[0])} ~ {priceValues[1] && toPriceFormat(priceValues[1])}
        </Text>
        <MultiRangeSlider
          initialMinValue={priceValues[0] ?? 0}
          initialMaxValue={priceValues[1]}
          onEndDrag={onEndDrag}
          onDrag={onDrag}
          length={Spacing.screen.width - 24 * 4}
        />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
          {ranges.map((values, index) => {
            const selected =
              between(priceValues[0], values[0], values[1]) &&
              between(priceValues[1] ?? MAX_PRICE, values[0], values[1] ?? MAX_PRICE);
            const endOfRow = index === 1 || index === 3;
            const buttonWidth = (screen.width - 32 - 12) / 2;
            return (
              <View
                style={{
                  width: buttonWidth,
                  height: 48,
                  marginRight: endOfRow ? 0 : 12,
                  marginBottom: 12,
                }}>
                <Button
                  state={!selected ? ButtonState.idle : ButtonState.focused}
                  text={rangeString[index]}
                  type={ButtonType.option}
                  onPress={() => {
                    setPriceValues(ranges[index]);
                    setPrice(ranges[index]);
                  }}
                />
              </View>
            );
          })}
        </View>
        <View style={{ height: 12 }} />
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'flex-start' }}>
          <RadioCircleButton
            radius={24}
            onPress={() => {
              _setIsDiscount(!isDiscount);
            }}
            nonIconChecked
            buttonStyle={{
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: Colors.primary,
            }}
            selected={isDiscount}
          />
          <View style={{ width: 12 }} />
          <Text onPress={() => {
              _setIsDiscount(!isDiscount);
          }} style={[Typography.body, { color: Colors.text }]}>Chỉ sản phẩm đang giảm giá</Text>
        </View>
      </View>
    );
  },
);

const between = (value: number, start: number, end?: number) => {
  return value >= start && value <= (end ?? MAX_PRICE);
};

export default PriceFilter;

const styles = StyleSheet.create({
  priceText: {
    ...Typography.title,
    color: Colors.primary,
    textTransform: 'none',
  },
  multiRangeSliderContainer: {
    alignItems: 'center',
  },
});
