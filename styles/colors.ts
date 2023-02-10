// colors.js       // Colors pallete

export const applyOpacity = (hexColor: string, opacity: number): string => {
  const red = parseInt(hexColor.slice(1, 3), 16);
  const green = parseInt(hexColor.slice(3, 5), 16);
  const blue = parseInt(hexColor.slice(5, 7), 16);

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
};

export const color = {
  // ```Color 2022```
  black: '#222222',
  primary: '#222222', icon: '#222222',
  white: '#FFFFFF',
  background: '#F5F5F5',
  component: '#A1A6A9',
  text: '#74777c',
  warn: '#E63032',
  blue: '#6468E5',
  red: '#E63032',
  shopee: '#EE4E2C',



  pink: '#FF9FB3',
  green: '#75dcb8',
  yellow: '#fcd986',
  purple: '#c297ef',


  // Button / Box  Line
  button: '#dbddde',
  boxLine: '#dbddde',

  line: '#f2f2f2', // Line

  surface: {
    white: '#ffffff',
    fadeGray: '#f2f2f2',
    lightGray: '#dbddde',
    midGray: '#a6a7a8',
    darkGray: '#74777c',
  },

  gradient: {
    pink: ['#FF9FB3', '#FD7694'],
    yellow: ['#FDE9A6', '#FCD986'],
    green: ['#99EBCE', '#75DCB8'],
    blue: ['#9CCDFA', '#83B6EF'],
    purple: ['#D6B4EA', '#C297EF'],
    line: ['#f2f2f2', '#f2f2f2'],
  },

  opacity: {
    primary30: applyOpacity('#fd7694', 0.3),
    layoutCheck: applyOpacity('#83b6ef', 0.2)
  }
};

type Primary = 'brand';
export const primary: Record<Primary, string> = {
  brand: '#fd7694',
};

type Secondary = 'green' | 'yellow' | 'purple' | 'blue';
export const secondary: Record<Secondary, string> = {
  green: '#75dcb8',
  yellow: '#fcd986',
  purple: '#c297ef',
  blue: '#83b6ef',
};

export const applyFakeOpacity = (hexColor: string, opacity: number): string => {
  const red = parseInt(hexColor.slice(1, 3), 16);
  const green = parseInt(hexColor.slice(3, 5), 16);
  const blue = parseInt(hexColor.slice(5, 7), 16);

  const transform = (value: number) => {
    return opacity * value + (1 - opacity) * 255;
  };

  return `rgb(${transform(red)}, ${transform(green)}, ${transform(blue)})`;
};

// type Transparent = 'clear' | 'lightGray' | 'darkGray' | 'primary' | 'blue';
// export const transparent: Record<Transparent, string> = {
//   clear: 'rgba(255, 255, 255, 0)',
//   lightGray: applyOpacity(color.surface.lightGray, 0.4),
//   darkGray: applyOpacity(color.surface.darkGray, 0.8),
//   primary: applyOpacity(primary.brand, 0.3),
//   blue: applyOpacity(color.blue, 0.3),
// };

export default color;
