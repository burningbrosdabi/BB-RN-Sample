import { Dimensions, Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

// TODO Need to fix
const StatusBarHeight = getStatusBarHeight();
const bottomOffset = 0;

export const LANDSCAPE = 'landscape';
export const PORTRAIT = 'portrait';

const HEADER_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
/** @deprecated */
export const colorTheme: { [id: string]: string } = {
  PRODUCT_WHITE: '#ffffff',
  PRODUCT_GREY: '#999999',
  PRODUCT_BLACK: '#000000',
  PRODUCT_CREAM: '#F9ECE0',
  PRODUCT_BEIGE: '#EDC7A2',
  PRODUCT_BROWN: '#b16f42',
  PRODUCT_RED: '#fc4532',
  PRODUCT_ORANGE: '#ff7e29',
  PRODUCT_YELLOW: '#FFCE00',
  PRODUCT_PINK: '#f8b9c7',
  PRODUCT_PURPLE: '#ba7cd1',
  PRODUCT_BLUE: '#1a81d3',
  PRODUCT_MINT: '#40E0b5',
  PRODUCT_GREEN: '#31c969',
};

/** @deprecated */
export default {
  // Device Info
  DEVICE_WIDTH: Dimensions.get('window').width,
  DEVICE_HEIGHT: Dimensions.get('window').height,
  DEVICE_HEADER_HEIGHT: HEADER_HEIGHT,
  DEVICE_HEIGHT_WITHOUT_HEADER:
    Platform.OS == 'ios'
      ? Dimensions.get('window').height - HEADER_HEIGHT - 25
      : Dimensions.get('window').height,
  DEVICE_BOTTOM_TAB_BAR_HEIGHT: HEADER_HEIGHT + bottomOffset + (Platform.OS == 'android' ? 45 : 0),
  DEVICE_BOTTOM_OFFSET: bottomOffset,
  DEVICE_STATUS_BAR_HEIGHT: StatusBarHeight,
  DEVICE_NAVIGATOR_BAR_HEIGHT:
    Dimensions.get('screen').height - Dimensions.get('window').height - StatusBarHeight,
  // Color
  WHITE: '#ffffff',
  BLACK: '#222222',
  TRANSPARENT_BLACK: 'rgba(0, 0, 0, 0.6)',
  TRANSPARENT_BLACK_3: 'rgba(0, 0, 0, 0.3)',
  TRANSPARENT_BLACK_6: 'rgba(0, 0, 0, 0.6)',

  PRIMARY_COLOR: '#fe94aa',
  PRIMARY_GRAY: '#989898',
  LIGHT_GRAY: '#eeeeee',
  LINK_BLUE: '#1c8fdb',
  FACEBOOK_BLUE: '#3675f0',

  // Opacity
  OPACITY_0_7: 0.7,
  OPACITY_6: 0.6,
  OPACITY_0_3: 0.3,

  // Font Size
  FONT_SIZE_11: 11,
  FONT_SIZE_12: 12,
  FONT_SIZE_14: 14,
  FONT_SIZE_16: 16,
  FONT_SIZE_21: 21,

  // Default Margin
  MARGIN_5: 5,
  MARGIN_10: 10,
  MARGIN_20: 20,

  // Default Padding
  PADDING_4: 4,
  PADDING_8: 8,
  PADDING_16: 16,

  // Logo Size
  LOGO_WIDTH: 44,
  LOGO_HEIGHT: 30,
  LOGO_LEFT_MARGIN: Platform.OS == 'ios' ? -54 : 16,

  // Icon Size
  ICON_SIZE_20: 20,
  ICON_SIZE_12: 12,

  // Image
  IMAGE_RADIUS_PROFILE_52: 52,
  IMAGE_SIZE_52: 52,
  IMAGE_SIZE_GRID_3: (Dimensions.get('window').width - 16 * 5) / 3,
  // Button
  BUTTON_HEIGHT_40: 40,
  BUTTON_HEIGHT_52: 52,

  SEARCH_BOX_HEIGHT_40: 40,
  MODAL_HEIGHT: 200,
  MODAL_WIDTH: Dimensions.get('window').width - 32,

  NAVIGATION_BAR_HEIGHT: 64,

  BORDER_WIDTH_SMALL: 1,
  BORDER_WIDTH_MEDIUM: 2,
  BORDER_WIDTH_LARGE: 4,

  BUTTON_VERTICAL_PADDING: 16,
  BUTTON_HEIGHT: 64,
  BUTTON_ICON_TEXT_MARGIN: 20,

  ICON_SIZE_SMALL: 16,
  ICON_SIZE_MEDIUM: 24,
  ICON_SIZE_LARGE: 32,

  POST_ICON_CONTAINER_PADDING: 8,

  STORE_ICON_COMPONENT_RADIUS_SMALL: 40,
  STORE_ICON_COMPONENT_RADIUS_LARGE: 60,

  BAR_COMPONENT_HEIGHT: 52,

  VERTICAL_PADDING_SMALL: 20,
  VERTICAL_PADDING_MEDIUM: 20,
  VERTICAL_PADDING_LARGE: 30,

  VERTICAL_MARGIN_60: 60,
  VERTICAL_MARGIN_120: 120,
  VERTICAL_PADDING_160: 160,

  VERTICAL_PADDING_FOR_BUTTON: 80,

  DEFAULT_HORIZONTAL_CONTAINER_PADDING: 16,

  MODAL_BACKGROUND_COLOR: 'rgba(0, 0, 0, 0.5)',
  POP_UP_IMAGE_SIZE: 100,
  POP_UP_BOX_WIDTH: 247,

  RANKING_CONTAINER_WIDTH: 30,

  SHADOW_OFFSET: 2,
  SHADOW_OPACITY: 0.3,
  SHADOW_RADIUS: 3,
  SCROLLVIEW_INDICATOR_RADIUS: 8,

  ...colorTheme,
};
