import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import {
  deleteSearchHistory,
  deleteSearchProductHistory,
  deleteSearchStoreHistory,
  getSearchHistory,
  getSearchProductHistory,
  getSearchStoreHistory,
  clearSearchHistory,
} from 'services/api/search/search.api';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import FeedProduct from 'components/list/post/FeedProduct';
import IconButton from 'components/button/IconButton';
import { Colors, Typography } from 'styles';
import { GenericStyles } from 'scenes/search/style';
import { KeywordTile } from 'scenes/search/KeywordTile';
import { useNavigator } from 'services/navigation/navigation.service';
import { StoreRouteSetting } from 'routes/store/store.route';
import { RelatedProduct } from 'model/product/related.product';
import { Keyword, StoreKeyword } from 'model/search/keyword';
import { isEmpty } from 'lodash';
import { useSelectKeyword } from 'scenes/search/hook';
import { useActions } from 'utils/hooks/useActions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Ripple from 'react-native-material-ripple';
import { DabiFont } from 'assets/icons';
import { ButtonType } from 'components/button/Button';
import { HandledError } from 'error';
import { SearchHistoryContext } from 'scenes/search/context';
import { current } from '@reduxjs/toolkit';
import { Subject } from 'rxjs';

export const SearchHistory = () => {
  const [empty, _setEmpty] = useState({ keyword: true, store: true, product: true });
  const removeStream = useRef(new Subject<undefined>()).current;

  const setEmpty = (key: 'keyword' | 'store' | 'product', value: boolean) => {
    _setEmpty(curr => ({ ...curr, [key]: value }));
  };

  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
      <SearchHistoryContext.Provider value={{ empty, setEmpty, removeStream }}>
        <RemoveAll />
        {/* <ProductHistory /> */}
        <KeywordHistory />
        <StoreHistory />
        <View style={{ height: 24 }} />
      </SearchHistoryContext.Provider>
    </KeyboardAwareScrollView>
  );
};

const RemoveAll = () => {
  const { showDialog, setLoading } = useActions();
  const { empty, removeStream } = useContext(SearchHistoryContext);
  const requestRemove = () => {
    showDialog({
      title: 'Bạn có chắc chắn xóa toàn bộ lịch sử tìm kiếm?',
      actions: [
        {
          text: 'Có',
          onPress: () => {
            onRemove();
          },
        },
        {
          text: 'Hủy',
          type: ButtonType.flat,
          onPress: () => { },
          textStyle: { color: Colors.primary },
        },
      ],
    });
  };

  const onRemove = async () => {
    try {
      setLoading(true);
      await clearSearchHistory();
      removeStream.next();
    } catch (e) {
      showDialog({
        title: 'Không thể xóa lịch sử tìm kiếm',
        description: (e as HandledError).friendlyMessage,
        actions: [
          {
            text: 'OK',
            onPress: () => { },
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const isEmptySearch = useMemo(() => {
    return Object.values(empty).reduce((prev, curr) => prev && curr, true);
  }, [empty]);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
      }}>
      <Text style={Typography.title}>Recent</Text>
      <Ripple
        disabled={isEmptySearch}
        onPress={requestRemove}
        style={{ flexDirection: 'row', alignItems: 'center', opacity: isEmptySearch ? 0.5 : 1 }}>
        <View style={{ width: 4 }} />
        <DabiFont name={'bin'} />
      </Ripple>
    </View>
  );
};
export const KeywordHistory = () => {
  const { state, data: _data, excecute } = useAsync(getSearchHistory);
  const [data, setData] = useState<Keyword[]>([]);
  const { setEmpty, removeStream } = useContext(SearchHistoryContext);
  useEffect(() => {
    excecute();
    removeStream.subscribe(() => {
      setData([]);
    });
  }, []);

  useEffect(() => {
    if (!_data) return;
    setData(_data);
  }, [_data]);

  useEffect(() => {
    setEmpty('keyword', isEmpty(data));
  }, [data]);

  const navigator = useNavigator();

  const onRemove = (keyword: Keyword) => {
    setData(data.filter(key => key.pk !== keyword.pk));
    deleteSearchHistory(keyword);
  };

  const selectKeyword = useSelectKeyword();

  if (state !== ConnectionState.hasData || isEmpty(data)) {
    return <></>;
  }

  return (
    <View style={GenericStyles.sectionsContainer}>
      {data!.map((keyword, index) => {
        const onPress = () => selectKeyword(keyword.keyword);

        return (
          <KeywordTile
            onRemove={() => onRemove(keyword)}
            onPress={onPress}
            key={`${keyword}_${index}`}
            title={keyword.keyword}
          />
        );
      })}
    </View>
  );
};

export const ProductHistory = () => {
  const { state, data: _data, excecute } = useAsync(getSearchProductHistory);
  const [data, setData] = useState<RelatedProduct[]>([]);
  const { setSearchProductKeyword } = useActions();
  const { setEmpty, removeStream } = useContext(SearchHistoryContext);

  useEffect(() => {
    excecute();
    removeStream.subscribe(() => {
      setData([]);
    });
  }, []);

  useEffect(() => {
    if (!_data) return;
    setData(_data);
  }, [_data]);

  useEffect(() => {
    setEmpty('product', isEmpty(data));
  }, [data]);

  if (state !== ConnectionState.hasData) {
    return <></>;
  }

  const onRemove = (pk: number) => {
    setData(data.filter(product => product.pk !== pk));
    deleteSearchProductHistory(pk);
  };

  if (data.length <= 0) return <></>;
  return (
    <View style={GenericStyles.sectionsContainer}>
      {data!.map((product, index) => {
        return (
          <View key={`${index}`}>
            <FeedProduct
              onPress={() => setSearchProductKeyword(product)}
              containerStyle={{
                borderWidth: 0,
                marginHorizontal: 0,
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
              data={product}
            />
            <View style={{ position: 'absolute', top: 8, right: 12 }}>
              {/* tslint:disable-next-line:jsx-no-lambda */}
              <IconButton
                onPress={() => onRemove(product.pk)}
                icon={'small_delete'}
                iconSize={12}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

export const StoreHistory = () => {
  const { state, data: _data, excecute } = useAsync(getSearchStoreHistory);
  const [data, setData] = useState<StoreKeyword[]>([]);
  const { setSearchStoreKeyword } = useActions();
  const { setEmpty, removeStream } = useContext(SearchHistoryContext);

  useEffect(() => {
    excecute();
    removeStream.subscribe(() => {
      setData([]);
    });
  }, []);

  useEffect(() => {
    if (!_data) return;
    setData(_data);
  }, [_data]);

  useEffect(() => {
    setEmpty('store', isEmpty(data));
  }, [data]);

  const navigator = useNavigator();

  const onRemove = (pk: number) => {
    setData(data.filter(product => product.pk !== pk));
    deleteSearchStoreHistory(pk);
  };

  if (state !== ConnectionState.hasData || isEmpty(data)) {
    return <></>;
  }

  return (
    <View style={GenericStyles.sectionsContainer}>
      {data!.map((store, index) => {
        const onPress = () => {
          navigator.navigate(new StoreRouteSetting({ store: { pk: store.pk } }));
          setSearchStoreKeyword(store);
        };
        return (
          <KeywordTile
            key={`${store.pk}`}
            image={store.profile_image}
            onRemove={() => onRemove(store.pk)}
            onPress={onPress}
            title={store.insta_id}
          />
        );
      })}
    </View>
  );
};
