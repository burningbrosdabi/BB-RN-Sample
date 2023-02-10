import theme from '_styles/legacy/theme.style';

export function calculateProductDrawerHeight(
  selectedProductList,
  openColorPicker,
  openSizePicker,
  openExtraPicker,
  sizeList,
  colorList,
  extraOptionList,
) {
  const baseHeight = 44;
  const optionHeight =
    (colorList.length > 0 ? theme.BUTTON_HEIGHT_52 + theme.MARGIN_10 : null) +
    (sizeList.length > 0 ? theme.BUTTON_HEIGHT_52 + theme.MARGIN_10 : null) +
    (extraOptionList.length > 0 ? theme.BUTTON_HEIGHT_52 + theme.MARGIN_10 : null);
  const buttonHeight = theme.BUTTON_HEIGHT_52 + theme.MARGIN_20 + theme.MARGIN_10;
  const selectedProductListHeight =
    (selectedProductList.length > 0 ? theme.MARGIN_10 * 5 + theme.FONT_SIZE_14 : 0) +
    selectedProductList.length * theme.MARGIN_20 * 2;
  const colorPickerHeight = openColorPicker
    ? colorList.length > 1
      ? theme.BUTTON_HEIGHT_52 * 2
      : theme.BUTTON_HEIGHT_52
    : 0;
  const sizePickerHeight = openSizePicker
    ? sizeList.length > 1
      ? theme.BUTTON_HEIGHT_52 * 2
      : theme.BUTTON_HEIGHT_52
    : 0;
  const extraPickerHeight = openExtraPicker
    ? extraOptionList.length > 1
      ? theme.BUTTON_HEIGHT_52 * 2
      : theme.BUTTON_HEIGHT_52
    : 0;
  const drawerOpenHeight = colorPickerHeight + sizePickerHeight + extraPickerHeight;

  const drawerHeight =
    baseHeight + buttonHeight + optionHeight + selectedProductListHeight + drawerOpenHeight;

  return drawerHeight;
}

export function getOptionListFromProduct(product) {
  const { product_options } = product;
  let sizeList = [];
  let colorList = [];
  let extraOptionList = [];

  product_options.map(({ size, color, extra_option, is_active }) => {
    if (color && color != 'U' && !colorList.includes(color)) {
      colorList = [...colorList, color];
    }
    if (size && size != 'U' && !sizeList.includes(size)) {
      sizeList = [...sizeList, size];
    }
    if (color == 'U' && size == 'U' && !extraOptionList.includes(extra_option) && is_active)
      extraOptionList = [...extraOptionList, extra_option];
  });
  sizeList = sizeList.map((item) => {
    return { label: item, value: item };
  });
  colorList = colorList.map((item) => {
    return { label: item, value: item };
  });
  extraOptionList = extraOptionList.map((item) => {
    return { label: item, value: item };
  });
  return { sizeList, colorList, extraOptionList };
}
