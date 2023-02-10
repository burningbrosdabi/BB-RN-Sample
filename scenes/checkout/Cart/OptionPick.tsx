import Button, { ButtonState, ButtonType, LayoutConstraint } from 'components/button/Button';
import { first, pick } from 'lodash';
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { colorPrefix, optionColorCheck, OptionType, productOptionColor } from 'services/api/cart';
import { IOptionContext, OptionContext } from './context';
import { Colors, Typography } from 'styles';
import MultiColorIcon from '../../../assets/icons/product/MultiColorIcon';
import { DabiFont } from '_icons';

const titleMap: { [id in OptionType]: string } = {
  color: 'Màu',
  size: 'Kích Thước',
  extra_option: 'Khác',
};

export const OptionPickView = () => {
  const { optionData } = useContext<IOptionContext>(OptionContext);

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
      <View style={{ height: 8 }} />
      {Object.keys(optionData).map(key => {
        return <OptionsSection key={key} optionKey={key as OptionType} />;
      })}
    </ScrollView>
  );
};
const OptionsSection = ({ optionKey }: { optionKey: OptionType }) => {
  const {
    optionData,
    selectedOptions,
    stockData,
    initialOption,
    setSelectedOptions,
    availableKeys: stockKeys,
  } = useContext<IOptionContext>(OptionContext);

  const option = useMemo(() => {
    const option = optionData[optionKey];
    if (initialOption?.type && initialOption?.type === optionKey) return option;

    const availableKeys = Object.keys(option).filter(key => {
      return Object.keys(stockData).some(_key => _key.includes(key));
    });
    return pick(option, availableKeys);
  }, [optionData, stockData]);

  useEffect(() => {
    /// auto select if having only 1 option
    const selectedKey = selectedOptions[optionKey];
    const keys = Object.keys(option);

    // skip if having more than 1 options
    const autoPickedKeys = keys.filter(k => {
      return stockKeys.some(sk => sk.includes(k));
    });

    if (autoPickedKeys.length !== 1 && stockKeys.length > 1) return;

    const firstKey = first(autoPickedKeys);

    if (!firstKey) return;
    if (selectedKey !== firstKey && stockKeys.some(k => k.includes(firstKey))) {
      setSelectedOptions(optionKey, firstKey);
    }
  }, [option, selectedOptions, stockData]);

  return (
    <View key={optionKey}>
      <View style={{ height: 16 }} />
      <Text style={Typography.title}>{titleMap[optionKey]}</Text>
      <View style={{ height: 12 }} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {Object.keys(option).map(itemKey => (
          <View key={`${optionKey}.${itemKey}`} style={{ marginBottom: 12 }}>
            {optionKey === OptionType.color ? (
              <View style={{ marginRight: 12 }}>
                <ColorPickItem itemKey={itemKey} />
              </View>
            ) : (
              <View style={{ marginRight: 4 }}>
                <OptionPickItem optionKey={optionKey as OptionType} itemKey={itemKey} />
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const OptionPickItem = ({ optionKey, itemKey }: { optionKey: OptionType; itemKey: string }) => {
  const {
    selectedOptions,
    initialOption,
    optionData,
    setSelectedOptions,
    availableKeys: stockKeys,
  } = useContext<IOptionContext>(OptionContext);

  const selected = useMemo(() => {
    return selectedOptions[optionKey] === itemKey;
  }, [selectedOptions]);

  const disabled = useMemo(() => {
    if (selected) return false;
    const res = !stockKeys.some(k => k.includes(itemKey));
    return res;
  }, [selected, stockKeys, initialOption]);

  const onPress = () => {
    setSelectedOptions(optionKey, itemKey, disabled);
  };

  return (
    <Button
      color={selected ? undefined : Colors.surface.lightGray}
      textStyle={selected ? undefined : { color: Colors.surface.darkGray }}
      style={{ opacity: disabled ? 0.2 : 1 }}
      state={selected ? ButtonState.focused : ButtonState.idle}
      type={selected ? ButtonType.option : ButtonType.outlined}
      onPress={onPress}
      text={optionData[optionKey as OptionType][itemKey]}
      constraint={LayoutConstraint.wrapChild}
    />
  );
};

const ColorPickItem = ({ itemKey }: { itemKey: string }) => {
  const {
    selectedOptions,
    initialOption,

    setSelectedOptions,
    availableKeys: stockKeys,
  } = useContext<IOptionContext>(OptionContext);
  const optionKey = useRef(OptionType.color).current;

  const selected = useMemo(() => {
    return selectedOptions[optionKey] === itemKey;
  }, [selectedOptions]);

  const disabled = useMemo(() => {
    if (selected) return false;
    const res = !stockKeys.some(k => k.includes(itemKey));
    return res;
  }, [selected, stockKeys, initialOption]);

  const onPress = () => {
    setSelectedOptions(optionKey, itemKey, disabled);
  };

  const key = useMemo(() => {
    const re = new RegExp(`(?<=${colorPrefix})(.*)(?=#)`);
    const key = first(itemKey.match(re));
    if (!key) return undefined;
    return key;
  }, [itemKey]);

  return (
    <TouchableOpacity
      disable
      onPress={onPress}
      style={{
        height: 24,
        width: 24,
      }}>
      {itemKey !== '#color_multiple#' ? (
        <View
          style={{
            flex: 1,
            borderRadius: 12,
            backgroundColor: productOptionColor[key],
            ...(productOptionColor[key] === '#FFFFFF'
              ? {
                  borderWidth: 1,
                  borderColor: Colors.button,
                }
              : undefined),
          }}
        />
      ) : (
        <MultiColorIcon size={24} />
      )}
      {selected && (
        <View
          style={{
            position: 'absolute',
            flex: 1,
            // backgroundColor: 'rgba(0,0,0,0.1)',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <DabiFont
            name={'small_check'}
            size={10}
            color={optionColorCheck[key] ? Colors.black : Colors.white}
          />
        </View>
      )}
      {disabled && (
        <View
          style={{
            position: 'absolute',
            flex: 1,
            backgroundColor: 'rgba(255,255,255,0.8)',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      )}
    </TouchableOpacity>
  );
};
