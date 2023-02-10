import { isNil } from 'lodash';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';



const LoadingIndicator = ({
  isLoading = true,
  children,
}: {
  isLoading?: boolean;
  children?: JSX.Element;
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(isLoading);
  }, [isLoading]);

  return (
    <TouchableOpacity activeOpacity={1} style={[styles.container]}>
      <FastImage
        source={require('_assets/images/loading_indicator.gif')}
        style={styles.imageLoading}
      />
      {!isNil(children) && children}
    </TouchableOpacity>
  );
};

export default LoadingIndicator;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  imageLoading: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
  },
});
