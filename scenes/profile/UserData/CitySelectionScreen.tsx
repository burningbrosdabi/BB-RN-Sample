import GeolocationAndroid from '@react-native-community/geolocation';
import { toast } from 'components/alert/toast';
import { Button, ButtonState, ButtonType } from 'components/button/Button';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GeolocationiOS, { GeoPosition } from 'react-native-geolocation-service';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { deprecated_updateUserInfo } from 'services/api';
import { Colors, Spacing, Typography } from 'styles';
import { cityList } from 'utils/data/filter';
import { distance } from 'utils/geodata';
import { useActions } from 'utils/hooks/useActions';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { Header } from "components/header/Header";


interface Props {
  navigation: any;
  route: any;
}


const isIOS = Platform.OS === 'ios';
const ASPECT_RATIO_W = 265 / 360;
export const MAP_WIDTH = Spacing.screen.width * ASPECT_RATIO_W;
export const MAP_HEIGHT =
  Spacing.screen.height - ((isIOS ? getStatusBarHeight() : 0) + 44 + 28.5 + 42.5 + 97 + 24);

interface Props {
  selectedLocationIndex: number;
  extraHeight?: number;
  onSelectedLocation: Function;
  shouldGetCurrentLocation?: boolean;
}

const StepTwo = ({
  selectedLocationIndex,
  extraHeight = 0,
  onSelectedLocation,
  shouldGetCurrentLocation = true,
}: Props) => {
  const { setLoading } = useActions();
  const [mapImageHeight, setMapImageHeight] = useState(MAP_HEIGHT);

  let minDistance = 99999;
  let autoSelectedIndex = -1;

  useEffect(() => {
    shouldGetCurrentLocation && getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    const options = {
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 1000,
    };
    if (isIOS) {
      await GeolocationiOS.requestAuthorization('whenInUse');
      GeolocationiOS.getCurrentPosition(
        geoData => {
          onGetLocationSuccess(geoData);
        },
        error => onGetLocationError(error),
        options,
      );
    } else {
      GeolocationAndroid.getCurrentPosition(
        geoData => {
          onGetLocationSuccess(geoData);
        },
        error => onGetLocationError(error),
        options,
      );
    }
  };

  const onGetLocationSuccess = (geoData: GeoPosition) => {
    setLoading(true);
    const { latitude, longitude } = geoData.coords;
    cityList.forEach((marker, idx) => {
      const _distance = distance(
        latitude,
        longitude,
        marker.latlng.latitude,
        marker.latlng.longitude,
      );
      if (Number(_distance) < minDistance) {
        autoSelectedIndex = idx;
        minDistance = Number(_distance);
      }
    });

    if (autoSelectedIndex != -1) {
      onSelectedLocation(autoSelectedIndex, cityList[autoSelectedIndex], geoData);
    }
    setLoading(false);
  };
  const onGetLocationError = (error: object) => {
    setLoading(false);
    console.log(error);
  };

  const renderMarker = useCallback(
    (marker, index) => {
      return (
        <TouchableOpacity
          key={index + ''}
          style={{
            position: 'absolute',
            top: marker.yLocation * mapImageHeight,
            right: marker.xLocation,
          }}
          onPress={() => onSelectedLocation(index, marker)}>
          <View style={styles.markerContainer}>
            <Text
              style={[
                styles.markerTitle,
                selectedLocationIndex === index ? { color: '#FD7694' } : null,
              ]}>
              {marker.description}
            </Text>
            <Image
              source={marker.image}
              style={{ tintColor: selectedLocationIndex === index ? '#FD7694' : '#A6A7A8' }}
            />
          </View>
        </TouchableOpacity>
      );
    },
    [selectedLocationIndex, mapImageHeight],
  );

  const onGetLayout = (event: any) => {
    setMapImageHeight(event.nativeEvent.layout.height);
  };

  return (
    <View style={{
      flex: 1,
      width: Spacing.screen.width,
      alignItems: 'center',
    }}>
      <View style={[styles.mapContainer, { height: MAP_HEIGHT - extraHeight }]}>
        <View style={[styles.mapContainer, { height: mapImageHeight }]}>
          <Image
            onLayout={onGetLayout}
            source={require('assets/images/tutorial/mapvn.png')}
            style={styles.mapImage}
          />
          {cityList.map((marker, index) => renderMarker(marker, index))}
        </View>
      </View>
    </View>
  );
};


const CitySelectionScreen = ({ navigation, route }: Props) => {
  const { token } = useTypedSelector((state) => state.auth);
  const { regionIndex } = route?.params;

  const [selectedLocationIndex, setSelectedLocationIndex] = useState(regionIndex !== undefined ? regionIndex : -1);
  const [userLocationData, setUserLocationData] = useState<any>({});

  const onSelectedLocation = (index: number, marker: any, geoData: any) => {
    const userLocationData = {
      nearestLocation: {
        id: index,
        data: marker
      },
      currentLocation: geoData,
    };
    setUserLocationData(userLocationData);
    setSelectedLocationIndex(index);
  };

  const handleNextButton = async () => {
    const newLocation = userLocationData?.nearestLocation?.data.id
    await deprecated_updateUserInfo({ token, region: newLocation });
    toast("Cập nhật thông tin cá nhân thành công!")
    navigation.goBack();
  };

  const isValid = () => {
    return selectedLocationIndex !== -1;
  };

  const renderContent = () => {
    const contents = () => {
      return (
        <StepTwo
          shouldGetCurrentLocation={false}
          extraHeight={12}
          selectedLocationIndex={selectedLocationIndex}
          onSelectedLocation={onSelectedLocation}
        />
      );
    };

    const { container, titleText, contentText } = styles;
    return (
      <View style={[container, { backgroundColor: Colors.white, justifyContent: 'flex-start' }]}>
        <Text style={titleText}>{'Bạn đang sống ở khu vực nào?'}</Text>
        <Text style={contentText}>{'Dabi sẽ gợi những cửa hàng \n gần bạn nhất'}</Text>
        {contents()}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      {renderContent()}
      <View style={styles.nextButton}>
        <Button
          type={ButtonType.primary}
          state={!isValid() ? ButtonState.disabled : ButtonState.idle}
          onPress={handleNextButton}
          disabled={!isValid()}
          text={'Áp dụng'}
        />
      </View>
    </SafeAreaView>
  );
};

export default React.memo(CitySelectionScreen);

const styles = StyleSheet.create({

  mapContainer: {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerTitle: {
    ...Typography.description,
    color: '#707070',
    marginBottom: 2,
  },
  markerContainer: {
    alignItems: 'center',
  },
  mapImage: {
    width: '100%',
    maxHeight: '100%',
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    width: Spacing.screen.width,
    alignItems: 'center',
    justifyContent: 'center',
    ...ifIphoneX({
      marginBottom: 34
    }, {
      marginBottom: 20
    })
  },
  titleText: {
    ...Typography.h1,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  contentText: {
    ...Typography.body,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 12,
  },
  nextButton: {
    position: 'absolute',
    zIndex: 2,
    left: 0, right: 0, bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: 'white',
  },
});
