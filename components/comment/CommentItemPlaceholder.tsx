import { range } from 'lodash';
import React from 'react';
import { View } from 'react-native';
import { PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { Colors, Spacing } from 'styles';
import { screen } from 'styles/spacing';

export const CommentItemPlaceholder = () => {
  return (
    <View
      style={{
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderColor: Colors.background,

        width: screen.width,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',

          width: '100%',
        }}>
        <PlaceholderMedia
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            marginRight: 8,
            backgroundColor: Colors.surface.white,
          }}
        />
        <View style={{ flex: 1 }}>
          <PlaceholderLine
            noMargin
            style={{
              height: 16,
              backgroundColor: Colors.surface.white,
              marginBottom: 4,
              width: '80%',
            }}
          />
          <PlaceholderLine
            noMargin
            style={{
              height: 16,
              backgroundColor: Colors.surface.white,
              marginBottom: 4,
              width: '60%',
            }}
          />
          <View style={{ flexDirection: 'row', marginBottom: 4 }}>
            <PlaceholderLine
              noMargin
              style={{
                height: 12,
                backgroundColor: Colors.surface.white,
                width: 40,
              }}
            />
            <View style={{ width: 24 }} />
            <PlaceholderLine
              noMargin
              style={{
                height: 12,
                backgroundColor: Colors.surface.white,
                width: 40,
              }}
            />
            <View style={{ width: 24 }} />
            <PlaceholderLine
              noMargin
              style={{
                height: 12,
                backgroundColor: Colors.surface.white,
                width: 40,
              }}
            />
          </View>
          {/*<PlaceholderLine*/}
          {/*  noMargin*/}
          {/*  style={{ height: 16, backgroundColor: Colors.surface.white, marginBottom: 4 }}*/}
          {/*/>*/}
        </View>
      </View>
    </View>
  );
};
