import React, { useState } from 'react';
import { LayoutChangeEvent, PanResponder, StyleSheet, Text, TextStyle, View } from 'react-native';
import { Colors, Typography } from 'styles';
import SeeMoreUtil from './SeeMoreUtil';

interface Props {
  children: string;
  numberOfLines: number;
  style?: TextStyle,
  linkStyle?: TextStyle;
  seeMoreText?: string;
  seeLessText?: string;
  canReadmore?: boolean;
  marginBottom?: number;
  onPress?: () => void;
}

interface ObjectType {
  [name: string]: any;
}

const ViewTextMore = ({
  children: text,
  numberOfLines,
  linkStyle,
  seeMoreText = " ...",
  seeLessText = " Ẩn bớt",
  style,
  canReadmore = true,
  onPress
}: Props) => {

  let containerWidthToTruncationIndexMap: ObjectType

  const panResponder = canReadmore ? PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderTerminationRequest: () => true,
    onPanResponderRelease: () => handleLinkReleased(),
  }) : undefined;

  const textLengh = text.length
  const [isShowingMore, setIsShowingMore] = useState(false)
  const [truncationIndex, setTruncationIndex] = useState(textLengh)
  const [containerWidth, setContainerWidth] = useState(0)

  const onLayout = (event: LayoutChangeEvent) => {
    event.persist();
    findAndUpdateTruncationIndex(event.nativeEvent.layout.width);
    setContainerWidth(event.nativeEvent.layout.width)
  };

  const findAndUpdateTruncationIndex = async (containerWidth: number) => {
    const truncationIndex = await findTruncationIndex(containerWidth);
    setTruncationIndex(truncationIndex)
  };

  const findTruncationIndex = async (containerWidth: number) => {
    if (
      containerWidthToTruncationIndexMap &&
      containerWidthToTruncationIndexMap[containerWidth]
    ) {
      return containerWidthToTruncationIndexMap[containerWidth];
    }

    const truncationIndex = await SeeMoreUtil.getTruncationIndex({
      text: text,
      numberOfLines,
      fontSize: styles.commonText.fontSize || 14,
      fontFamily: styles.commonText.fontFamily,
      fontWeight: styles.commonText.fontWeight,
      containerWidth,
      seeMoreText,
    });

    containerWidthToTruncationIndexMap = {
      ...containerWidthToTruncationIndexMap,
      [containerWidth]: truncationIndex,
    };

    return truncationIndex;
  };

  const handleLinkReleased = () => {
    if (onPress) onPress();
    else
      setIsShowingMore(!isShowingMore)
  }


  const isTruncable = truncationIndex < textLengh;
  const renderSeeMoreSeeLessLink = () => {
    if (!isTruncable) {
      return null;
    }

    return (
      <Text style={[Typography.option, { color: Colors.surface.midGray }, linkStyle]} {...panResponder?.panHandlers}>
        {isShowingMore ? `${seeLessText}` : `${seeMoreText}`}
      </Text>
    );
  }

  return (
    <View>
      <Text
        style={[
          styles.commonText,
          style]}
        onLayout={isShowingMore ? undefined : onLayout}
        numberOfLines={isShowingMore ? undefined : numberOfLines}
        {...panResponder?.panHandlers}>
        <Text>{isShowingMore ? text : text.slice(0, truncationIndex).trim()}</Text>
        {renderSeeMoreSeeLessLink()}
      </Text>
    </View>
  )
}

export default React.memo(ViewTextMore);

const styles = StyleSheet.create({
  commonText: {
    ...Typography.body,
  },
});