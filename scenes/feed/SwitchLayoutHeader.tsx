import { Layout } from 'components/list/post/FeedbackList.v2';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import IconButton from 'components/button/IconButton';
import { Colors, Typography } from 'styles';
import { ToolTip } from 'components/tooltip';
import { storeKey } from 'utils/constant';
import { screen } from 'styles/spacing';
import { Button, ButtonType, LayoutConstraint } from 'components/button/Button';

export const SwitchLayoutHeader = ({
  swicthLayout,
  title,
}: {
  swicthLayout: (layout: Layout) => void;
  title?: string;
}) => {
  const [layout, setLayout] = useState(Layout.list);

  useEffect(() => {
    swicthLayout(layout);
  }, [layout]);

  return (
    <View style={styles.orderingContainer}>
      <Text style={Typography.title}>{title}</Text>
      <View style={{ flex: 1 }} />
      <IconButton
        onPress={() => {
          if (layout !== Layout.list) {
            setLayout(Layout.list);
          }
        }}
        source={
          layout === Layout.list
            ? require('assets/images/icon/fullpost_filled.png')
            : require('assets/images/icon/fullpost_line.png')
        }
      />

      <ToolTip
        showChildInTooltip={false}
        cacheKey={storeKey.changeLayoutTooltip}
        text={'Bạn có thể đổi cách hiển thị bài viết tại đây'}
        tooltipStyle={{transform: [{translateX: 12}]}}
        placement={'top'}>
        <IconButton
          onPress={() => {
            if (layout !== Layout.grid) {
              setLayout(Layout.grid);
            }
          }}
          source={
            layout === Layout.grid
              ? require('assets/images/icon/gridpost_filled.png')
              : require('assets/images/icon/gridpost_line.png')
          }
        />
      </ToolTip>
    </View>
  );
};
const styles = StyleSheet.create({
  orderingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
  },
});
