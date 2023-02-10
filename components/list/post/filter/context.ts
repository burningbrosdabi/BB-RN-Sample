import { get } from 'lodash';
import { createContext } from 'react';
import { feedbackOrderingList, OrderingInterface } from 'utils/data';
import {
  ContextRepo,
  Filter, IFilterModalContext, ModalContext
} from './types';

export default createContext<IFilterModalContext>({
  value: { visible: false },
  open: () => {
    /** */
  },
  close: () => {
    /** */
  },
});

export const defaultFilter: Filter = {
  styleFilter: undefined,
  weightFilter: undefined,
  heightFilter: undefined
};

export const FeedFilterRepoContext = createContext<ContextRepo<Filter>>({
  create: (value: Filter) => { },
  read: () => defaultFilter,
  update: (value: Filter) => { },
  delete: () => { },
  repo: defaultFilter,
});


export const FeedOrderingContext = createContext<ModalContext>({
  visible: false,
  toogle: () => {
    /** */
  },
});

export const FeedOrderingRepoContext = createContext<ContextRepo<OrderingInterface>>({
  create: (value: OrderingInterface) => { },
  read: () =>
    get(feedbackOrderingList, '[0]', {
      description: 'Xem bài viết gần đây',
      key: 'recent',
    }) as OrderingInterface,
  update: (value: OrderingInterface) => { },
  delete: () => { },
  repo: get(feedbackOrderingList, '[0]', {
    description: 'Xem bài viết gần đây',
    key: 'recent',
  }) as OrderingInterface,
});
