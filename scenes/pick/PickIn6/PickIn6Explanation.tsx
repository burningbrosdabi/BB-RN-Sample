import Button, { LayoutConstraint } from 'components/button/Button';
import { ConnectionDetection } from 'components/empty/OfflineView';
import BackButton from 'components/header/BackButton';
import { ImageElementFlex, ImageElementNative } from 'components/images/ImageElement';
import React, { useEffect } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { PickAnalysisRouteSetting, PickIn6RouteSetting } from 'routes/pick/pick.route';
import { getPickResult, PickType } from 'services/api';
import { useNavigator } from 'services/navigation/navigation.service';
import { Colors, Typography } from 'styles';
import { useAsync } from 'utils/hooks/useAsync';
import { getHeaderLayout } from "_helper";





const PickIn6ExplanationScreen = () => {
  const type = PickType.IN6
  const navigator = useNavigator();
  const { data, excecute } = useAsync(() => getPickResult(type));

  useEffect(() => {
    excecute();
  }, [])

  const navigatePick = () => {
    if (data) {
      navigator.navigate(new PickAnalysisRouteSetting({ data, type }), true);
    } else {
      navigator.navigate(new PickIn6RouteSetting(), true);
    }
  }

  return (
    <ConnectionDetection.View>
      <View style={{ backgroundColor: '#FFBECB', flex: 1, justifyContent: 'flex-end' }}
      >
        <Image
          style={{ width: '100%' }}
          source={require('assets/images/pick/pickIn6/introduction/illust_introduction.png')}
        />
        <View
          style={{ paddingHorizontal: 16, position: 'absolute', top: getHeaderLayout().extra + 12, width: '100%' }}
        >
          <BackButton mode={'cancel'} containerStyle={{ left: -16 }} color={Colors.black} />
          <View style={{ height: 24 }} />
          <Text style={Typography.h1}>Phong cách thật sự{'\n'}của tôi là gì? </Text>
          <View style={{ height: 12 }} />
          <Text style={Typography.body}>Bạn đang thắc mắc phong cách thật sự của bản thân?{'\n'}
            Yên tâm, hãy làm 1 bài kiểm tra nhỏ, sau đó Dabi sẽ đưa ra kết quả và đề xuất những món đồ phù hợp cho bạn !</Text>
          <View style={{ height: 24 }} />

          <Ripple style={{ alignItems: 'flex-start' }} onPress={navigatePick} >
            <View style={{ backgroundColor: '#EC4D51', padding: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ ...Typography.option, color: Colors.white }}>TÌM HIỂU NGAY</Text>
              <View style={{ width: 24 }} />
              <Image
                style={{ width: 60 }}
                source={require('assets/images/icon/long_arrow.png')}
              />
            </View>
          </Ripple>
        </View>
      </View>
    </ConnectionDetection.View >
  );
};


export default PickIn6ExplanationScreen;
