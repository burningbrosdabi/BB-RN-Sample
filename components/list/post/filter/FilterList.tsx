import { MultiColorIcon } from 'assets/icons';
import { Button, ButtonState, ButtonType, LayoutConstraint } from 'components/button/Button';
import { RadioCircleButton } from 'components/button/RadioCircleButton';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { Colors, Spacing, Typography } from '_styles';


const FilterList = (props) => {
  const renderFilterItem = ({ item, index, filter, setFilter, buttonType, fullWidth, isRadio }) => {
    const addFilter = (tag, list, setList) => {
      if (list.includes(tag)) {
        setList(list.filter((item) => item !== tag));
      } else {
        const newList = [...list, tag];
        newList.sort((a, b) => a > b);
        setList(newList);
      }
    };

    const onPress = () => {
      if (isRadio) {
        if (item.key == filter) {
          setFilter(undefined)
          return
        }
        setFilter(item.key)
      } else {
        addFilter(item.key, filter, setFilter);
      }
    };

    const selected = isRadio ? filter == item.key : filter.includes(item.key);
    switch (buttonType) {
      case 'text':
        let width = (Spacing.screen.width - 32 - 12) / 2
        let marginLeft = index % 2 != 0 ? 12 : 0
        if (fullWidth) {
          width = Spacing.screen.width - 32
          marginLeft = 0
        }
        return (
          <View key={index} style={{ width, marginBottom: 12, marginLeft }}>
            <Ripple
              onPress={onPress}
              style={{
                paddingVertical: 12, paddingHorizontal: 12,
                backgroundColor: selected ? Colors.black : Colors.background,
                borderRadius: 24,
                alignItems: 'center'
              }}
              rippleContainerBorderRadius={14}
            >
              <Text style={{ ...Typography.body, color: selected ? Colors.white : Colors.black }}>{item.description}</Text>
            </Ripple>
          </View>
        );

      case 'hashtag':
        return (
          <View key={index} style={{ height: 28, marginBottom: 8, marginRight: 8, borderRadius: 14 }}>
            <Ripple
              onPress={onPress}
              style={{
                paddingVertical: 4, paddingHorizontal: 12,
                backgroundColor: selected ? Colors.black : Colors.background,
                borderRadius: 14
              }}
              rippleContainerBorderRadius={14}
            >
              <Text style={{ ...Typography.body, color: selected ? Colors.white : Colors.black }}>#{item.description}</Text>
            </Ripple>
          </View>
        );

      default:
        return (
          <View
            style={[
              styles.circleButtonContainer,
              (index + 1) % 6 === 0 ? { marginRight: 0 } : null,
              index % 6 === 0 ? { marginLeft: 0 } : null,
              index % 6 === 1 ? { marginRight: 0 } : null,
            ]}
            key={index}>
            <RadioCircleButton
              color={item.color && item.color}
              onPress={onPress}
              selected={selected}
              colorCheck={item.colorCheck}
              label={item.description}
              image={item.image}
              border={item.key === 'white'}
              icon={item.key === 'multiple' && <MultiColorIcon size={40} />}
            />
          </View>
        );
    }
  };

  return (
    <View style={styles.iconRowContainer}>
      {props.filterList.map((item, index) => renderFilterItem({ item, index, ...props }))}
    </View>
  );
};

export default React.memo(FilterList);

const styles = StyleSheet.create({
  sectionTitle: {
    ...Typography.description,
    color: Colors.surface.darkGray,
    paddingLeft: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  iconRowContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  circleButtonContainer: {
    marginBottom: 12,
    width: (Spacing.screen.width - 16 * 2 - 1) / 6,
  },
  multiRangeSliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 16,
  },
});
