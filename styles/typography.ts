// Font types and sizes
import { TextStyle, ViewStyle } from 'react-native';
import Colors from './colors';

export const fontExtraBold = 'NunitoSans-ExtraBold';
export const fontRegular = 'NunitoSans-Regular';
export const fontSemiBold = 'NunitoSans-SemiBold';
export const fontBold = 'NunitoSans-Bold';
export const fontBlack = 'NunitoSans-Black'
type FontName =
  | 'name'
  | 'h1'
  | 'title'
  | 'boxTitle'
  | 'name_button'
  | 'option'
  | 'mark'
  | 'body'
  | 'description'
  | 'smallCaption'
  | 'subtitle';

const font: Record<FontName, TextStyle> = {
  // ```2022```
  title: {
    color: Colors.black,
    fontSize: 18,
    lineHeight: 25,
    // textTransform: 'capitalize',
    fontFamily: fontBlack,
  },
  subtitle: {
    color: Colors.black,
    fontSize: 14,
    lineHeight: 20,
    // textTransform: 'capitalize',
    fontFamily: fontBlack,
  },
  name_button: {
    color: Colors.black,
    fontSize: 14,
    lineHeight: 20,
    // textTransform: 'capitalize',
    fontFamily: fontBold,
  },
  body: {
    color: Colors.black,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontRegular,
  },
  mark: {
    color: Colors.black,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fontExtraBold,
  },
  description: {
    color: Colors.black,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fontRegular,
  },


  // ```legacy```
  name: {
    color: Colors.white,
    fontSize: 36,
    lineHeight: 49,
    fontFamily: fontExtraBold,
  },
  h1: {
    color: Colors.black,
    fontSize: 21,
    lineHeight: 28,
    // textTransform: 'capitalize',
    fontFamily: fontExtraBold,
  },
  boxTitle: {
    color: Colors.black,
    fontSize: 14,
    lineHeight: 20,
    // textTransform: 'capitalize',
    fontFamily: fontSemiBold,
  },
  option: {
    color: Colors.black,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontBold,
  },

  smallCaption: {
    color: Colors.black,
    fontSize: 10,
    lineHeight: 14,
    // textTransform: 'capitalize',
    fontFamily: fontRegular,
  },
};

export const fontPlaceHolder: Record<FontName, ViewStyle> = {
  name: {
    height: 36,
    marginTop: 7,
    marginBottom: 6,
  },
  h1: {
    height: 21,
    marginTop: 4,
    marginBottom: 3,
  },
  title: {
    height: 18,
    marginTop: 4,
    marginBottom: 3,
  },
  name_button: {
    height: 14,
    marginTop: 3,
    marginBottom: 3,
  },
  boxTitle: {
    height: 14,
    marginTop: 3,
    marginBottom: 3,
  },
  option: {
    height: 14,
    marginTop: 3,
    marginBottom: 3,
  },
  body: {
    height: 14,
    marginTop: 4,
    marginBottom: 3,
  },
  description: {
    height: 12,
    marginTop: 2,
    marginBottom: 2,
  },
  smallCaption: {
    height: 10,
    marginTop: 2,
    marginBottom: 2,
  },
};
export default font;
