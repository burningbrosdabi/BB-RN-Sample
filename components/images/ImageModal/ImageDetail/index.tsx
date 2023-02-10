import React from 'react';
import { Animated, Dimensions, Modal, PanResponder, PanResponderInstance, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import type { ImageStyle, ResizeMode, Source } from 'react-native-fast-image';
import { Colors, Spacing } from 'styles';
import ImageViewer from '../../../imagebrowers';
import { OnMove, OnTap } from '../types';
const isIOS = Platform.OS === 'ios';

const LONG_PRESS_TIME = 800;
const DOUBLE_CLICK_INTERVAL = 250;
const MAX_OVERFLOW = 100;
const MIN_SCALE = 0.6;
const MAX_SCALE = 10;
const CLICK_DISTANCE = 10;
const DRAG_DISMISS_THRESHOLD = 120;

const swipeDirections = {
  SWIPE_UP: "SWIPE_UP",
  SWIPE_DOWN: "SWIPE_DOWN",
  SWIPE_LEFT: "SWIPE_LEFT",
  SWIPE_RIGHT: "SWIPE_RIGHT"
}

const swipeConfig = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80,
  gestureIsClickThreshold: 5
}

const Styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'transparent',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'transparent',
  },
  closeButton: {
    fontSize: 35,
    color: 'white',
    lineHeight: 40,
    width: 40,
    textAlign: 'center',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 1.5,
    shadowColor: 'black',
    shadowOpacity: 0.8,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 64,
    zIndex: 999
  },
  imageContainer: {
    overflow: 'hidden',
    backgroundColor: Colors.black,
    width: '100%',
    height: '100%',
  },
  imageContent: {
    width: '100%',
    height: '100%',
  },
  indicatorContainer: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 64,
  },
});


interface Props {
  renderToHardwareTextureAndroid?: boolean;
  isTranslucent?: boolean;
  isOpen: boolean;
  origin: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  source: Source | number;
  resizeMode?: ResizeMode;
  backgroundColor?: string;
  swipeToDismiss?: boolean;
  hideCloseButton?: boolean;
  imageStyle?: ImageStyle;
  renderHeader?: (close: () => void) => JSX.Element | Array<JSX.Element>;
  renderFooter?: (close: () => void, currentImageIndex: number) => JSX.Element | Array<JSX.Element>;
  onTap?: (eventParams: OnTap) => void;
  onChange?: (index?: number) => void;
  currentIndex?: number;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  didOpen?: () => void;
  onMove?: (position: OnMove) => void;
  responderRelease?: (vx?: number, scale?: number) => void;
  willClose?: () => void;
  onClose: () => void;
  currentImageIndex: number;
  imageSets: any[];
}

export default class ImageDetail extends React.Component<Props> {
  private _animatedScale = new Animated.Value(1);
  private _animatedPositionX = new Animated.Value(0);
  private _animatedPositionY = new Animated.Value(0);
  private _animatedFrame = new Animated.Value(0);
  private _animatedOpacity = new Animated.Value(Spacing.screen.height);
  private _imagePanResponder?: PanResponderInstance = undefined;

  private _lastPositionX: null | number = null;
  private _lastPositionY: null | number = null;
  private _zoomLastDistance: null | number = null;
  private _horizontalWholeCounter = 0;
  private _verticalWholeCounter = 0;
  private _isDoubleClick = false;
  private _isLongPress = false;
  private _centerDiffX = 0;
  private _centerDiffY = 0;
  private _singleClickTimeout: undefined | number = undefined;
  private _longPressTimeout: undefined | number = undefined;
  private _lastClickTime = 0;
  private _doubleClickX = 0;
  private _doubleClickY = 0;
  private _scale = 1;
  private _positionX = 0;
  private _positionY = 0;
  private _zoomCurrentDistance = 0;
  private _swipeDownOffset = 0;
  private _horizontalWholeOuterCounter = 0;
  private _isAnimated = false;
  private _isHorizontalWrap = false;

