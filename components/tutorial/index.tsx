import AsyncStorage from '@react-native-community/async-storage';
import { isEmpty, isNil } from 'lodash';
import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View } from 'react-native';
import { storeKey } from 'utils/constant';
import { unAwaited } from 'utils/helper';
import { FeatureDiscoveryContext, IFeatureDiscoveryContext } from './context';
import { DescribedFeature } from './DescribedFeature';
import { FeatureIds, featureScreenMap, OverlayedComponent, OverlayedMap, RenderBox } from './type';
import { sleep } from 'utils/helper';
import { useNavigator } from 'services/navigation/navigation.service';
import { Completer } from 'services/remote.config';
import { Colors } from 'styles';

export const FeatureDiscovery = ({ children }: { children: JSX.Element[] | JSX.Element }) => {
  const [overlayeds, setOverlay] = useState<OverlayedMap>({} as OverlayedMap);
  const [activeId, setActiveId] = useState<FeatureIds | undefined>();
  const [steps, setSteps] = useState<FeatureIds[]>([]);
  const completer = useRef(new Completer());

  const addOverlay = useCallback(
    (id: FeatureIds, value: OverlayedComponent) => {
      setOverlay({ ...overlayeds, [id]: value });
    },
    [overlayeds, steps],
  );

  const dismiss = () => {
    setActiveId(undefined);
    setSteps([]);
  };

  const completeAt = useCallback(
    (stepId: FeatureIds) => {
      const stepIndex = steps.indexOf(stepId);
      if (stepIndex < 0 || stepIndex >= steps.length - 1) {
        dismiss();
        completer.current.complete(undefined);
        return;
      }
      setActiveId(steps[stepIndex + 1]);
    },
    [steps],
  );

  const stepsMap: { [key: string]: FeatureIds[] } = {
    // [storeKey.homeFeatureDiscovery]: ['feed_filter', 'following_feed'],
    // [storeKey.magazineFeatureDiscovery]: ['mix-match'],
    // [storeKey.productListFeatureDiscovery]: ['productlist_filter', 'category_filter'],
    // [storeKey.feedDetailFeatureDiscovery]: ['feed-tag', 'feed-save',],
    // [storeKey.userFollowFeatureDiscovery]: ['user-follow']
  };

  const discover = async (id: string) => {
    completer.current = new Completer<unknown>();
    const shown = await AsyncStorage.getItem(id);
    // if (shown) return;
    const _steps = stepsMap[id];
    if (!_steps) return;
    console.log(_steps)
    unAwaited(AsyncStorage.setItem(id, 'true'));
    setSteps(_steps);
    return completer.current.promise;
  };

  useEffect(() => {
    console.log(steps)
    if (isEmpty(steps)) return;
    const availableIds = Object.keys(overlayeds);
    console.log(availableIds)
    const stepRegistered = steps.every(stepId => availableIds.includes(stepId));
    if (stepRegistered && !activeId) {
      setActiveId(steps[0]);
    }
  }, [steps, overlayeds]);

  const context = useMemo<IFeatureDiscoveryContext>(() => {
    return {
      activeId,
      overlayeds,
      addOverlay,
      setActiveId,
      dismiss,
      completeAt,
      discover,
      steps,
    };
  }, [overlayeds, activeId, steps]);

  return (
    <FeatureDiscoveryContext.Provider value={context}>
      {children}
      {Object.entries(overlayeds).map(([key, overlay]) => (
        <Fragment key={key}>{overlay}</Fragment>
      ))}
    </FeatureDiscoveryContext.Provider>
  );
};

export const FeatureMeasurement = ({
  children,
  id,
  overlay,
  title,
  description,
  backgroundColor,
  transparent = false
}: {
  id: FeatureIds;
  overlay?: JSX.Element;
  children: JSX.Element;
  title: string;
  description: string;
  backgroundColor?: string;
  transparent?: boolean
}) => {
  const ref = useRef(null);
  const [renderBox, setRenderBox] = useState<RenderBox>();
  const { addOverlay, activeId } = useContext(FeatureDiscoveryContext);

  useEffect(() => {
    console.log(renderBox)
    if (!renderBox) return;
    addOverlay(
      id,
      <DescribedFeature
        backgroundColor={Colors.blue}
        id={id}
        title={title}
        description={description}
        transparent={transparent}
        renderBox={renderBox}>
        {overlay ?? <></>}
      </DescribedFeature>,
    );
  }, [renderBox, activeId]);

  const navigator = useNavigator();

  const validForAdding = (): boolean => {
    const currentRoute = navigator.currentTab;
    const listIds = featureScreenMap[currentRoute];
    if (!listIds) return false;

    return listIds.includes(id);
  };
  const onLayout = useCallback(async () => {
    // const { x, y, width, height } = nativeEvent.layout;
    if (isNil(ref?.current)) return;

    await sleep(200);

    if (!validForAdding()) {
      return;
    }

    // @ts-expect-error
    ref.current.measureInWindow((x, y, width, height) => {
      setRenderBox({ x, y, width, height });
    });
  }, [ref]);

  return (
    <View onLayout={onLayout} ref={ref}>
      {children}
    </View>
  );
};
