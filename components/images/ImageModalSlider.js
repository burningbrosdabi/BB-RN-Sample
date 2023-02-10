import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';
import { Colors, applyOpacity, Spacing } from '_styles';
import theme from '_styles/legacy/theme.style';
import BackButton from '../header/BackButton';
import ImageModal from './ImageModal';
import FlatListWithCustomIndicator from 'components/list/flatlist/FlatListWithCustomIndicator';

const activeConfig = {
  color: 'white',
  margin: 3,
  opacity: 1,
  size: 6,
  width: 12
}

const decreasingDotConfig = {
  config: { color: 'white', width: 6, margin: 3, opacity: 1, size: 6, },
  quantity: 1,
}

const ImageModalSlider = (props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { imageSet } = props;
  const imageSets = imageSet.map(res => {
    return {
      ...res,
      url: res.source.replace('_tn', '').replace('_compact', '').replace('_large', ''),
      width: Spacing.screen.width,
      height: Spacing.screen.width,
    }
  })

  const onChange = useCallback((index) => {
    setCurrentIndex(index)
  }, [])

  const onOpen = useCallback((index) => {
    setCurrentIndex(index)
  }, [])

  const _keyExtractor = useCallback((item, index) => item.source_thumb + index.toString(), []);
  const _renderItem = useCallback(({ item, index }) => {
    const sourceURL = item.source.replace('_tn', '').replace('_compact', '').replace('_large', '');
    return (
      <ImageModal
        // resizeMode="contain"
        imageBackgroundColor={Colors.surface.lightGray}
        overlayBackgroundColor={applyOpacity('#000000', 1)}
        renderHeader={(onClose) => {
          return (
            <View style={{ marginTop: 60, alignItems: 'flex-start' }}>
              <BackButton color={Colors.white} handleOnPress={onClose} />
            </View>
          );
        }}
        renderFooter={renderIndicator}
        style={{
          width: Spacing.screen.width,
          height: Spacing.screen.width,
        }}
        source={{
          uri: sourceURL,
        }}
        currentImageIndex={index}
        currentIndex={currentIndex}
        imageSets={imageSets}
        onChange={onChange}
        onOpen={onOpen}
        swipeToDismiss={false}
      />
    );
  }, [currentIndex])
  const renderIndicator = useCallback((onClose, currentImageIndex) => {
    return (
      <View style={{
        alignSelf: 'center',
        position: 'absolute',
        bottom: 64,
      }}>
        <AnimatedDotsCarousel
          length={imageSets.length}
          currentIndex={currentImageIndex}
          maxIndicators={imageSets.length}
          interpolateOpacityAndColor={false}
          activeIndicatorConfig={activeConfig}
          inactiveIndicatorConfig={{ ...activeConfig, width: 6 }}
          decreasingDots={[decreasingDotConfig, decreasingDotConfig]}
        />
      </View>
    )
  }, [])

  return (
    <FlatListWithCustomIndicator
      data={imageSet}
      renderItem={_renderItem}
      keyExtractor={_keyExtractor}
      showIndex
      centerIndex
      dotIndicator
      onImage
      maxToRenderPerBatch={1}
      initialNumToRender={1}
      updateCellsBatchingPeriod={4000}
      scrollEnabled={true}
      currentIndex={currentIndex}
      getItemLayout={(data, index) => {
        return {
          length: Spacing.screen.width,
          offset: Spacing.screen.width * index,
          index
        };
      }}
    />
  )
}

const Styles = StyleSheet.create({
  indicatorContainer: {

  },
});

export default React.memo(ImageModalSlider);