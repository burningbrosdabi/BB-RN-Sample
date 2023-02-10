import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, TouchableWithoutFeedback, View, Text, Image, ViewToken } from 'react-native';
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';
import FastImage from 'react-native-fast-image';
import { Colors, Spacing } from 'styles';
import AutoHeightImage from 'react-native-auto-height-image';
import { RelatedProduct } from 'model/product/related.product';
import IconButton from 'components/button/IconButton';
import FeedProductTag from 'components/list/feedbacks/tag/FeedProductTag';
import { isNaN, isNil } from 'lodash';
import { toast } from 'components/alert/toast';
import { DabiFont } from 'assets/icons';
import { FeatureMeasurement } from 'components/tutorial';

const activeConfig = {
  color: 'white',
  margin: 3,
  opacity: 1,
  size: 6,
  width: 12,
};

const descreasingDot = {
  config: { color: 'white', width: 6, margin: 3, opacity: 1, size: 6 },
  quantity: 1,
};

export const ImageSlider = ({ images, related_products, onPress }: { images: string[]; related_products?: RelatedProduct[]; onPress: () => void }) => {
  const [index, setIndex] = useState(0);
  const [showPin, setShowPin] = useState(false);
  const [imageWidth, setImageWidth] = useState(Spacing.screen.width);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    Image.getSize(images[0], (width, height) => {
      setImageWidth(width)
    });
  }, [images])

  const renderItem = ({ item, index }: { item: string; index: number }) => {
    if (index === 0) {
      return (
        <TouchableWithoutFeedback onPress={() => setShowPin(!showPin)} key={`${index}`}>
          <View style={{ minHeight: Spacing.screen.width, backgroundColor: Colors.background }}>
            <AutoHeightImage
              width={Spacing.screen.width}
              source={{ uri: item }}
            />
            {showPin && related_products && related_products.map((item: RelatedProduct) => {
              const pin_x = item.pinned_position_x * (Spacing.screen.width / imageWidth) || 0
              const pin_y = item.pinned_position_y * (Spacing.screen.width / imageWidth) || 0

              if (!isNaN(pin_x) && !isNaN(pin_y)) {
                return <View
                  style={{
                    position: 'absolute',
                    top: !isNaN(pin_y) ? pin_y : 0, left: !isNaN(pin_x) ? pin_x : 0,
                  }}>
                  <FeedProductTag data={item} />
                </View>
              }
            })}
            <View
              style={{ position: 'absolute', bottom: 12, left: 16 }}>
              {/* <FeatureMeasurement
                id={'feed-tag'}
                title={'Hiển thị nhãn dán với thông tin đầy đủ về sản phẩm của KOLs!'}
                description={
                  'Bạn có thể xem nhanh thông tin về sản phẩm chỉ bằng một lần bấm, hãy tìm ngay cho mình những sản phẩm phù hợp!!'
                }
                overlay={
                  <DabiFont name={'tag'} />
                }> */}
              {related_products && related_products.length > 0 ?
                <IconButton
                  icon='tag'
                  color={Colors.white}
                  onPress={() => setShowPin(!showPin)} /> : <></>
              }
              {/* </FeatureMeasurement> */}
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    }
    return (
      <TouchableWithoutFeedback onPress={onPress} key={`${index}`}>
        <FastImage
          style={{ width: Spacing.screen.width }}
          // width={}
          source={{ uri: item }}
        />
      </TouchableWithoutFeedback>
    );
  };

  const onViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const { index: activeIndex } = viewableItems[0];
      setIndex(activeIndex ?? 0);
    }
  };
  const viewabilityConfigCallbackPairs = useRef([{
    viewabilityConfig: { itemVisiblePercentThreshold: 70 },
    onViewableItemsChanged: onViewableItemsChanged
  }])




  const list = useMemo(() => {
    return (
      <FlatList<string>
        decelerationRate={'fast'}
        overScrollMode={'never'}
        pagingEnabled
        snapToAlignment={'center'}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
        snapToInterval={Spacing.screen.width}
        maxToRenderPerBatch={1}
        horizontal
        showsHorizontalScrollIndicator={false}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        data={images}
        renderItem={renderItem}
      />
    );
  }, [images, showPin]);
  return (
    <View style={{ flex: 1 }}>
      {images.length <= 1 ? (
        renderItem({ item: images[0], index: 0 })
      ) : (
        <>
          {list}
          <View style={{ position: 'absolute', left: 0, bottom: 12 + 11, right: 16, alignItems: 'flex-end' }}>
            <AnimatedDotsCarousel
              length={images.length}
              currentIndex={index}
              maxIndicators={images.length}
              interpolateOpacityAndColor={false}
              activeIndicatorConfig={activeConfig}
              inactiveIndicatorConfig={{ ...activeConfig, width: 6 }}
              decreasingDots={[descreasingDot, descreasingDot]}
            />
          </View>
        </>
      )}
    </View>
  );
};
