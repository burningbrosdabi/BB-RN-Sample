import { List } from 'components/list/product/ProductList.v2';
import { ProductListDTO, ProductListFilterInterface } from 'services/api/product/product.dtos';
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Typography } from 'styles';
import { CollectionType } from 'model/collection/collection';
import { getProductCollection } from 'services/api/collection';
import { ProductFilter } from 'components/list/product/filter';
import type { ListOnScroll } from 'components/list/ListController';
import {Banner} from "scenes/home/landing/Banner";

export const ProductLanding = ProductFilter.HOC(
  ({
    id,
    type,
    onScroll,
  }: {
    id: number;
    type: CollectionType;
    onScroll: ListOnScroll;
  }) => {
    const fetchCollection = ({ offset }: ProductListFilterInterface): Promise<ProductListDTO> => {
      return getProductCollection({ pk: id, offset: offset ?? 0, type });
    };

    const { fetch, count, controller } = List.useHandler(undefined, fetchCollection);

    useEffect(() => {
      controller.onScroll = onScroll;
    }, [controller]);

    return (
      <List.Product
        controller={controller}
        HeaderComponent={
          <>
            <Banner type={type} id={id}/>
            <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
              <Text style={Typography.description}>{`Có ${count} sản phẩm`}</Text>
            </View>
          </>
        }
        fetch={fetch}
      />
    );
  },
);
