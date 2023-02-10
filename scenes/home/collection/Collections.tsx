import { range } from 'lodash';
import {
  CollectionType,
  ProductCollection,
  FlashSaleCollection,
  StoreCollection,
} from 'model/collection';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { Text, View } from 'react-native';
import { getCollection } from 'services/api';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import {
  FlashSaleCollections,
  ProductCollectionPlaceholder,
  ProductCollections,
} from './ProductCollectionList';
import { StoreCollectionList } from './StoreCollectionList';

export interface CollectionsRef {
  refresh: () => Promise<any>;
}

export const Collections = forwardRef((_, ref) => {
  const { state, excecute, data } = useAsync(getCollection);

  useImperativeHandle<unknown, CollectionsRef>(ref, () => ({
    refresh: excecute,
  }));

  useEffect(() => {
    excecute();
  }, []);

  if (state === ConnectionState.hasError || state === ConnectionState.hasEmptyData) return <></>;
  if (state === ConnectionState.waiting) {
    return range(3).map((_,index) => {
      return (
        <View key={`${index}`}>
          <ProductCollectionPlaceholder />
          <View style={{ height: 36 }} />
        </View>
      );
    });
  }

  return (
    <>
      {data?.map((collection, index) => {
        let child;

        switch (collection.type) {
          case CollectionType.product:
            child = <ProductCollections data={collection as ProductCollection} />;
            break;
          case CollectionType.flash_sale:
            child = <FlashSaleCollections data={collection as FlashSaleCollection} />;
            break;
          default:
            child = <StoreCollectionList data={collection as StoreCollection} />;
        }

        return (
          <View key={`${index}`}>
            {child}
            <View style={{ height: 36 }} />
          </View>
        );
      })}
    </>
  );
});
