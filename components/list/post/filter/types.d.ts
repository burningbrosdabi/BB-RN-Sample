import { heightKey, StyleKey, weightKey } from 'utils/data';

interface ContextRepo<T> {
  create: (value: T) => void;
  read: () => T;
  update: (value: T) => void;
  delete: () => void;
  repo: T;
}

interface ModalProps {
  visible: boolean;
}

interface IFilterModalContext {
  value: ModalProps;
  open: () => void;
  close: () => void;
}
interface ModalContext {
  visible: boolean;
  toogle: () => void;
}

export enum FilterModalRoute {
  height = 0,
  weight = 1,
  style = 2
}

type Filter = {
  styleFilter: StyleKey | undefined;
  weightFilter: weightKey | undefined;
  heightFilter: heightKey | undefined
};

export type { IFilterModalContext, ModalProps, ModalContext, ContextRepo, Filter };
