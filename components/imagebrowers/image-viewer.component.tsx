import * as React from 'react';
import { Animated, I18nManager, TouchableWithoutFeedback, View } from 'react-native';
import styles from './image-viewer.style';
import { IImageSize, Props, State } from './image-viewer.type';

/** @deprecated */
export default class ImageViewer extends React.Component<Props, State> {
  public static defaultProps = new Props();
  public state = new State();
  private fadeAnim = new Animated.Value(0);
  private standardPositionX = 0;
  private positionXNumber = 0;
  private positionX = new Animated.Value(0);
  private width = 0;
  private height = 0;
  private styles = styles(0, 0, 'transparent');
  private imageRefs: any[] = [];

  public componentDidMount() {
    this.init(this.props);
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.index !== prevState.prevIndexProp) {
      return { currentShowIndex: nextProps.index, prevIndexProp: nextProps.index };
    }
    return null;
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.index !== this.props.index) {

      this.jumpToCurrentImage();

      Animated.timing(this.fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: !!this.props.useNativeDriver
      }).start();
    }
  }

  public handleResponderRelease = (vx: number = 0) => {
    const vxRTL = I18nManager.isRTL ? -vx : vx;
    const isLeftMove = I18nManager.isRTL
      ? this.positionXNumber - this.standardPositionX < -(this.props.flipThreshold || 0)
      : this.positionXNumber - this.standardPositionX > (this.props.flipThreshold || 0);
    const isRightMove = I18nManager.isRTL
      ? this.positionXNumber - this.standardPositionX > (this.props.flipThreshold || 0)
      : this.positionXNumber - this.standardPositionX < -(this.props.flipThreshold || 0);

    if (vxRTL > 0.7) {
      this.goBack.call(this);
      return;
    } else if (vxRTL < -0.7) {
      this.goNext.call(this)
      return;
    }

    if (isLeftMove) {
      this.goBack.call(this);
    } else if (isRightMove) {
      this.goNext.call(this);
      return;
    } else {
      this.resetPosition.call(this);
      return;
    }
  }

  public init(nextProps: Props) {
    if (nextProps.imageUrls.length === 0) {
      this.fadeAnim.setValue(0);
      return this.setState(new State());
    }

    const imageSizes: IImageSize[] = [];
    nextProps.imageUrls.forEach(imageUrl => {
      imageSizes.push({
        width: imageUrl.width || 0,
        height: imageUrl.height || 0,
        status: 'success'
      });
    });

    this.setState(
      {
        currentShowIndex: nextProps.index,
        prevIndexProp: nextProps.index || 0,
        imageSizes
      },
      () => {
        this.jumpToCurrentImage();
        Animated.timing(this.fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: !!nextProps.useNativeDriver
        }).start();
      }
    );
  }

  public resetImageByIndex = (index: number) => {
    this.imageRefs[index] && this.imageRefs[index].reset();
  };

  public jumpToCurrentImage() {
    this.positionXNumber = this.width * (this.state.currentShowIndex || 0) * (I18nManager.isRTL ? 1 : -1);
    this.standardPositionX = this.positionXNumber;
    this.positionX.setValue(this.positionXNumber);
  }

  public goBack = () => {
    if (this.state.currentShowIndex === 0) {
      this.resetPosition.call(this);
      return;
    }

    this.positionXNumber = !I18nManager.isRTL
      ? this.standardPositionX + this.width
      : this.standardPositionX - this.width;
    this.standardPositionX = this.positionXNumber;
    Animated.timing(this.positionX, {
      toValue: this.positionXNumber,
      duration: this.props.pageAnimateTime,
      useNativeDriver: !!this.props.useNativeDriver
    }).start();

    const nextIndex = (this.state.currentShowIndex || 0) - 1;

    this.setState(
      {
        currentShowIndex: nextIndex
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(this.state.currentShowIndex);
        }
      }
    );
  };

  public goNext = () => {
    if (this.state.currentShowIndex === this.props.imageUrls.length - 1) {
      this.resetPosition.call(this);
      return;
    }

    this.positionXNumber = !I18nManager.isRTL
      ? this.standardPositionX - this.width
      : this.standardPositionX + this.width;
    this.standardPositionX = this.positionXNumber;
    Animated.timing(this.positionX, {
      toValue: this.positionXNumber,
      duration: this.props.pageAnimateTime,
      useNativeDriver: !!this.props.useNativeDriver
    }).start();

    const nextIndex = (this.state.currentShowIndex || 0) + 1;

    this.setState(
      {
        currentShowIndex: nextIndex
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(this.state.currentShowIndex);
        }
      }
    );
  };

  public resetPosition() {
    this.positionXNumber = this.standardPositionX;
    Animated.timing(this.positionX, {
      toValue: this.standardPositionX,
      duration: 150,
      useNativeDriver: !!this.props.useNativeDriver
    }).start();
  }

  public handleCancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  };

  public handleLayout = (event: any) => {
    if (event.nativeEvent.layout.width !== this.width) {

      this.width = event.nativeEvent.layout.width;
      this.height = event.nativeEvent.layout.height;
      this.styles = styles(this.width, this.height, this.props.backgroundColor || 'transparent');

      this.forceUpdate();
      this.jumpToCurrentImage();
    }
  };


  public getContent() {
    const screenWidth = this.width;
    const screenHeight = this.height;

    const ImageElements = this.props.imageUrls.map((image, index) => {
      if ((this.state.currentShowIndex || 0) > index + 1 || (this.state.currentShowIndex || 0) < index - 1) {
        return <View key={index} style={{ width: screenWidth, height: screenHeight }} />;
      }

      let width = this!.state!.imageSizes![index] && this!.state!.imageSizes![index].width;
      let height = this.state.imageSizes![index] && this.state.imageSizes![index].height;

      if (!image.props) {
        image.props = {};
      }

      if (!image.props.style) {
        image.props.style = {};
      }

      image.props.style = {
        ...this.styles.imageStyle,
        ...image.props.style,
        width,
        height
      };

      if (typeof image.props.source === 'number') {
        // source = require(..), doing nothing
      } else {
        if (!image.props.source) {
          image.props.source = {};
        }
        image.props.source = {
          uri: image.url,
          ...image.props.source
        };
      }
      return (
        <View style={{ width, height }}
          key={index}
          ref={el => (this.imageRefs[index] = el)} >
          {this!.props!.renderImage!({ ...image.props })}
        </View>
      )
    })

    return (
      <View style={{ zIndex: 9 }}>
        <Animated.View style={{ ...this.styles.container, opacity: this.fadeAnim }}>
          {this!.props!.renderHeader!(this.state.currentShowIndex)}

          <View style={this.styles.arrowLeftContainer}>
            <TouchableWithoutFeedback onPress={this.goBack}>
              <View>{this!.props!.renderArrowLeft!()}</View>
            </TouchableWithoutFeedback>
          </View>

          <View style={this.styles.arrowRightContainer}>
            <TouchableWithoutFeedback onPress={this.goNext}>
              <View>{this!.props!.renderArrowRight!()}</View>
            </TouchableWithoutFeedback>
          </View>

          <Animated.View
            style={{
              ...this.styles.moveBox,
              transform: [{ translateX: this.positionX }],
              width: this.width * this.props.imageUrls.length
            }}
          >
            {ImageElements}
          </Animated.View>
        </Animated.View>
      </View>
    );
  }

  public render() {
    let childs: React.ReactElement<any> = null as any;
    childs = (
      <View>
        {this.getContent()}
      </View>
    );

    return (
      <View
        onLayout={this.handleLayout}
        style={{
          flex: 1,
          overflow: 'hidden',
          justifyContent: 'center',
          ...this.props.style
        }}>
        {childs}
        {this!.props!.renderIndicator!((this.state.currentShowIndex || 0) + 1, this.props.imageUrls.length)}
      </View>
    )
  }
}
