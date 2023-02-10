import { DabiFont } from 'assets/icons';
import Button, { ButtonType, LayoutConstraint } from 'components/button/Button';
import { FeatureMeasurement } from 'components/tutorial';
import { isEmpty } from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { Colors, Typography } from 'styles';
import { styleList, weightList, heightList } from 'utils/data/filter';
import FilterModalContext, {
  FeedFilterRepoContext, FeedOrderingContext, FeedOrderingRepoContext
} from './context';
import { FilterModalRouteMap } from './modal';
import { FilterModalRoute } from './types.d';

const styleFriendlyName: { [key: string]: string } = {};
const weightFriendlyName: { [key: string]: string } = {};
const heightFriendlyName: { [key: string]: string } = {};


styleList.map(({ key, description }) => {
  styleFriendlyName[key] = description;
});
weightList.map(({ key, description }) => {
  weightFriendlyName[key] = description;
});

heightList.map(({ key, description }) => {
  heightFriendlyName[key] = description;
});

const FeedFilterBtnGroup = () => {
  const { repo } = useContext(FeedFilterRepoContext);
  const { styleFilter, weightFilter, heightFilter } = repo;

  const genButtonMetadata = useCallback(() => {
    const buttons: { [id: number]: ButtonMetadata } = {};
    for (const route of Object.values(FilterModalRoute)) {
      buttons[route as FilterModalRoute] = getButtonMetadata(route as FilterModalRoute);
    }

    return buttons;
  }, []);

  const { open } = useContext(FilterModalContext);

  const [buttonMetadata, setButtonMetadata] = useState<{ [id: number]: ButtonMetadata }>(
    genButtonMetadata(),
  );

  useEffect(() => {
    const applied = !isEmpty(styleFilter);
    const buttonMeta = buttonMetadata[FilterModalRoute.style];
    buttonMeta.applied = applied;
    if (applied) {
      const name = styleFriendlyName[styleFilter];
      buttonMeta.appliedName = name
    }
    setMeta(buttonMeta);
  }, [styleFilter]);


  useEffect(() => {
    const applied = !isEmpty(weightFilter);
    const buttonMeta = buttonMetadata[FilterModalRoute.weight];
    buttonMeta.applied = applied;
    if (applied) {
      const name = weightFriendlyName[weightFilter];
      buttonMeta.appliedName = name
    }
    setMeta(buttonMeta);
  }, [weightFilter]);


  useEffect(() => {
    const applied = !isEmpty(heightFilter);
    const buttonMeta = buttonMetadata[FilterModalRoute.height];
    buttonMeta.applied = applied;
    if (applied) {
      const name = heightFriendlyName[heightFilter];
      buttonMeta.appliedName = name
    }
    setMeta(buttonMeta);
  }, [heightFilter]);


  const setMeta = (meta: ButtonMetadata) => {
    setButtonMetadata({
      ...buttonMetadata,
    });
  };

  return (
    <View style={{ height: 28 }}>
      <ScrollView
        contentContainerStyle={{ paddingLeft: 16 }}
        horizontal
        showsHorizontalScrollIndicator={false}>
        {/* <_FeatureDiscoveryAnchor /> */}
        <Ripple onPress={() => open()}>
          <DabiFont name={'filter'} /></Ripple>
        <View style={{ width: 12 }} />
        {Object.keys(FilterModalRouteMap).map(route => {
          const index = Number.parseInt(route, 10);
          const meta = buttonMetadata[index];
          const { applied } = meta;
          const onPress = () => open();
          return (
            <View key={`${route}`} style={{ marginRight: 12 }}>
              <Ripple onPress={onPress}>
                <View style={{ backgroundColor: applied ? Colors.black : Colors.background, borderRadius: 14, paddingVertical: 4, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ ...Typography.body, color: applied ? Colors.white : Colors.black }}>{applied && '#'}{meta.name}</Text>
                  <View style={{ width: 4 }} />
                  {!applied && <DabiFont name='small_arrow_right' size={12} />}</View>
              </Ripple>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};


class ButtonMetadata {
  defaultName: string;
  appliedName: string;
  applied?: boolean;

  constructor({ name, appliedName }: { appliedName?: string; name: string }) {
    this.defaultName = name;
    this.appliedName = appliedName ?? '';
  }

  get name(): string {
    return this.applied ? this.appliedName : this.defaultName;
  }
}

const getButtonMetadata = (route: FilterModalRoute): ButtonMetadata => {
  const name = FilterModalRouteMap[route];

  return new ButtonMetadata({ name });
};


export const OrderingBtn = () => {
  const { toogle } = useContext(FeedOrderingContext);
  const { repo } = useContext(FeedOrderingRepoContext);
  console.log(repo)

  return (
    <Button
      text={repo.description}
      color={Colors.button}
      type={ButtonType.flat}
      constraint={LayoutConstraint.wrapChild}
      textStyle={{ textTransform: 'none', ...Typography.name_button, }}
      onPress={toogle}
      iconColor={Colors.black}
      postfixIcon='small_arrow_down'
    />
  );
};

export default FeedFilterBtnGroup;


const _FeatureDiscoveryAnchor = () => {
  return (
    <View
      style={{
        position: 'absolute',
        width: 68,
        height: 28,
        left: 16,
      }}>
      <FeatureMeasurement
        id={'feed_filter'}
        title={'Tìm kiếm các KOLs mà bạn mong muốn'}
        description={
          'Bạn có thể lọc theo cân nặng, chiều cao và phong cách. Hãy tìm ngay cho mình một KOL mà bạn thích!!!'
        }
        overlay={
          <DabiFont name={'filter'} />
        }>
        <View style={{ width: 68, height: 28 }} />
      </FeatureMeasurement>
    </View>
  );
};