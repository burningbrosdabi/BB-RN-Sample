import React from 'react';
import { View } from 'react-native';
import { PlaceholderMedia, PlaceholderLine } from 'rn-placeholder';
import { Colors, Spacing } from 'styles';

export const OrderListBoxPlaceholder = () => {
  const width = (Spacing.screen.width - 16 * 2 - 12) / 2;
  return (
    <View style={{ paddingVertical: 12, borderBottomWidth: 4, borderColor: Colors.background, }}>
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
          height={16}
          style={{ width: 40, backgroundColor: Colors.surface.white }}
        />
      </View>
      <View style={{
        flexDirection: 'row',
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderColor: Colors.background
      }}>
        <PlaceholderMedia
          style={{
            width: 74,
            height: 92,
            backgroundColor: Colors.surface.white,
            marginRight: 12,
          }}
        />
        <View>
          <PlaceholderLine
            noMargin
            height={16}
            style={{
              width: Spacing.screen.width - 32 - 74 - 12,
              backgroundColor: Colors.surface.white,
              marginBottom: 4
            }}
          />
          <PlaceholderLine
            noMargin
            height={16}
            style={{ width: Spacing.screen.width - 32 - 74 - 12, backgroundColor: Colors.surface.white }}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }}>
            <PlaceholderLine
              noMargin
              height={16}
              style={{ width: 35, backgroundColor: Colors.surface.white }}
            />
            <PlaceholderLine
              noMargin
              height={16}
              style={{ width: 74, backgroundColor: Colors.surface.white }}
            />
          </View>
        </View>
      </View>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: 48,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: Colors.background
      }}>
        <PlaceholderLine
          noMargin
          height={21}
          style={{ width: 59, backgroundColor: Colors.surface.white, marginRight: 4, }}
        />
        <PlaceholderLine
          noMargin
          height={21}
          style={{ width: 86, backgroundColor: Colors.surface.white }}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, }}>
        <PlaceholderLine
          noMargin
          height={21}
          style={{ width: 116, backgroundColor: Colors.surface.white }}
        />
        <PlaceholderLine
          noMargin
          height={21}
          style={{ width: 85 + 24, backgroundColor: Colors.surface.white }}
        />
      </View>
      <PlaceholderLine
        noMargin
        height={21}
        style={{ width: 85 + 24, backgroundColor: Colors.surface.white, alignSelf: 'flex-end', marginTop: 12 }}
      />
    </View>
  );
};
