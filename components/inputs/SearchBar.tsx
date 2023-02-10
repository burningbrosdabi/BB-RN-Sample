import DabiFont from 'assets/icons/dabi.fonts';
import React from 'react';
import { Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors, Outlines, Typography } from 'styles';


/** @deprecated   **/
const SearchBar = (props) => {
  const { searchBoxContainer, searchBoxInputField } = styles;
  const {
    handleSearch,
    handleInput,
    clearSearch,
    searchKeyword,
    containerStyle,
    autoFocus,
    placeholder,
  } = props;
  return (
    <View style={[searchBoxContainer, containerStyle]}>
      <TextInput
        maxLength={40}
        onChangeText={handleInput}
        onEndEditing={handleSearch}
        placeholder={placeholder || 'Bạn muốn tìm gì?'}
        style={searchBoxInputField}
        autoCorrect={false}
        autoCapitalize={'none'}
        value={searchKeyword}
        autoFocus={autoFocus}
        {...props}
      />
      {searchKeyword ? (
        <TouchableOpacity onPress={clearSearch}>
          <DabiFont name={'delete'} size={24} color={Colors.icon} />
        </TouchableOpacity>
      ) : (
        <>
          <DabiFont name={'search'} size={24} color={Colors.icon} />
        </>
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchBoxContainer: {
    flexDirection: 'row',
    paddingLeft: 12,
    paddingRight: 8,
    borderRadius: Outlines.borderRadius.base,
    alignItems: 'center',
    height: 32,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
  },
  searchBoxInputField: {
    ...Typography.body,
    color: Colors.black,
    paddingTop: 0,
    paddingBottom: Platform.OS == 'ios' ? 4 : 0,
    textAlignVertical: 'center',
    flex: 1,
  },
});
