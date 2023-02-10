import React from 'react';
import {
    BaseLayoutProvider,
    Dimension,
    LayoutProvider,
} from 'recyclerlistview/dist/reactnative/core/dependencies/LayoutProvider';
import { ConnectionState } from 'utils/hooks/useAsync';
import type { RowRender } from './InfiniteScrollList';
import { RenderProps } from './RenderProps';

interface IListBuilder<T> {
    rowRenderer: RowRender<T>;
    layoutProvider: BaseLayoutProvider;
}

export type { IListBuilder };


enum LayoutType {
    expandViewPort = 'expandViewPort'
}

export class BaseBuilder<T> {
    item: RenderProps<T>;
    state: ConnectionState;
    readonly layoutProvider: BaseLayoutProvider;
    data: T[] | null;
    viewPort: Dimension

    constructor({
        item,
        state,
        viewPort,
        data
    }: {
        item: RenderProps<T>;
        state: ConnectionState;
        viewPort: Dimension;
        data: T[] | null;
    }) {
        this.data = data;
        this.state = state;
        this.viewPort = {
            width: viewPort.width,
            height: Math.max(viewPort.height, 360)
        };
        this.item = item;
        this.layoutProvider = new LayoutProvider(
            (index) => {
                if (state !== ConnectionState.hasData) return LayoutType.expandViewPort;
                return this.item.getTypeByData(data, index);
            },
            (type, dim, index) => {
                const { width, height } = this.getDimensionByType(`${type}`);
                dim.width = width;
                dim.height = height;
            },
        );
    }

    getDimensionByType(type: string): Dimension {
        if (type === LayoutType.expandViewPort) {
            return this.viewPort;
        } else {
            const dimension = this.item.dimension[type]
            if (!dimension) throw new Error('[ListBuilder] mismatch type dimension');
            return {
                width: dimension.width,
                height: dimension.height,
            }
        }
    }

    rowRenderer: RowRender<T> = (type, data, index) => {
        const { hasData, hasError, hasEmptyData, none, waiting } = this.item.builder;
        const dimension = this.getDimensionByType(`${type}`);
        switch (this.state) {
            case ConnectionState.hasData:
                if (!hasData) return none(dimension);

                return hasData(dimension, data, index);

            case ConnectionState.hasEmptyData:
                return hasEmptyData(dimension);

            case ConnectionState.hasError:
                return hasError(dimension);
            case ConnectionState.waiting:
                return waiting(dimension);

            case ConnectionState.none:
            default:
                return none(dimension);

        }
    };
}
