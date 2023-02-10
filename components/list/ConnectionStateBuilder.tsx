import { Dimension } from 'recyclerlistview/dist/reactnative/core/dependencies/LayoutProvider';
import { ConnectionState } from 'utils/hooks/useAsync';

export type ElementBuilder = (dimension: Dimension) => JSX.Element;
export type ElementIndexedDataBuilder<T> = (
  dimension: Dimension,
  data?: T | undefined | null,
  index?: number,
) => JSX.Element;

export interface IConnectionStateBuilder<T> {
  none: ElementBuilder;
  hasError?: ElementBuilder;
  waiting?: ElementBuilder;
  hasData?: ElementIndexedDataBuilder<T>;
  hasEmptyData?: ElementBuilder;
}

export class ConnectionStateBuilder<T> implements IConnectionStateBuilder<T> {
  none: ElementBuilder;
  waiting: ElementBuilder;
  hasData?: ElementBuilder | ElementIndexedDataBuilder<T>;
  hasEmptyData: ElementBuilder;
  hasError: ElementBuilder;
  state = ConnectionState.none;
  dimension: Dimension = { width: 0, height: 0 };
  data?: T;
  index = 0;

  constructor(props: IConnectionStateBuilder<T>) {
    const { none, hasError, waiting, hasData, hasEmptyData } = props;
    this.hasData = hasData;
    this.none = none;
    this.hasError = hasError ?? none;
    this.waiting = waiting ?? none;
    this.hasEmptyData = hasEmptyData ?? none;
  }

  inject({
    state,
    data,
    index,
    dimension,
  }: {
    state?: ConnectionState;
    data?: T;
    index?: number;
    dimension?: Dimension;
  }) {
    this.state = state ?? this.state;
    this.data = data ?? this.data;
    this.index = index ?? this.index ?? 0;
    this.dimension = dimension ?? this.dimension;
  }

  build(): JSX.Element {
    switch (this.state) {

      case ConnectionState.hasData:
        if (!this.hasData) return this.none(this.dimension);

        return this.hasData(this.dimension, this.data, this.index);

      case ConnectionState.hasEmptyData:
        return this.hasEmptyData(this.dimension);

      case ConnectionState.hasError:
        return this.hasError(this.dimension);
      case ConnectionState.waiting:
        return this.waiting(this.dimension);

      case ConnectionState.none:
      default:
        return this.none(this.dimension);

    }
  }
}
/***
 * export const useConnectionStateBuilder = <T extends Object>(
  props: IConnectionStateBuilder<T>,
): {
  build: () => JSX.Element;
  inject: (injectValue: {
    state?: ConnectionState;
    data?: T;
    index?: number;
    dimension?: Dimension;
  }) => void;
} => {
  const [state, setState] = useState(ConnectionState.none);
  const data = useRef<T | undefined>();
  const index = useRef<number>(0);
  const dimension = useRef<Dimension>({ width: 0, height: 0 });
  const { none, hasData, hasEmptyData = none, hasError = none, waiting = none } = props;

  return {
    build: () => {
      switch (state) {
        case ConnectionState.hasData:
          if (!hasData) return none(dimension.current);

          return hasData(data.current!, index.current, dimension.current);
        case ConnectionState.hasEmptyData:
          return hasEmptyData(dimension.current);
        case ConnectionState.hasError:
          return hasError(dimension.current);
        case ConnectionState.waiting:
          return waiting(dimension.current);
        case ConnectionState.none:
        default:
          return none(dimension.current);
      }
    },
    inject: ({ state, data: nextData, index: nextIndex, dimension: nextDimension }) => {
      if (state) setState(state);
      if (nextData) data.current = nextData;
      if (nextIndex) index.current = nextIndex;
      if (nextDimension) dimension.current = nextDimension;
    },
  };
};
*/