  constructor(props: Props) {
    super(props);
    const { onLongPress, onDoubleTap, swipeToDismiss, onTap, responderRelease } = props;
    const shouldSetResponder = this._handlePanResponderEnd.bind(this);

    this.imageVerRef = React.createRef();
    this._imagePanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onMoveShouldSetPanResponder: () => false,

      onPanResponderGrant: (evt) => {
        const windowWidth: number = Spacing.screen.width;
        const windowHeight: number = Spacing.screen.height;
        this._lastPositionX = null;
        this._lastPositionY = null;
        this._zoomLastDistance = null;
        this._horizontalWholeCounter = 0;
        this._verticalWholeCounter = 0;
        this._isDoubleClick = false;
        this._isLongPress = false;
        this._isHorizontalWrap = false;

        if (this._singleClickTimeout) {
          clearTimeout(this._singleClickTimeout);
        }

        if (evt.nativeEvent.changedTouches.length > 1) {
          const centerX =
            (evt.nativeEvent.changedTouches[0].pageX + evt.nativeEvent.changedTouches[1].pageX) / 2;
          this._centerDiffX = centerX - windowWidth / 2;

          const centerY =
            (evt.nativeEvent.changedTouches[0].pageY + evt.nativeEvent.changedTouches[1].pageY) / 2;
          this._centerDiffY = centerY - windowHeight / 2;
        }
        if (this._longPressTimeout) {
          clearTimeout(this._longPressTimeout);
        }
        this._longPressTimeout = setTimeout(() => {
          this._isLongPress = true;
          if (typeof onLongPress === 'function') {
            onLongPress();
          }
        }, LONG_PRESS_TIME);

        if (evt.nativeEvent.changedTouches.length <= 1) {
          if (new Date().getTime() - this._lastClickTime < (DOUBLE_CLICK_INTERVAL || 0)) {
            this._lastClickTime = 0;
            if (typeof onDoubleTap === 'function') {
              onDoubleTap();
            }

            clearTimeout(this._longPressTimeout);

            this._doubleClickX = evt.nativeEvent.changedTouches[0].pageX;
            this._doubleClickY = evt.nativeEvent.changedTouches[0].pageY;

            this._isDoubleClick = true;

            if (this._scale > 1 || this._scale < 1) {
              this._scale = 1;

              this._positionX = 0;
              this._positionY = 0;
            } else {
              const beforeScale = this._scale;
              this._scale = 2;

              const diffScale = this._scale - beforeScale;
              this._positionX = ((windowWidth / 2 - this._doubleClickX) * diffScale) / this._scale;

              this._positionY = ((windowHeight / 2 - this._doubleClickY) * diffScale) / this._scale;
            }

            this._imageDidMove('centerOn');

            Animated.parallel([
              Animated.timing(this._animatedScale, {
                toValue: this._scale,
                duration: 100,
                useNativeDriver: false,
              }),
              Animated.timing(this._animatedPositionX, {
                toValue: this._positionX,
                duration: 100,
                useNativeDriver: false,
              }),
              Animated.timing(this._animatedPositionY, {
                toValue: this._positionY,
                duration: 100,
                useNativeDriver: false,
              }),
            ]).start();
          } else {
            this._lastClickTime = new Date().getTime();
          }
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (this._isDoubleClick) {
          return;
        }

        if (evt.nativeEvent.changedTouches.length <= 1) {
          let diffX = gestureState.dx - (this._lastPositionX || 0);
          if (this._lastPositionX === null) {
            diffX = 0;
          }
          let diffY = gestureState.dy - (this._lastPositionY || 0);
          if (this._lastPositionY === null) {
            diffY = 0;
          }

          const windowWidth: number = Spacing.screen.width;
          this._lastPositionX = gestureState.dx;
          this._lastPositionY = gestureState.dy;

          this._horizontalWholeCounter += diffX;
          this._verticalWholeCounter += diffY;

          if (
            (Math.abs(this._horizontalWholeCounter) > 5 ||
              Math.abs(this._verticalWholeCounter) > 5) &&
            this._longPressTimeout
          ) {
            clearTimeout(this._longPressTimeout);
          }

          if (this._swipeDownOffset === 0) {
            if (Math.abs(diffX) > Math.abs(diffY)) {
              this._isHorizontalWrap = true;
            }
            if (windowWidth * this._scale > windowWidth) {
              if (this._horizontalWholeOuterCounter > 0) {
                if (diffX < 0) {
                  if (this._horizontalWholeOuterCounter > Math.abs(diffX)) {
                    this._horizontalWholeOuterCounter += diffX;
                    diffX = 0;
                  } else {
                    diffX += this._horizontalWholeOuterCounter;
                    this._horizontalWholeOuterCounter = 0;
                  }
                } else {
                  this._horizontalWholeOuterCounter += diffX;
                }
              } else if (this._horizontalWholeOuterCounter < 0) {
                if (diffX > 0) {
                  if (Math.abs(this._horizontalWholeOuterCounter) > diffX) {
                    this._horizontalWholeOuterCounter += diffX;
                    diffX = 0;
                  } else {
                    diffX += this._horizontalWholeOuterCounter;
                    this._horizontalWholeOuterCounter = 0;
                  }
                } else {
                  this._horizontalWholeOuterCounter += diffX;
                }
              }

              this._positionX += diffX / this._scale;

              const horizontalMax = (windowWidth * this._scale - windowWidth) / 2 / this._scale;
              if (this._positionX < -horizontalMax) {
                this._positionX = -horizontalMax;
                this._horizontalWholeOuterCounter += -1 / 1e10;
              } else if (this._positionX > horizontalMax) {
                this._positionX = horizontalMax;
                this._horizontalWholeOuterCounter += 1 / 1e10;
              }
              this._animatedPositionX.setValue(this._positionX);
            } else {
              this._horizontalWholeOuterCounter += diffX;
            }

            if (this._horizontalWholeOuterCounter > (MAX_OVERFLOW || 0)) {
              this._horizontalWholeOuterCounter = MAX_OVERFLOW || 0;
            } else if (this._horizontalWholeOuterCounter < -(MAX_OVERFLOW || 0)) {
              this._horizontalWholeOuterCounter = -(MAX_OVERFLOW || 0);
            }
          }

          const windowHeight: number = Spacing.screen.height;
          if (windowHeight * this._scale > windowHeight) {
            this._positionY += diffY / this._scale;
            this._animatedPositionY.setValue(this._positionY);
          } else {
            if (this.props.swipeToDismiss && !this._isHorizontalWrap) {

              this._swipeDownOffset += diffY;

              if (this._swipeDownOffset > 0) {
                this._positionY += diffY / this._scale;
                this._animatedPositionY.setValue(this._positionY);

                this._scale = this._scale - diffY / 1000;
                this._animatedScale.setValue(this._scale);
              }
            }
          }

          const swiftDirection = shouldSetResponder(gestureState)
          const { SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;

          if (swiftDirection !== SWIPE_LEFT && swiftDirection !== SWIPE_RIGHT && this.props.swipeToDismiss) {
            this._positionY += diffY / this._scale;
            this._animatedPositionY.setValue(this._positionY);
          }

          if (swipeToDismiss && this._scale === 1) {
            this._animatedOpacity.setValue(Math.abs(gestureState.dy));
          }
        } else {
          if (this._longPressTimeout) {
            clearTimeout(this._longPressTimeout);
          }

          let minX: number;
          let maxX: number;
          if (
            evt.nativeEvent.changedTouches[0].locationX >
            evt.nativeEvent.changedTouches[1].locationX
          ) {
            minX = evt.nativeEvent.changedTouches[1].pageX;
            maxX = evt.nativeEvent.changedTouches[0].pageX;
          } else {
            minX = evt.nativeEvent.changedTouches[0].pageX;
            maxX = evt.nativeEvent.changedTouches[1].pageX;
          }

          let minY: number;
          let maxY: number;
          if (
            evt.nativeEvent.changedTouches[0].locationY >
            evt.nativeEvent.changedTouches[1].locationY
          ) {
            minY = evt.nativeEvent.changedTouches[1].pageY;
            maxY = evt.nativeEvent.changedTouches[0].pageY;
          } else {
            minY = evt.nativeEvent.changedTouches[0].pageY;
            maxY = evt.nativeEvent.changedTouches[1].pageY;
          }

          const widthDistance = maxX - minX;
          const heightDistance = maxY - minY;
          const diagonalDistance = Math.sqrt(
            widthDistance * widthDistance + heightDistance * heightDistance,
          );
          this._zoomCurrentDistance = Number(diagonalDistance.toFixed(1));

          if (this._zoomLastDistance !== null) {
            const distanceDiff = (this._zoomCurrentDistance - this._zoomLastDistance) / 200;
            let zoom = this._scale + distanceDiff;

            if (zoom < MIN_SCALE) {
              zoom = MIN_SCALE;
            }
            if (zoom > MAX_SCALE) {
              zoom = MAX_SCALE;
            }

            const beforeScale = this._scale;

            this._scale = zoom;
            this._animatedScale.setValue(this._scale);

            const diffScale = this._scale - beforeScale;
            this._positionX -= (this._centerDiffX * diffScale) / this._scale;
            this._positionY -= (this._centerDiffY * diffScale) / this._scale;
            this._animatedPositionX.setValue(this._positionX);
            this._animatedPositionY.setValue(this._positionY);
          }
          this._zoomLastDistance = this._zoomCurrentDistance;
        }

        this._imageDidMove('onPanResponderMove');
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (this._longPressTimeout) {
          clearTimeout(this._longPressTimeout);
        }

        if (this._isDoubleClick || this._isLongPress) {
          return;
        }

        const moveDistance = Math.sqrt(
          gestureState.dx * gestureState.dx + gestureState.dy * gestureState.dy,
        );
        const { locationX, locationY, pageX, pageY } = evt.nativeEvent;

        if (evt.nativeEvent.changedTouches.length === 1 && moveDistance < CLICK_DISTANCE) {
          this._singleClickTimeout = setTimeout(() => {
            if (typeof onTap === 'function') {
              onTap({ locationX, locationY, pageX, pageY });
            }
          }, DOUBLE_CLICK_INTERVAL);
        } else {
          if (typeof responderRelease === 'function') {
            responderRelease(gestureState.vx, this._scale);
          }

          this._panResponderReleaseResolve(evt.nativeEvent.changedTouches.length, gestureState);
        }
      },
    });
  }

