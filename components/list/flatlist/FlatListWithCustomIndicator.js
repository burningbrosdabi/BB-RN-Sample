import React, { Component } from 'react';
import { Animated, FlatList, Text, View } from 'react-native';
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';
import { Colors, Typography } from 'styles';
import theme from '_styles/legacy/theme.style';

const indicatorConfig = {
  color: Colors.white,
  margin: 3,
  opacity: 1,
  size: 6,
  width: 6,
}

const decreasingDotConfig = {
  config: { color: Colors.white, width: 6, margin: 3, opacity: 1, size: 6, },
  quantity: 1,
}

export default class FlatListWithCustomIndicator extends Component {
  constructor(props) {
    super(props);
    this._updateIndex = this._updateIndex.bind(this);
    this.viewabilityConfig = {
      itemVisiblePercentThreshold: 50,
    };
    this.state = { currentIndex: props.currentIndex || 1 };
  }
  scrollX = new Animated.Value(0);

  _updateIndex({ viewableItems }) {
    // getting the first element visible index
    try {
      this.setState({ currentIndex: viewableItems[0].index + 1 });
    } catch { }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentIndex !== this.props.currentIndex && this.props.currentIndex !== undefined) {
      this.setState({ currentIndex: this.props.currentIndex + 1 })
      this.flatListRef.scrollToIndex({ animated: true, index: this.props.currentIndex < this.props.data?.length - 1 ? this.props.currentIndex : this.props.data?.length - 1 });
    }
  }

  _renderIndex = () => {
    return (
      <View style={{ position: 'absolute', left: 0, bottom: 12 + 11, right: 16, alignItems: 'flex-end' }}>
        <AnimatedDotsCarousel
          length={this.props.data?.length}
          currentIndex={this.state.currentIndex - 1}
          maxIndicators={this.props.data?.length ?? 0}
          interpolateOpacityAndColor={false}
          activeIndicatorConfig={{ ...indicatorConfig, width: 12 }}
          inactiveIndicatorConfig={indicatorConfig}
          decreasingDots={[decreasingDotConfig, decreasingDotConfig]}
        />
      </View>
    );
  };


  render() {
    // const { forwardedRef, ...rest } = this.props;
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <FlatList
          // ref={forwardedRef}
          // {...rest}
          {...this.props}
          ref={(ref) => { this.flatListRef = ref; }}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          // the onScroll prop will pass a nativeEvent object to a function
          onScroll={Animated.event(
            // Animated.event returns a function that takes an array where the first element...
            [{ nativeEvent: { contentOffset: { x: this.scrollX } } }],
            { useNativeDriver: false }, // ... is an object that maps any nativeEvent prop to a variable
          )} // in this case we are mapping the value of nativeEvent.contentOffset.x to this.scrollX
          scrollEventThrottle={16} // this will ensure that this ScrollView's onScroll prop is called no faster than 16ms between each function call
          initialScrollIndex={this.state.currentIndex - 1}
          onViewableItemsChanged={this._updateIndex}
          viewabilityConfig={this.viewabilityConfig}
        />
        {!this.props.withoutIndicator && this._renderIndex()}
      </View>
    );
  }
}
