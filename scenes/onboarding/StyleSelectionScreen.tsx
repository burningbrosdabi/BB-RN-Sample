import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, ButtonState, ButtonType, floatingButtonContainer, LayoutConstraint } from 'components/button/Button';
import { ConnectionDetection } from 'components/empty/OfflineView';
import { Header } from 'components/header/Header';
import FilterList from 'components/list/product/filter/FilterList';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RoutePath } from 'routes';
import { updateUserApi } from 'services/api';
import { Colors, Typography } from 'styles';
import { StyleKey, styleList } from 'utils/data';
import { HEADER_HEIGHT } from 'utils/helper';
import { useActions } from 'utils/hooks/useActions';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';


const StyleSelectionScreen = () => {
  const { userInfo } = useTypedSelector((state) => state.user);
  const { primary_style = '', secondary_style = '' } = userInfo
  const [userFirstStyle, setUserFirstStyle] = useState<StyleKey>([]);
  const [userSecondStyle, setuserSecondStyle] = useState<StyleKey>([]);
  const [buttonEnabled, setButtonEnabled] = useState(false)

  const route = useRoute()
  const { setLoading } = useActions();
  const navigation = useNavigation()


  useEffect(() => {
    if (userFirstStyle.length > 0 && userSecondStyle.length > 0) {
      setButtonEnabled(true)
      return
    }
    setButtonEnabled(false)
  }, [userFirstStyle, userSecondStyle]);


  const handleOnPress = async (skip = false) => {
    setLoading(true)
    if (!skip) {
      try {
        await updateUserApi({ primary_style: userFirstStyle, secondary_style: userSecondStyle })
      } catch { }
    }
    switch (route.name) {
      case RoutePath.styleSetting:
        navigation.goBack()
        break
      case RoutePath.styleSelection:
        navigation.navigate(RoutePath.pickSelection);
      default:
        break
    }
    setLoading(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ConnectionDetection.View>

        {route.name == RoutePath.styleSetting ? <Header /> : <View style={{
          height: HEADER_HEIGHT, alignItems: 'flex-end', justifyContent: 'center', paddingRight: 16
        }}>
          <TouchableOpacity onPress={() => handleOnPress(true)}>
            <Text style={{ ...Typography.name_button, color: Colors.primary }}>Bỏ qua</Text>
          </TouchableOpacity>
        </View>
        }
        <View
          style={{ paddingHorizontal: 16 }}
        >
          <View style={{ height: 12 }} />
          <Text style={Typography.title}>Phong cách nào mô tả bạn một cách chính xác nhất?</Text>
          {/* Ngoài ra, bạn có thích thêm phong cách nào không? */}
          <View style={{ height: 12 }} />
          <View style={{ flex: 1, paddingBottom: 100 }}>
            <FilterList
              filterList={styleList}
              filter={userFirstStyle}
              setFilter={setUserFirstStyle}
              buttonType="hashtag"
              isRadio
            />
          </View>
        </View>
        {userFirstStyle && userFirstStyle.length > 0 ? <View
          style={{ paddingHorizontal: 16 }}
        >
          <View style={{ height: 12 }} />
          <Text style={Typography.body}>Nói DABI nghe bạn thích phong cách nào nữa nhé!</Text>
          {/* Ngoài ra, bạn có thích thêm phong cách nào không? */}
          <View style={{ height: 12 }} />
          <View style={{ flex: 1, paddingBottom: 100 }}>
            <FilterList
              filterList={styleList.filter(item => item.key != userFirstStyle)}
              filter={userSecondStyle}
              setFilter={setuserSecondStyle}
              buttonType="hashtag"
              isRadio
            />
          </View>
        </View> : <></>}
        <View style={floatingButtonContainer().style}>
          <Button
            type={ButtonType.primary}
            state={!buttonEnabled ? ButtonState.disabled : ButtonState.idle}
            disabled={!buttonEnabled}
            onPress={handleOnPress}
            text={'Lưu'}
            constraint={LayoutConstraint.matchParent}
          />
        </View>
      </ConnectionDetection.View>
    </SafeAreaView>
  );
};

export default React.memo(StyleSelectionScreen);

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
