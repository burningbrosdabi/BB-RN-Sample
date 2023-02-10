import { range } from 'lodash';
import React from 'react';
import { View } from 'react-native';
import { PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { Colors, Spacing } from 'styles';

export const UserFeedbackItemPlaceholder = () => {
  return (
    <View style={{ paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 4, borderColor: Colors.background, }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        width: '100%',
        borderWidth: 1,
        // height: 116,
        borderColor: Colors.background,
        padding: 12,
      }}>
        <PlaceholderMedia
          style={{
            width: 68,
            height: 90,
            borderRadius: 4,
            marginRight: 12,
            backgroundColor: Colors.surface.white,
          }}
        />
        <View>
          <PlaceholderLine
            noMargin
            height={14}
            style={{ width: 58, backgroundColor: Colors.surface.white, marginBottom: 4 }}
          />
          <PlaceholderLine
            noMargin
            height={17}
            style={{ width: Spacing.screen.width - 32 - 68 - 24 - 12, backgroundColor: Colors.surface.white, marginBottom: 4 }}
          />
          <PlaceholderLine
            noMargin
            height={17}
            style={{ width: Spacing.screen.width - 32 - 68 - 24 - 12, backgroundColor: Colors.surface.white, marginBottom: 4 }}
          />
          <PlaceholderLine
            noMargin
            height={17}
            style={{ width: 87, backgroundColor: Colors.surface.white }}
          />
        </View>
      </View>
      <PlaceholderLine
        noMargin
        height={12}
        style={{ width: 76, backgroundColor: Colors.surface.white, marginBottom: 12 }}
      />
      <PlaceholderLine
        noMargin
        height={16}
        style={{ width: 137, backgroundColor: Colors.surface.white, marginBottom: 4 }}
      />
      <View>
        <PlaceholderLine
          noMargin
          height={16}
          style={{
            width: Spacing.screen.width - 32,
            backgroundColor: Colors.surface.white,
            marginBottom: 4
          }}
        />
        <PlaceholderLine
          noMargin
          height={16}
          style={{ width: Spacing.screen.width - 32, backgroundColor: Colors.surface.white }}
        />
        {/* <PlaceholderLine
          noMargin
          height={20}
          style={{ width: 71, backgroundColor: Colors.surface.white, marginTop: 4 }}
        /> */}
      </View>
      <View style={{
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        {range(5).map((_, index) => {
          return <PlaceholderMedia
            key={index}
            style={{
              width: 78,
              height: 78,
              borderRadius: 4,
              marginRight: 12,
              backgroundColor: Colors.surface.white,
            }}
          />
        })}
      </View>
    </View>
  );
};
