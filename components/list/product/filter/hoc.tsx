import { first } from 'lodash';
import React, { useMemo } from 'react';
import { } from 'react-native';
import { OrderingInterface, productOrderingList } from 'utils/data/filter';
import {
  CategoryRepoContext,
  defaultCatgFilter,
  defaultFilter,
  FilterRepoContext,
  OrderingRepoContext,
} from './context';
import { useRepositoryContext } from './hook';
import { Filter, ICategoryFilter } from './types.d';

const _HOC = ({ children }: { children: JSX.Element }) => {
  const orderingContext = useRepositoryContext<OrderingInterface>({
    initialValue: first(productOrderingList) ?? ({} as OrderingInterface),
  });

  const categoryContext = useRepositoryContext<ICategoryFilter>({
    initialValue: defaultCatgFilter,
  });

  const filterContext = useRepositoryContext<Filter>({
    initialValue: defaultFilter,
  });

  const _child = useMemo(() => {
    return children;
  }, []);

  return (
    <FilterRepoContext.Provider value={filterContext}>
      <CategoryRepoContext.Provider value={categoryContext}>
        <OrderingRepoContext.Provider value={orderingContext}>
          {_child}
        </OrderingRepoContext.Provider>
      </CategoryRepoContext.Provider>
    </FilterRepoContext.Provider>
  );
};

const HOC = (Component: React.FC<any>) => ({ ...props }) => (
  <_HOC>
    <Component {...props} />
  </_HOC>
);

export default HOC;
