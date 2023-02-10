

import { Animation } from 'components/animation';
import { Header } from 'components/header/Header';
import ProductFeedbackItem from 'components/list/feedbacks/ProductFeedbackItem';
import FlatListWithCustomIndicator from 'components/list/flatlist/FlatListWithCustomIndicator';
import { ProductUserFeedbackItem } from 'model';
import React, { useCallback, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageZoom from 'react-native-image-pan-zoom';
import { Spacing } from 'styles';
import { defaultAvatar } from 'utils/constant';


interface Props {
  navigation: any;
  route: {
    params: {
      data: ProductUserFeedbackItem,
      currentIndex: number,
      itemIndex: number,
      zoomable?: boolean,
    }
  }
}

const ProductFeedbackImageScreen = ({ navigation, route }: Props) => {
  const { data, currentIndex = 0, itemIndex = 0, zoomable = false } = route?.params;
  const [isShowInfo, setIsShowInfo] = useState(true);

  const {
    user,
    image_1,
    image_2,
    image_3,
    image_4,
    image_5,
  } = data;
  let media = [image_1, image_2, image_3, image_4, image_5].filter(res => res);
  media = media.length > 0 ? media : [require('_assets/images/avatar/default_ava.png')];

  const _keyExtractor = useCallback((item: string, index: number) => item + index, []);

  const _renderItem = useCallback(({ item, index }: { item: string, index: number }) => {
    return (
      <TouchableWithoutFeedback onPress={() => toggleShowInfo()}>
        <View style={styles.itemContainer}>
          {zoomable ? <ImageZoom
            cropHeight={Spacing.screen.height}
            cropWidth={Spacing.screen.width}
            imageWidth={Spacing.screen.width}
            imageHeight={Spacing.screen.height}>
            <FastImage
              source={typeof item == 'number' ? item : { uri: item }}
              resizeMode='contain'
              style={styles.imageContent}
            />
          </ImageZoom> :
            <FastImage
              source={typeof item == 'number' ? item : { uri: item }}
              resizeMode='contain'
              style={styles.imageContent}
            />
          }
        </View>
      </TouchableWithoutFeedback>
    );
  }, [currentIndex, isShowInfo]);

  const _renderInfo = () => {
    return (
      <View style={styles.inforContainer}>
        <ProductFeedbackItem
          showImage={false}
          darkColor
          data={data}
          index={itemIndex}
          style={{ borderBottomWidth: 0 }}
        />
      </View>
    );
  };

  const toggleShowInfo = () => {
    setIsShowInfo(!isShowInfo)
  };
  return (
    <View style={styles.container}>
      {/*<BackButton containerStyle={styles.backButton} />*/}
      <View style={{ position: 'absolute', zIndex: 1 }}>
        <SafeAreaView>
          <Header icColor='white' />
        </SafeAreaView>
      </View>
      <View style={{ alignItems: 'center', flex: 1 }}>
        <FlatListWithCustomIndicator
          data={media}
          renderItem={_renderItem}
          keyExtractor={_keyExtractor}
          withoutIndicator={zoomable}
          centerIndex
          dotIndicator
          onImage
          scrollEnabled={true}
          getItemLayout={(data: any, index: number) => {
            return {
              length: Spacing.screen.width,
              offset: Spacing.screen.width * index,
              index
            };
          }}
          dotIndicatorStyle={styles.indicatorStyle}
          contentContainerStyle={{ alignItems: 'center', zIndex: 100 }}
          currentIndex={currentIndex + 1}
        />
        {(isShowInfo && !zoomable) ? _renderInfo() : undefined}
      </View>
    </View >
  );
};

export default React.memo(ProductFeedbackImageScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  backButton: {
    top: Platform.OS === 'ios' ? 30 * Spacing.AUTH_RATIO_H : 10,
    alignItems: 'flex-start',
  },
  itemContainer: {
    width: Spacing.screen.width,
    height: Spacing.screen.height,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageContent: {
    width: Spacing.screen.width,
    height: Spacing.screen.height,
  },
  indicatorStyle: {
    bottom: 170, //TODO Need to refactor.
    position: 'relative'
  },
  inforContainer: {
    position: 'absolute',
    bottom: 0,
    paddingBottom: 30,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  }
});
