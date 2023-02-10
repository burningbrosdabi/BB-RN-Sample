import { ProductBoxPlaceholderRow } from 'components/list/product/ProductBox';
import ProductListHorizontal, { ProductListHorizontalPlaceholder } from 'components/list/product/ProductListHorizontal';
import { ProductInfo } from 'model/product/product';
import React, { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { Colors } from 'styles';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { getProductList } from '_api';

export const RelatedProductList = ({
    category,
    subcategory,
    storePk,
    is_discount,
    simple = true,
    title,
    containerStyle
}: {
    category?: string;
    subcategory?: string;
    storePk?: number;
    is_discount?: boolean,
    simple?: boolean,
    title: string,
    containerStyle?: ViewStyle
}) => {
    const fetch = async (): Promise<ProductInfo[]> => {
        const { data, totalCount } = await getProductList({
            ...category ? { categoryFilter: category } : undefined,
            ...subcategory ? { subCategoryFilter: subcategory } : undefined,
            ...is_discount ? { 'is-discount': true } : undefined,
            ...storePk ? { storePk } : undefined
        });
        if (totalCount < 3) {
            const response = await getProductList({ categoryFilter: category, storePk });

            return response.data;
        }

        return data;
    };

    const { data, excecute, state } = useAsync(fetch);

    useEffect(() => {
        excecute();
    }, []);

    if (state === ConnectionState.hasData) {
        return (
            <ProductListHorizontal
                simple={simple}
                data={data!}
                title={title}
                containerStyle={containerStyle}
            />
        );
    }
    if (state === ConnectionState.waiting) {
        return (
            <View style={containerStyle}>
                <ProductListHorizontalPlaceholder />
            </View>
        );
    }
    return <></>;
};
