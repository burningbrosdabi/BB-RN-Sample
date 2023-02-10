import { toast } from 'components/alert/toast';
import { Button, ButtonType, LayoutConstraint } from 'components/button/Button';
import IconButton, { DEFAULT_IC_BTN_PADDING } from 'components/button/IconButton';
import { isEmpty } from 'lodash';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { feedbackOrderingList, heightKey, heightList, OrderingInterface, StyleKey, styleList, weightKey, weightList } from 'utils/data';
import { useActions } from 'utils/hooks/useActions';
// styles
import { Colors, Typography } from '_styles';
import FilterContext, {
  FeedFilterRepoContext, FeedOrderingContext, FeedOrderingRepoContext
} from './context';
import FilterList from './FilterList';
import { FilterModalRoute, IFilterModalContext } from './types.d';
import OrderList from 'components/list/order/OrderList';


export interface ModalProps {
  visible: boolean;
}
export const FilterModalRouteMap: { [id: number]: string } = {
  [FilterModalRoute.height]: 'Chiều cao',
  [FilterModalRoute.weight]: 'Cân nặng',
  [FilterModalRoute.style]: 'Phong cách',
};

const FeedFilter = () => {
  const { repo, update: setFilter } = useContext(FeedFilterRepoContext);
  const { styleFilter, weightFilter, heightFilter } = repo;
  const { repo: OrderingRepo, update: setOrdering } = useContext(FeedOrderingRepoContext);


  const { value, close } = useContext<IFilterModalContext>(FilterContext);
  const { visible } = value;
  const { showDialog } = useActions();

  const [style, setStyle] = useState<StyleKey | undefined>(styleFilter);
  const [weight, setWeight] = useState<weightKey | undefined>(weightFilter);
  const [height, setHeight] = useState<heightKey | undefined>(heightFilter);

  const modalizeRef = useRef<Modalize>(null);

  useEffect(() => {
    setStyle(styleFilter);
    setWeight(weightFilter)
    setHeight(heightFilter)
  }, [styleFilter, weightFilter, heightFilter]);

  useEffect(() => {
    if (visible) {
      modalizeRef.current?.open();
    } else {
      modalizeRef.current?.close();
    }
  }, [visible]);


  const _onClose = () => {
    setStyle(styleFilter);
    setWeight(weightFilter)
    setHeight(heightFilter)
  };

  const _removeAll = () => {
    showDialog({
      title: 'Bạn muốn xóa bộ lọc??',
      actions: [
        {
          type: ButtonType.primary,
          text: 'Xóa',
          onPress: () => {
            setStyle(undefined);
            setHeight(undefined)
            setWeight(undefined)
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
  };


  const _applyFilter = () => {
    setFilter({
      styleFilter: style,
      weightFilter: weight,
      heightFilter: height
    });

    if (
      !isEmpty(style) ||
      !isEmpty(weight) ||
      !isEmpty(height)
    ) {
      if (OrderingRepo == feedbackOrderingList[1]) {
        setOrdering(feedbackOrderingList[0])
        toast('Làm mới sắp xếp');

      } else {
        toast('Áp dụng bộ lọc');
      }
    }

    modalizeRef.current?.close();
  };

  return (
    <Portal>
      <Modalize
        // adjustToContentHeight
        ref={modalizeRef}
        rootStyle={{ zIndex: 10, elevation: 10 }}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
        onClosed={() => {
          _onClose();
          close();
        }}
        HeaderComponent={() => {
          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 36,
                marginBottom: 12
              }}>
              <View style={{ paddingLeft: 16 - DEFAULT_IC_BTN_PADDING, marginRight: 12 }}>
                <IconButton
                  icon={'close'}
                  onPress={() => {
                    _onClose();
                    modalizeRef.current?.close();
                  }}
                />
              </View>

              <Text style={Typography.title}>Bộ lọc KOL phù hợp</Text>
              <View style={{ flex: 1 }} />
              <View style={{ paddingRight: 16 }}>
                <Button
                  text="Cài đặt lại"
                  type={ButtonType.flat}
                  onPress={_removeAll}
                  constraint={LayoutConstraint.wrapChild}
                  textStyle={{ ...Typography.description, color: Colors.primary }}
                  innerHorizontalPadding={0}
                /></View>
            </View>
          );
        }}
        FooterComponent={
          <View
            style={{
              flexDirection: 'row',
              paddingTop: 12,
              paddingHorizontal: 16,
              paddingBottom: 24,
            }}>
            <Button text="ÁP DỤNG" type={ButtonType.primary} onPress={_applyFilter} />
          </View>
        }

        withHandle={false}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
          <Text style={{ ...Typography.subtitle, marginTop: 12, marginBottom: 12 }}>Chiều cao</Text>
          <FilterList
            filterList={heightList}
            filter={height}
            setFilter={setHeight}
            buttonType="text"
            isRadio
          />
          <Text style={{ ...Typography.subtitle, marginTop: 24, marginBottom: 12 }}>Cân nặng</Text>
          <FilterList
            filterList={weightList}
            filter={weight}
            setFilter={setWeight}
            buttonType="text"
            isRadio
          />
          <Text style={{ ...Typography.subtitle, marginTop: 24, marginBottom: 12 }}>Phong cách</Text>
          <FilterList
            filterList={styleList}
            filter={style}
            setFilter={setStyle}
            buttonType="text"
            isRadio
          />
        </ScrollView>
      </Modalize>
    </Portal>
  );
};


export default FeedFilter;



export const FeedOrderingModal = () => {
  const modalizeRef = useRef<Modalize>(null);
  const orderingContext = useContext(FeedOrderingContext);
  const { visible, toogle } = orderingContext;
  const orederingRepoContext = useContext(FeedOrderingRepoContext);
  const { repo, update } = orederingRepoContext;
  const { repo: styleRepo, update: setFilter } = useContext(FeedFilterRepoContext);
  const { styleFilter, weightFilter, heightFilter } = styleRepo;
  useEffect(() => {
    console.log(visible)
    if (visible) {
      modalizeRef.current?.open();
    } else {
      modalizeRef.current?.close();
    }
  }, [visible]);

  const _applyOrdering = (orderingType: OrderingInterface) => {
    update(orderingType);
    if (orderingType == feedbackOrderingList[1]) {
      if (styleFilter || weightFilter || heightFilter) {
        toast('Làm mới bộ lọc')
      }
      setFilter({
        styleFilter: undefined,
        weightFilter: undefined,
        heightFilter: undefined
      })
    }
    modalizeRef.current?.close();
  };

  const _renderHeader = () => {
    return <View style={{ height: 22 }} />;
  };

  return (
    <Portal>
      <FeedOrderingRepoContext.Provider value={orederingRepoContext}>
        <Modalize
          ref={modalizeRef}
          panGestureEnabled
          rootStyle={{ zIndex: 10, elevation: 10 }}
          scrollViewProps={{ showsVerticalScrollIndicator: false }}
          onClose={toogle}
          HeaderComponent={_renderHeader}
          adjustToContentHeight
          withHandle={false}>
          <OrderList orderList={feedbackOrderingList} orderingType={repo} onPress={_applyOrdering} />
        </Modalize>
      </FeedOrderingRepoContext.Provider>
    </Portal>
  );
};