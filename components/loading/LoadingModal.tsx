import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';

const LoadingModal = () => {
  const { isLoading } = useTypedSelector((state) => state.loading);

  return isLoading && <View style={styles.container}>
    <ActivityIndicator />
    {/* <FastImage
      source={require('_assets/images/loading_indicator.gif')}
      style={styles.imageLoading}
    /> */}
  </View>


};

export default LoadingModal;
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  imageLoading: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
  },
});
