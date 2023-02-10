import { DabiFont, UpIcon } from 'assets/icons';
import { get, isEmpty, isNil } from 'lodash';
import PropTypes from 'prop-types';
import React, { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Ripple from 'react-native-material-ripple';
import { DataProvider, Dimension, RecyclerListView } from 'recyclerlistview';
import { ScrollEvent } from 'recyclerlistview/dist/reactnative/core/scrollcomponent/BaseScrollView';
import { PaginationFetch } from 'services/http/type';
import { Colors, Spacing } from 'styles';
import { unAwaited } from 'utils/helper/function.helper';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { BaseBuilder } from './ListBuilder';
import { ListController } from './ListController';
import { InfScrollListProps } from 'components/list/type';
import { useScrollToTop } from '@react-navigation/native';

export type RowRender<T> = (
  type: string | number,
  data: T,
  index: number,
  extendedState?: object,
) => JSX.Element | JSX.Element[] | null;

const defaultInfFetch = () => Promise.resolve([]);
const IOS_BOTTOM_SAFE_AREA = 34;

// @ts-expect-error
RecyclerListView.propTypes.externalScrollView = PropTypes.object;

const ScrollViewWithHeader = React.forwardRef(({ children, ...props }, ref) => {
  return (
    // @ts-expect-error
    <ScrollView ref={ref} {...props}>
      {/* @ts-expect-error */}
      {props.headerComponent && props.headerComponent}
      {children}
    </ScrollView>
  );
});

const useInfinite = <T extends object>({
  infFetch,
  stopFetchConditon,
  state,
  intialized,
  dataProvider,
  setDataProvider,
  infRender,
}: Pick<InfScrollListProps<T>, 'infFetch' | 'stopFetchConditon' | 'infRender'> & {
  state: ConnectionState;
  intialized: MutableRefObject<boolean>;
  dataProvider: DataProvider;
  setDataProvider: (value: DataProvider) => void;
}) => {
  const {
    state: _infState,
    data: infData,
    excecute: infExecute,
    reset,
  } = useAsync(infFetch ?? defaultInfFetch);

  const [infState, setInfState] = useState(_infState);

  const endReached = useRef(false);

  const onEndReached = () => {
    if (
      state !== ConnectionState.hasData ||
      infState === ConnectionState.waiting ||
      endReached.current ||
      (infState === ConnectionState.none && !intialized.current) ||
      (infState === ConnectionState.hasEmptyData && intialized.current) ||
      // isEmpty(infData) ||
      stopFetchConditon(dataProvider.getAllData())
    ) {
      return;
    }

    unAwaited(infExecute());
  };

  useEffect(() => {
    if (!infFetch) return;
    if (_infState === ConnectionState.hasData && infState !== _infState) {
      if (!isEmpty(infData)) {
        setDataProvider(
          dataProvider.cloneWithRows(dataProvider.getAllData().concat(infData as T[])),
        );
        setInfState(ConnectionState.hasData);
      }
    } else {
      setInfState(_infState);
    }
  }, [_infState]);

  const renderFooter = useCallback(() => {
    return infRender(infState);
  }, [infState]);

  return { infState, reset, onEndReached, renderFooter };
};

const useDataManipulate = <T extends object>({
  controller,
  dataProvider,
  setDataProvider,
  state,
  setState,
  data,
  setData,
}: {
  dataProvider: DataProvider;
  setDataProvider: (value: DataProvider) => void;
  state: ConnectionState;
  setState: (state: ConnectionState) => void;
  data: T[] | null;
  setData: (value: T[]) => void;
  controller?: ListController<T>;
}) => {
  const removeWhere = useCallback(
    (condition: (value: T, index: number) => boolean) => {
      const currentData = dataProvider.getAllData();
      const newData = currentData.filter((value, index) => !condition(value, index));
      if (newData.length <= 0) {
        setState(ConnectionState.hasEmptyData);
      } else {
        setDataProvider(dataProvider.cloneWithRows(newData as T[]));
      }
    },
    [dataProvider],
  );

  // const put = useCallback((data: T[]) => {
  //     setDataProvider(dataProvider.cloneWithRows(data as T[]));
  // }, [dataProvider]);

  const push = useCallback(
    (data: T, unshift?: boolean) => {
      const currentData = dataProvider.getAllData();
      if (unshift) {
        currentData.unshift(data);
      } else {
        currentData.push(data);
      }
      if (isEmpty(get(currentData, '[0]', {}))) {
        setData([data]);
        setState(ConnectionState.hasData);
      } else {
        setData([...currentData]);
      }
    },
    [dataProvider, data],
  );

  useEffect(() => {
    if (isNil(controller)) return;
    // controller.push = push;
  }, [dataProvider, state, data]);

  useEffect(() => {
    if (!isNil(controller)) {
      controller.unshift = data => push(data, true);
      controller.remove = removeWhere;
      controller.push = data => push(data);
    }
  }, [dataProvider]);
};

export const InfiniteScrollList = <T extends object>(props: InfScrollListProps<T>) => {
  const {
    initialData = [],
    controller,
    fetch,
    refresh,
    infFetch,
    isHorizontal,
    stopFetchConditon,
    infRender,
    Header,
    renderAheadMultiply = 1,
    item,
    showScrollToTopBtn: showScrollTop = true,
    floatingButtonBottomMargin = 20,
  } = props;

  const {
    state: _state,
    data: _data = initialData,
    excecute,
    refresh: refreshList,
  } = useAsync<T[]>(fetch, {
    initialState: isEmpty(initialData) ? ConnectionState.none : ConnectionState.hasData,
    refreshFn: refresh ?? fetch,
  });

  const [state, setState] = useState(_state);
  const [data, setData] = useState(_data);

  useEffect(() => {
    setState(_state);
  }, [_state]);

  useEffect(() => {
    setData(_data);
  }, [_data]);

  const intialized = useRef(false);
  const [showScrollToTopBtn, setScrollToTopBtn] = useState(false);
  // tslint:disable-next-line:no-any
  const recyclerRef = React.createRef<RecyclerListView<any, any>>();
  const [refreshing, setRefreshing] = useState(false);
  const scrollTopAnim = useRef(new Animated.Value(0)).current;

  useScrollToTop(recyclerRef);

  const [dimension, setDimmension] = useState<Dimension>({
    width: Spacing.screen.width,
    height: Spacing.screen.height,
  });

  const [headerDim, setHeaderDim] = useState<Dimension>({
    width: 0,
    height: 0,
  });

  const [viewPort, setViewPort] = useState<Dimension>({
    width: Spacing.screen.width,
    height: dimension.height,
  });

  useEffect(() => {
    setViewPort({
      width: Spacing.screen.width,
      height: dimension.height - headerDim.height,
    });
  }, [headerDim, dimension]);

  const _dataProvider = useMemo(
    () =>
      new DataProvider((r1, r2) => {
        return r1 !== r2;
      }),
    [],
  );

  const [dataProvider, setDataProvider] = useState(_dataProvider.cloneWithRows([{}]));

  const { infState, reset, onEndReached, renderFooter } = useInfinite({
    intialized,
    infFetch,
    infRender,
    stopFetchConditon,
    state,
    dataProvider,
    setDataProvider,
  });

  useDataManipulate({
    controller,
    dataProvider,
    setDataProvider,
    state,
    setState,
    data,
    setData,
  });

  useEffect(() => {
    if (controller) controller!.data = dataProvider.getAllData();
  }, [dataProvider]);

  useEffect(() => {
    if (state === ConnectionState.hasData) {
      // initialize with initialData
      if (!intialized.current && !isEmpty(initialData)) {
        setDataProvider(_dataProvider.cloneWithRows(initialData));
        intialized.current = true;
      } else if (!isNil(data)) setDataProvider(_dataProvider.cloneWithRows(data as T[]));
    } else {
      setDataProvider(_dataProvider.cloneWithRows([{}]));
      if (infState !== ConnectionState.none) {
        reset();
      }
    }
    setBuilder(new BaseBuilder({ item, state, viewPort, data }));
  }, [state, data, viewPort]);

  const [builder, setBuilder] = useState(new BaseBuilder({ item, state, viewPort, data }));

  useEffect(() => {
    onScrollTop();
    setBuilder(new BaseBuilder({ item, state, viewPort, data }));
  }, [props.item.uid]);

  useEffect(() => {
    if (controller) {
      controller.refresh = () => {
        setRefreshing(true);
        recyclerRef.current?.scrollToTop(true);

        return refreshList().finally(() => setRefreshing(false));
      };
    }
  }, [excecute]);

  useEffect(() => {
    if (isEmpty(initialData)) excecute().finally(() => (intialized.current = true));
  }, []);

  const onLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    const layout = nativeEvent.layout;
    setDimmension({
      width: layout.width,
      height: layout.height,
    });
  };

  const onScroll = (rawEvent: ScrollEvent, offsetX: number, offsetY: number) => {
    if (!isNil(controller?.onScroll)) {
      controller?.onScroll(rawEvent, offsetX, offsetY);
    }
    if (
      rawEvent.nativeEvent.contentSize &&
      offsetY / rawEvent.nativeEvent.contentSize.height >= 0.7
    ) {
      onEndReached();
    }
    if (!showScrollTop) return;

    if (rawEvent.nativeEvent.contentOffset.y > Spacing.screen.height && !showScrollToTopBtn) {
      setScrollToTopBtn(true);

      Animated.timing(scrollTopAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (
      rawEvent.nativeEvent.contentOffset.y <= Spacing.screen.height &&
      showScrollToTopBtn
    ) {
      setScrollToTopBtn(false);
      Animated.timing(scrollTopAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const onScrollTop = () => {
    // if (controller?.scrollToTop) controller?.scrollToTop();
    recyclerRef?.current?.scrollToTop(true);
  };

  const _onHeaderLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    const layout = nativeEvent.layout;
    setHeaderDim({
      width: layout.width,
      height: layout.height,
    });
  };

  const _Header = useMemo(() => {
    return <View onLayout={_onHeaderLayout}>{Header}</View>;
  }, [Header]);

  return (
    <View style={{ flex: 1 }} onLayout={onLayout}>
      <RecyclerListView
        testID={'recycler-list-view'}
        externalScrollView={ScrollViewWithHeader}
        ref={recyclerRef}
        isHorizontal={isHorizontal}
        forceNonDeterministicRendering={
          state === ConnectionState.hasData && props.item.approximateDimension
        }
        onScroll={onScroll}
        layoutProvider={builder.layoutProvider}
        dataProvider={dataProvider}
        rowRenderer={builder.rowRenderer}
        renderFooter={renderFooter}
        showsVerticalScrollIndicator={false}
        renderAheadOffset={Spacing.screen.height * renderAheadMultiply + headerDim.height}
        scrollViewProps={{
          ...(Header ? { headerComponent: _Header } : {}),
          refreshControl: (
            <RefreshControl
              refreshing={state === ConnectionState.waiting && !refreshing}
              onRefresh={refreshList}
            />
          ),
        }}
      />
      {showScrollTop && (
        <Animated.View
          style={{
            bottom: -42 - IOS_BOTTOM_SAFE_AREA,
            position: 'absolute',
            right: 16,
            zIndex: 1,
            transform: [
              {
                translateY: scrollTopAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -IOS_BOTTOM_SAFE_AREA - 42 - floatingButtonBottomMargin],
                }),
              },
            ],
          }}>
          <Ripple
            onPress={onScrollTop}
            rippleContainerBorderRadius={24}
            style={styles.scrollToTopBtn}>
            <DabiFont name={'arrow_up'} />
          </Ripple>
        </Animated.View>
      )}
    </View>
  );
};

export const PaggingScrollList = <T extends object, F = undefined>(
  props: Omit<InfScrollListProps<T>, 'fetch' | 'infFetch' | 'stopFetchConditon' | 'refresh'> & {
    fetch: PaginationFetch<T, F>;
    next?: string;
  },
) => {
  const { next, fetch } = props;
  const [nextUrl, setNextUrl] = useState<string | undefined>(next);

  const _fetch = async (refresh?: boolean): Promise<T[]> => {
    try {
      const url = nextUrl?.replace('http:', 'https:');
      const response = await fetch(refresh ? undefined : url);
      setNextUrl(response?.next ?? undefined);

      return response.results;
    } catch (error) {
      throw error;
    }
  };

  const infFetch = (): Promise<T[]> => {
    return _fetch();
  };

  const stopFetchConditon = (_: T[]): boolean => {
    return isNil(nextUrl);
  };

  const refresh = () => _fetch(true);

  return (
    <InfiniteScrollList<T>
      {...props}
      fetch={_fetch}
      refresh={refresh}
      infFetch={infFetch}
      stopFetchConditon={stopFetchConditon}
    />
  );
};

const styles = StyleSheet.create({
  scrollToTopBtn: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    width: 42,
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: Colors.surface.lightGray,
  },
});
