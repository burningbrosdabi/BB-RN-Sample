import { useCallback, useState } from 'react';
import { ContextRepo, FilterModalRoute, IFilterModalContext } from './types.d';

export const useFilterModal = (): IFilterModalContext => {
  const [visible, setVisible] = useState(false);
  const [route, setRoute] = useState(FilterModalRoute.price);

  const open = (value: FilterModalRoute) => {
    setRoute(value);
    setVisible(true);
  };

  const close = () => {
    setVisible(false);
  };

  return {
    value: {
      visible,
      route,
    },
    open,
    close,
  };
};

export const useRepositoryContext = <T extends object>({
  initialValue,
}: {
  initialValue: T;
}): ContextRepo<T> => {
  const [value, setValue] = useState<T>(initialValue);

  const create = useCallback(
    (value: T) => {
      setValue(value);
    },
    [value],
  );

  const read = useCallback(() => value, [value]);

  const update = (newValue: T) => {
    setValue(newValue);
  };

  const deleteValue = useCallback(() => setValue({} as T), []);

  return {
    create,
    read,
    update,
    delete: deleteValue,
    repo: value,
  };
};
