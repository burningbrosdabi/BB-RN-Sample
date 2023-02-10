import { useNavigation } from '@react-navigation/native';
import { Button, ButtonType, floatingButtonContainer, LayoutConstraint } from 'components/button/Button';
import { ConnectionDetection } from 'components/empty/OfflineView';
import { RecommendUserList } from 'components/list/user/UserList';
import { FeatureMeasurement } from 'components/tutorial';
import { FeatureDiscoveryContext } from 'components/tutorial/context';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ripple from 'react-native-material-ripple';
import { RoutePath } from 'routes';
import { PickAnalyzing } from 'scenes/pick/component/PickAnalyzing';
import { Logger } from 'services/log/log.service';
import { Colors, Typography } from 'styles';
import { storeKey } from 'utils/constant';
import { HEADER_HEIGHT } from 'utils/helper';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';

const FollowSugestionScreen = () => {
  const { userInfo } = useTypedSelector((state) => state.user);
  const navigation = useNavigation()
  const [analyzing, setAnalyzing] = useState(false)


  const { discover } = useContext(FeatureDiscoveryContext);

  // useEffect(() => {
  //   discover(storeKey.userFollowFeatureDiscovery)
  // }, []);

  const handleOnPress = async (skip = false) => {
    if (skip) {
      navigation.reset({
        index: 0,
        routes: [{ name: RoutePath.main }],
      });
      Logger.instance.logTutorialComplete();
      return
    }
    setAnalyzing(true);
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: RoutePath.main }],
      });
      Logger.instance.logTutorialComplete();
    }, 2000)

  }

  return analyzing ? <PickAnalyzing /> : (
    <SafeAreaView style={styles.container}>

      <ConnectionDetection.View>

        <View style={{
          height: HEADER_HEIGHT, alignItems: 'flex-end', justifyContent: 'center', paddingRight: 16
        }}>
          <TouchableOpacity onPress={() => handleOnPress(true)}>
            <Text style={{ ...Typography.name_button, color: Colors.primary }}>Bỏ qua</Text>
          </TouchableOpacity>
        </View>
        <View style={{ paddingLeft: 16, paddingBottom: 12 }}>
          <Text style={Typography.title}>Gợi ý theo dõi cho bạn</Text>
        </View>
        <RecommendUserList />
        <View style={floatingButtonContainer().style}>
          <Button
            type={ButtonType.primary}
            onPress={() => handleOnPress(false)}
            text={'Hoàn tất'}
            constraint={LayoutConstraint.matchParent}
          />
        </View>
      </ConnectionDetection.View>
    </SafeAreaView>
  );
};

export default React.memo(FollowSugestionScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topImage: {
    marginTop: 12 * 4,
    marginBottom: 12,
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemImage: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  titleText: {
    ...Typography.h1,
    textAlign: 'center',
    marginBottom: 12,
  },
  descriptionText: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: 12,
    marginHorizontal: 28,
  },
  contentText: {
    ...Typography.body,
    color: Colors.surface.darkGray,
    marginLeft: 12,
    flex: 1,
    flexWrap: 'wrap',
  },
  line: {
    height: 1,
    backgroundColor: Colors.background,
    width: '100%',
    marginBottom: 12,
  },
});
