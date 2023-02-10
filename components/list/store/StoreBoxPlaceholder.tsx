import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { Colors, Outlines, Spacing } from 'styles';

export const StoreBoxPlaceholderRow = () => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <StoreBoxPlaceholder />
    </View>
  );
};

export const StoreBoxPlaceholder = () => {
  const width = (Spacing.screen.width - 16 * 4) / 3;
  return (
    <View style={styles.storeBoxContainer}>
      <PlaceholderMedia
        style={{
          width,
          height: (width / 4) * 5,
          backgroundColor: Colors.surface.white,
        }}
      />
      <PlaceholderMedia
        style={{
          width,
          height: (width / 4) * 5,
          backgroundColor: Colors.surface.white,
        }}
      />
      <View
        style={{
          width,
          height: (width / 4) * 5,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors.surface.white,
        }}>
        <PlaceholderMedia
          style={{
            width: 40,
            height: 40,
            borderRadius: 40 / 2,
            backgroundColor: Colors.surface.white,
          }}
        />
        <PlaceholderLine
          noMargin
          height={19}
          style={{
            width: '70%',
            backgroundColor:
              Colors.surface.white,
            marginTop: 8,
            marginBottom: 10
          }}
        />
        <PlaceholderLine
          noMargin
          height={28}
          style={{ width: '80%', backgroundColor: Colors.surface.white }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  storeBoxContainer: {
    flexDirection: 'row',
    flex: 1,
    borderBottomWidth: Outlines.borderWidth.base,
    borderColor: Colors.surface.lightGray,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 17,
    paddingHorizontal: 16,
  },
});

