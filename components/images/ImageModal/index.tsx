import React, { LegacyRef } from 'react';
import { Animated, Dimensions, Platform, StatusBar, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import type { FastImageProps, ImageStyle } from 'react-native-fast-image';
import ImageDetail from './ImageDetail';
import { OnMove, OnTap } from './types';
import { Spacing } from 'styles';
const isIOS = Platform.OS === 'ios';


interface State {
  isOpen: boolean;
  origin: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  currentImageIndex: number;
  currentIndex: number;
}
interface Props extends FastImageProps {
  isRTL?: boolean;
  renderToHardwareTextureAndroid?: boolean;
  isTranslucent?: boolean;
  swipeToDismiss?: boolean;
  imageBackgroundColor?: string;
  overlayBackgroundColor?: string;
  hideCloseButton?: boolean;
  modalRef?: LegacyRef<ImageDetail>;
  disabled?: boolean;
  modalImageStyle?: ImageStyle;
  onLongPressOriginImage?: () => void;
  renderHeader?: (close: () => void) => JSX.Element | Array<JSX.Element>;
  renderFooter?: (close: () => void, currentImageIndex: number) => JSX.Element | Array<JSX.Element>;
  onTap?: (eventParams: OnTap) => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  onOpen?: (currentImageIndex?: number) => void;
  didOpen?: () => void;
  onMove?: (position: OnMove) => void;
  responderRelease?: (vx?: number, scale?: number) => void;
  willClose?: () => void;
  onClose?: () => void;
  currentImageIndex: number;
  imageSets: any[];
  onChange?: (index?: number) => void;
  currentIndex: number;
}

/** @deprecated */
export default class ImageModal extends React.Component<Props, State> {
  private _root: View | null = null;
  private _originImageOpacity = new Animated.Value(1);

  constructor(props: Props) {
    super(props);
    const { isTranslucent } = props;
    if (Platform.OS === 'android' && isTranslucent) {
      StatusBar.setTranslucent(isTranslucent);
    }

    this.state = {
      isOpen: false,
      origin: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
      currentImageIndex: 0,
      currentIndex: props.currentIndex
    };

    Dimensions.addEventListener('change', () => {
      setTimeout(() => {
        this._setOrigin();
      }, 100);
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (nextProps.currentIndex !== this.props.currentIndex) {
      this.setState({ currentIndex: nextProps.currentIndex })
    }
  }

  private _setOrigin = (currentImageIndex?: number): void => {
    if (this._root) {
      this._root.measureInWindow((x: number, y: number, width: number, height: number) => {
        const { isTranslucent, onOpen, isRTL } = this.props;
        let newY: number = y;
        if (typeof onOpen === 'function') {
          onOpen(currentImageIndex);
        }
        if (isTranslucent) {
          newY += StatusBar.currentHeight ? StatusBar.currentHeight : 0;
          StatusBar.setHidden(true);
        }
        let newX: number = x;
        if (isRTL) {
          newX = Spacing.screen.width - width - x;
        }
        this.setState({
          origin: {
            width,
            height,
            x: newX,
            y: newY,
          },
        });
      });
    }
  };

  private _open = (currentImageIndex: number): void => {
    if (this.props.disabled) return;

    this._setOrigin(currentImageIndex);
    setTimeout(() => {
      this.setState({
        isOpen: true,
        currentImageIndex,
      });
    });

    this._root && this._originImageOpacity.setValue(0);
  };

  private _onClose = (): void => {
    const { onClose } = this.props;
    this._originImageOpacity.setValue(1);

    setTimeout(() => {
      this.setState({
        isOpen: false,
      });

      if (typeof onClose === 'function') {
        onClose();
      }
    });
  };

  private _willClose = (): void => {
    const { onChange, willClose } = this.props;
    willClose && willClose();
    if (!isIOS) {
      onChange && onChange(this.state.currentIndex)
    }
  };

  private _onChange = (index?: number): void => {
    const { onChange } = this.props;
    if (isIOS) {
      onChange && onChange(index)
    } else {
      this.setState({ currentIndex: index || 0 })
    }
  }

  render(): JSX.Element {
    const {
      source,
      resizeMode,
      renderToHardwareTextureAndroid,
      isTranslucent,
      swipeToDismiss = true,
      imageBackgroundColor,
      overlayBackgroundColor,
      hideCloseButton,
      modalRef,
      modalImageStyle,
      onLongPressOriginImage,
      renderHeader,
      renderFooter,
      onTap,
      onDoubleTap,
      onLongPress,
      didOpen,
      onMove,
      responderRelease,
      willClose,
      currentImageIndex,
      imageSets,
      onChange,
      currentIndex
    } = this.props;
    const { currentIndex: currentIndexAndroid, isOpen, origin } = this.state;
    return (
      <View
        ref={(component): void => {
          this._root = component;
        }}
        onLayout={() => { }}
        style={[{ alignSelf: 'baseline', backgroundColor: imageBackgroundColor }]}>
        <Animated.View
          renderToHardwareTextureAndroid={renderToHardwareTextureAndroid === false ? false : true}
          style={{ opacity: this._originImageOpacity }}>
          <TouchableOpacity
            activeOpacity={1}
            style={{ alignSelf: 'baseline' }}
            onPress={() => this._open(currentImageIndex)}
            onLongPress={onLongPressOriginImage}>
            <FastImage {...this.props} />
          </TouchableOpacity>
        </Animated.View>
        <ImageDetail
          ref={modalRef}
          renderToHardwareTextureAndroid={renderToHardwareTextureAndroid}
          isTranslucent={isTranslucent}
          isOpen={isOpen}
          origin={origin}
          source={source}
          resizeMode={resizeMode}
          backgroundColor={overlayBackgroundColor}
          swipeToDismiss={swipeToDismiss}
          hideCloseButton={hideCloseButton}
          imageStyle={modalImageStyle}
          renderHeader={renderHeader}
          renderFooter={renderFooter}
          onTap={onTap}
          onDoubleTap={onDoubleTap}
          onLongPress={onLongPress}
          didOpen={didOpen}
          onMove={onMove}
          responderRelease={responderRelease}
          willClose={this._willClose}
          onClose={this._onClose}
          currentImageIndex={currentImageIndex}
          imageSets={imageSets}
          onChange={this._onChange}
          currentIndex={isIOS ? currentIndex : currentIndexAndroid}
        />
      </View>
    );
  }
}

export { ImageDetail };

