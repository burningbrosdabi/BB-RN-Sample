import { useCallback, useState } from 'react';
import { ContextRepo, IFilterModalContext } from './types';

export const useFilterModal = (): IFilterModalContext => {
  const [visible, setVisible] = useState(false);

  const open = () => {
    setVisible(true);
  };

  const close = () => {
    setVisible(false);
  };

  return {
    value: {
      visible,
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
