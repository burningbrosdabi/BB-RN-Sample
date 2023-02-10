import { first } from 'lodash';
import React, { useMemo } from 'react';
import { } from 'react-native';
import { feedbackOrderingList, OrderingInterface } from 'utils/data';
import {
  defaultFilter,
  FeedFilterRepoContext,
  FeedOrderingRepoContext
} from './context';
import { useRepositoryContext } from './hook';
import { Filter } from './types';

const _HOC = ({ children }: { children: JSX.Element }) => {
  const orderingContext = useRepositoryContext<OrderingInterface>({
    initialValue: first(feedbackOrderingList) ?? ({} as OrderingInterface),
  });

  const filterContext = useRepositoryContext<Filter>({
    initialValue: defaultFilter,
  });

  const _child = useMemo(() => {
    return children;
  }, []);

  return (
    <FeedFilterRepoContext.Provider value={filterContext}>
      <FeedOrderingRepoContext.Provider value={orderingContext}>
        {_child}
      </FeedOrderingRepoContext.Provider>
    </FeedFilterRepoContext.Provider>
  );
};

const HOC = (Component: React.FC<any>) => ({ ...props }) => (
  <_HOC>
    <Component {...props} />
  </_HOC>
);

export default HOC;
