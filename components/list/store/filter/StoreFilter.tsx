import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import {
  NavigationState,
  SceneRendererProps,
  TabView,
  TabBar,
  TabBarItem,
  TabBarIndicator,
  Route
} from 'react-native-tab-view';
import { useActions } from 'utils/hooks/useActions';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { Button, ButtonType, LayoutConstraint } from 'components/button/Button';
import { Colors, Outlines, Spacing, Typography } from '_styles';
import { ageList, cityList, styleList } from 'utils/data';
import IconButton from 'components/button/IconButton';
import FilterList from 'components/list/product/filter/FilterList';
import { toast } from 'components/alert/toast';


type AnimatedModalTabBarRoute = Route & {
  modalHeight: number;
  key: string;
  title: string;
};

interface Props {
  visible: boolean;
  routeIndex: number;
  onClose?: () => void;
};

const StoreFilter = ({ visible, routeIndex, onClose }: Props) => {
  const { cityFilter, styleFilter, ageFilter } = useTypedSelector(
    (state) => state.store,
  );
  const { showDialog } = useActions();

  const [city, setCity] = useState(cityFilter);
  const [style, setStyle] = useState(styleFilter);
  const [age, setAge] = useState(ageFilter);

  const modalizeRef = useRef<Modalize>(null);
  const [index, setIndex] = useState(0);
  const [routes] = useState<AnimatedModalTabBarRoute[]>([
    { key: 'city', title: 'Tỉnh/thành', modalHeight: 350 },
    { key: 'style', title: 'Phong cách ', modalHeight: 350 },
    { key: 'age', title: 'Độ tuổi', modalHeight: 350 },
  ]);

  const { setStoreFilter } = useActions();

  useEffect(() => {
    (routeIndex || routeIndex === 0) && setIndex(routeIndex);
  }, [routeIndex]);

  useEffect(() => {
    setCity(cityFilter)
    setStyle(styleFilter)
    setAge(ageFilter)
  }, [cityFilter, styleFilter, ageFilter]);

  useEffect(() => {
    if (visible) {
      setIndex((index) => routeIndex);
      modalizeRef.current?.open();
    } else {
      modalizeRef.current?.close();
    }
  }, [visible]);

  const renderScene = ({ route }: { route: any }) => {
    switch (route.key) {
      case 'city':
        return <FilterList filterList={cityList} filter={city} setFilter={setCity} buttonType="text" fullWidth />;
      case 'style':
        return <FilterList filterList={styleList} filter={style} setFilter={setStyle} buttonType="text" />;
      case 'age':
        return <FilterList filterList={ageList} filter={age} setFilter={setAge} buttonType="text" fullWidth />;
      default:
        return <View />;
    }
  };

  const _onClose = () => {
    setCity(cityFilter);
    setStyle(styleFilter);
    setAge(ageFilter);
    setIndex((index) => routeIndex);
  }

  const _removeAll = () => {
    showDialog({
      title: 'Bạn muốn xóa bộ lọc??',
      actions: [
        {
          type: ButtonType.primary,
          text: 'Xóa',
          onPress: () => {
            setCity([]);
            setStyle([]);
            setAge([]);
          },
        },
        {
          text: 'Không',
          type: ButtonType.flat,
          onPress: () => { },
          textStyle: { color: Colors.primary },
        },
      ],
    });
  }

  const renderTabBarItem = (props) => {
    const { route, navigationState } = props
    const { routes, index } = navigationState
    const isSelected = route.key == routes[index].key
    const labelStyle = isSelected ? Typography.name_button : Typography.body
    const borderStyle = isSelected ? { borderBottomWidth: 2, borderColor: Colors.primary } : undefined
    return (
      <View style={{ ...borderStyle, marginRight: 24 }}>
        <TabBarItem
          {...props}
          key={route.key}
          labelStyle={{ ...labelStyle, textTransform: 'capitalize' }}
        />
      </View>
    )
  }

  const renderTabBar = useCallback(
    <T extends Route>(
      props: SceneRendererProps & {
        navigationState: NavigationState<T>;
      },
    ) => {
      const onTabItemPress = (value: number) => setIndex(value);
      const { navigationState } = props;
      return <TabBar {...props} index={index}
        activeColor={Colors.primary}
        inactiveColor={Colors.text}
        contentContainerStyle={{ marginLeft: 16 }}
        indicatorContainerStyle={{ marginLeft: 16 }}
        tabStyle={{ width: 'auto', paddingHorizontal: 0, paddingTop: 24, paddingBottom: 12 }}
        indicatorStyle={{ backgroundColor: Colors.primary, height: 0, marginRight: 24, }}
        style={{
          backgroundColor: 'white',
          borderBottomWidth: Outlines.borderWidth.base,
          elevation: 0, shadowOpacity: 0,
          borderBottomColor: Colors.line
        }}
        onTabItemPress={onTabItemPress}
        renderTabBarItem={renderTabBarItem}
      />
    },
    [index],
  );

  const _applyFilter = () => {
    setStoreFilter({ city, style, age });
    modalizeRef.current?.close();
    if (
      !isEmpty(city) ||
      !isEmpty(style) ||
      !isEmpty(age)
    ) {
      toast('Áp dụng bộ lọc');
    }
  };

  return (
    <Portal>
      <Modalize
        ref={modalizeRef}
        rootStyle={{ zIndex: 10, elevation: 10 }}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
        onClosed={() => {
          _onClose()
          onClose()
        }}
        HeaderComponent={() => {
          return <View style={{
            flexDirection: 'row', alignItems: 'center',
            justifyContent: 'center',
            marginTop: 24,
            height: 24
          }} >
            <View style={{ position: 'absolute', left: 16 }}>
              <Button text="Cài đặt lại"
                type={ButtonType.flat}
                onPress={_removeAll}
                constraint={LayoutConstraint.wrapChild}
                textStyle={{ ...Typography.description, color: Colors.primary }}
                innerHorizontalPadding={0} /></View>
            <Text style={Typography.title}>Bộ lọc</Text>
            <View style={{ position: 'absolute', right: 16 }}>
              <IconButton
                icon={'exit'}
                onPress={() => {
                  _onClose()
                  modalizeRef.current?.close();
                }}
              /></View>
          </View>;
        }}
        FooterComponent={
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 16,
              paddingBottom: 24,
            }}>
            <Button text="ÁP DỤNG" type={ButtonType.primary} onPress={_applyFilter} />
          </View>
        }
        adjustToContentHeight
        withHandle={false}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: Spacing.screen.width }}
          sceneContainerStyle={{
            paddingTop: 24,
            paddingHorizontal: 16,
            height: routes[index].modalHeight - 120,
          }}
          renderTabBar={renderTabBar}
          lazy
        />
      </Modalize>
    </Portal >
  );
};
export default StoreFilter;