  _handlePanResponderEnd(gestureState: any) {
    return this._getSwipeDirection(gestureState);
  }

  _getSwipeDirection(gestureState: any) {
    const { SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN } = swipeDirections;
    const { dx, dy } = gestureState;
    if (this._isValidHorizontalSwipe(gestureState)) {
      return dx > 0 ? SWIPE_RIGHT : SWIPE_LEFT;
    } else if (this._isValidVerticalSwipe(gestureState)) {
      return dy > 0 ? SWIPE_DOWN : SWIPE_UP;
    }
    return null;
  }

  _isValidHorizontalSwipe(gestureState: any) {
    const { vx, dy } = gestureState;
    const { velocityThreshold, directionalOffsetThreshold } = swipeConfig;
    return this.isValidSwipe(vx, velocityThreshold, dy, directionalOffsetThreshold);
  }

  _isValidVerticalSwipe(gestureState: any) {
    const { vy, dx } = gestureState;
    const { velocityThreshold, directionalOffsetThreshold } = swipeConfig;
    return this.isValidSwipe(vy, velocityThreshold, dx, directionalOffsetThreshold);
  }

  isValidSwipe(
    velocity: any,
    velocityThreshold: any,
    directionalOffset: any,
    directionalOffsetThreshold: any,
  ) {
    return (
      Math.abs(velocity) > velocityThreshold &&
      Math.abs(directionalOffset) < directionalOffsetThreshold
    )
  }

