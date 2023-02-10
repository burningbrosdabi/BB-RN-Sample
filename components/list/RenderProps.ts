import {Dimension} from 'recyclerlistview/dist/reactnative/core/dependencies/LayoutProvider';
import {ConnectionStateBuilder, IConnectionStateBuilder} from './ConnectionStateBuilder';


export class RenderProps<T = undefined> {
    builder: ConnectionStateBuilder<T>;
    getTypeByData: (data: T[] | null, index: number) => string;
    dimension: { [key: string]: Dimension };
    approximateDimension: boolean;
    uid?: string

    constructor({
                    builder,
                    dimension,
                    approximateDimension,
                    uid,
                    getTypeByData
                }: {
        builder: IConnectionStateBuilder<T>;
        dimension: { [key: string]: Dimension };
        approximateDimension?: boolean;
        uid?: string;
        getTypeByData: (data: T[] | null, index: number) => string;
    }) {
        this.builder = new ConnectionStateBuilder(builder);
        this.getTypeByData = getTypeByData;
        this.dimension = dimension;
        this.approximateDimension = approximateDimension ?? false;
        this.uid = uid;
    }
}
