import { ProductBoxPlaceholderRow } from 'components/list/product/ProductBox';
import { range } from 'lodash';
import React from 'react';
import { View } from 'react-native';
import { PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { Colors, Spacing } from 'styles';


export const StoreListBoxPlaceholder = () => {
  return (
    <View style={{ paddingBottom: 24, marginBottom: 12, borderBottomWidth: 1, borderColor: Colors.background, }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <PlaceholderMedia
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginRight: 12,
              backgroundColor: Colors.surface.white,
            }}
          />
          <View>
            <PlaceholderLine
              noMargin
              height={21}
              style={{ width: 114, backgroundColor: Colors.surface.white, marginBottom: 4 }}
            />
            <PlaceholderLine
              noMargin
              height={16}
              style={{ width: 56, backgroundColor: Colors.surface.white }}
            />
          </View>
        </View>
        <PlaceholderLine
          noMargin
          height={28}
          style={{ width: 84, backgroundColor: Colors.surface.white, marginTop: -6 }}
        />
      </View>
      {range(2).map((_, index) => {
        return (
          <View key={index} style={{ marginBottom: 36 }}>
            <ProductBoxPlaceholderRow key={index} />
          </View>
        )
      })}
      <PlaceholderLine
        noMargin
        height={48}
        style={{
          width: Spacing.screen.width - 32,
          backgroundColor: Colors.surface.white,
          marginTop: 12,
          borderRadius: 4
        }}
      />
    </View>
  );
};