  private _imageDidMove = (type: string): void => {
    const { onMove } = this.props;
    if (typeof onMove === 'function') {
      onMove({
        type,
        positionX: this._positionX,
        positionY: this._positionY,
        scale: this._scale,
        zoomCurrentDistance: this._zoomCurrentDistance,
      });
    }
  };

  private _panResponderReleaseResolve = (changedTouchesCount: number, gestureState: any): void => {
    const { swipeToDismiss } = this.props;
    const windowWidth: number = Spacing.screen.width;
    const windowHeight: number = Spacing.screen.height;
    let isMove = true
    if (this._scale < 1) {
      this._scale = 1;
      Animated.timing(this._animatedScale, {
        toValue: this._scale,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }

    if (windowWidth * this._scale <= windowWidth) {
      this._positionX = 0;
      Animated.timing(this._animatedPositionX, {
        toValue: this._positionX,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }

    if (windowHeight * this._scale < windowHeight) {
      this._positionY = 0;
      Animated.timing(this._animatedPositionY, {
        toValue: this._positionY,
        duration: 100,
        useNativeDriver: false,
      }).start();
    } else if (
      swipeToDismiss &&
      this._scale === 1 &&
      changedTouchesCount === 1 &&
      Math.abs(this._positionY) > DRAG_DISMISS_THRESHOLD
    ) {
      isMove = false
      this.close();
      return;
    }

    if (windowHeight * this._scale > windowHeight) {
      const verticalMax = (windowHeight * this._scale - windowHeight) / 2 / this._scale;
      if (this._positionY < -verticalMax) {
        this._positionY = -verticalMax;
      } else if (this._positionY > verticalMax) {
        this._positionY = verticalMax;
      }
      Animated.timing(this._animatedPositionY, {
        toValue: this._positionY,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }

    if (windowWidth * this._scale > windowWidth) {
      const horizontalMax = (windowWidth * this._scale - windowWidth) / 2 / this._scale;
      if (this._positionX < -horizontalMax) {
        this._positionX = -horizontalMax;
      } else if (this._positionX > horizontalMax) {
        this._positionX = horizontalMax;
      }
      Animated.timing(this._animatedPositionX, {
        toValue: this._positionX,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }

    if (this._scale === 1) {
      this._positionX = 0;
      this._positionY = 0;
      Animated.timing(this._animatedPositionX, {
        toValue: this._positionX,
        duration: 100,
        useNativeDriver: false,
      }).start();
      Animated.timing(this._animatedPositionY, {
        toValue: this._positionY,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }

    Animated.timing(this._animatedOpacity, {
      toValue: 0,
      duration: 100,
      useNativeDriver: false,
    }).start();

    this._horizontalWholeOuterCounter = 0;
    this._swipeDownOffset = 0;

    if (isMove) {
      this.imageVerRef?.current?.handleResponderRelease(gestureState.vx)
    }
    this._imageDidMove('onPanResponderRelease');
  };

  public close = (): void => {
    const { isTranslucent, willClose, onClose } = this.props;
    if (typeof willClose === 'function') {
      willClose();
    }
    const windowHeight: number = Spacing.screen.height;
    if (isTranslucent) {
      StatusBar.setHidden(false);
    }
    setTimeout(() => {
      this._isAnimated = true;

      Animated.parallel([
        Animated.timing(this._animatedScale, { toValue: 1, useNativeDriver: false }),
        Animated.timing(this._animatedPositionX, { toValue: 0, useNativeDriver: false }),
        Animated.timing(this._animatedPositionY, { toValue: 0, useNativeDriver: false }),
        Animated.timing(this._animatedOpacity, { toValue: windowHeight, useNativeDriver: false }),
        Animated.spring(this._animatedFrame, { toValue: 0, useNativeDriver: false }),
      ]).start(() => {
        onClose();
        this._isAnimated = false;
      });
    }, isIOS ? 0 : 100);
  };

  shouldComponentUpdate(nextProps: Props): boolean {
    if (
      nextProps.isOpen !== this.props.isOpen ||
      nextProps.origin.x !== this.props.origin.x ||
      nextProps.origin.y !== this.props.origin.y ||
      nextProps.currentIndex !== this.props.currentIndex
    ) {
      return true;
    }
    return false;
  }

  componentDidUpdate(): void {
    const { isOpen, didOpen } = this.props;

    if (isOpen) {
      this._lastPositionX = null;
      this._lastPositionY = null;
      this._zoomLastDistance = null;
      this._horizontalWholeCounter = 0;
      this._verticalWholeCounter = 0;
      this._isDoubleClick = false;
      this._isLongPress = false;
      this._centerDiffX = 0;
      this._centerDiffY = 0;
      this._singleClickTimeout = undefined;
      this._longPressTimeout = undefined;
      this._lastClickTime = 0;
      this._doubleClickX = 0;
      this._doubleClickY = 0;
      this._scale = 1;
      this._positionX = 0;
      this._positionY = 0;
      this._zoomCurrentDistance = 0;
      this._swipeDownOffset = 0;
      this._horizontalWholeOuterCounter = 0;
      this._isAnimated = true;

      Animated.parallel([
        Animated.timing(this._animatedOpacity, { toValue: 0, useNativeDriver: false }),
        Animated.spring(this._animatedFrame, { toValue: 1, useNativeDriver: false }),
      ]).start(() => {
        this._isAnimated = false;
        if (typeof didOpen === 'function') {
          didOpen();
        }
      });
    }
  }

  render(): JSX.Element {
    const windowWidth: number = Spacing.screen.width;
    const windowHeight: number = Spacing.screen.height;
    const {
      renderToHardwareTextureAndroid,
      isOpen,
      origin,
      source,
      resizeMode,
      backgroundColor = '#000000',
      hideCloseButton,
      imageStyle,
      renderHeader,
      renderFooter,
      currentImageIndex,
      imageSets,
      onChange,
      currentIndex,
    } = this.props;
    const animateConf = {
      transform: [
        {
          scale: this._animatedScale,
        },
        {
          translateX: this._animatedPositionX,
        },
        {
          translateY: this._animatedPositionY,
        },
      ],
      left: this._animatedFrame.interpolate({
        inputRange: [0, 1],
        outputRange: [origin.x, 0],
      }),
      top: this._animatedFrame.interpolate({
        inputRange: [0, 1],
        outputRange: [origin.y, 0],
      }),
      width: this._animatedFrame.interpolate({
        inputRange: [0, 1],
        outputRange: [origin.width, windowWidth],
      }),
      height: this._animatedFrame.interpolate({
        inputRange: [0, 1],
        outputRange: [origin.height, windowHeight],
      }),
    };

    const background = (
      <Animated.View
        renderToHardwareTextureAndroid={renderToHardwareTextureAndroid === false ? false : true}
        style={[
          Styles.background,
          { backgroundColor: backgroundColor },
          {
            opacity: this._animatedOpacity.interpolate({
              inputRange: [0, windowHeight],
              outputRange: [1, 0],
            }),
          },
        ]}></Animated.View>
    );

    const header = (
      <Animated.View
        renderToHardwareTextureAndroid={renderToHardwareTextureAndroid === false ? false : true}
        style={[
          Styles.header,
          {
            opacity: this._animatedOpacity.interpolate({
              inputRange: [0, windowHeight],
              outputRange: [1, 0],
            }),
          },
        ]}>
        {typeof renderHeader === 'function' ? (
          renderHeader(this.close)
        ) : !hideCloseButton ? (
          <SafeAreaView>
            <TouchableOpacity onPress={this.close}>
              <Text style={Styles.closeButton}>×</Text>
            </TouchableOpacity>
          </SafeAreaView>
        ) : undefined}
      </Animated.View>
    );

    const footer = renderFooter && (
      <Animated.View
        renderToHardwareTextureAndroid={renderToHardwareTextureAndroid === false ? false : true}
        style={[
          Styles.footer,
          {
            opacity: this._animatedOpacity.interpolate({
              inputRange: [0, windowHeight],
              outputRange: [1, 0],
            }),
          },
        ]}>
        {renderFooter(this.close, currentIndex)}

      </Animated.View>
    );

    const content = (
      <View
        style={{
          overflow: 'hidden',
          width: '100%',
          height: '100%',
        }}
        {...(this._imagePanResponder ? this._imagePanResponder.panHandlers : undefined)}>
        {background}
        <Animated.View
          style={animateConf}
          renderToHardwareTextureAndroid={renderToHardwareTextureAndroid === false ? false : true}>
          {/* <FastImage
            resizeMode={resizeMode}
            style={[
              imageStyle,
              {
                width: '100%',
                height: '100%',
              },
            ]}
            source={source}
          /> */}
          <ImageViewer
            ref={this.imageVerRef}
            index={currentImageIndex}
            useNativeDriver={true}
            renderImage={this.renderImageContent}
            renderIndicator={() => <View />}
            backgroundColor={backgroundColor}
            enableSwipeDown={true}
            onChange={onChange}
            pageAnimateTime={200}
            imageUrls={imageSets} />
        </Animated.View>
        {header}
        {typeof renderFooter === 'function' && footer}
      </View>
    );

    return (
      <Modal
        hardwareAccelerated={true}
        visible={isOpen}
        transparent={true}
        onRequestClose={(): void => this.close()}
        supportedOrientations={[
          'portrait',
          'portrait-upside-down',
          'landscape',
          'landscape-left',
          'landscape-right',
        ]}>
        {content}
      </Modal>
    );
  }
  renderImageContent = (props: any) => {
    const { imageHeight, cropHeight } = props
    this._imageHeight = imageHeight
    this._cropHeight = cropHeight
    return (
      <View style={Styles.imageContainer}>
        <FastImage
          {...props}
          resizeMode={this.props.resizeMode}
          style={[props.style, Styles.imageContent]}
        />
      </View>
    )
  }
}
