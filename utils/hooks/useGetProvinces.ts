import { HandledError } from 'error';
import { useEffect, useRef } from 'react';
import { getProvincesData } from 'services/api/notification/commonAPI';
import { Completer } from 'services/remote.config';
import { sortData } from 'utils/helper/function.helper';
import { useActions } from './useActions';
import { ConnectionState, useAsync } from './useAsync';
import { useTypedSelector } from './useTypedSelector';

export const useGetProvinces = () => {
  const { token } = useTypedSelector((state) => state.auth);
  const completer = useRef(new Completer<void>());

  const { setProvincesList } = useActions();
  const { provinces } = useTypedSelector((state) => state.user);

  const onGetProvincesData = async () => {
    const result = await getProvincesData({ token });
    setProvincesList(sortData(result.data));
  };

  const { excecute, state, error } = useAsync(onGetProvincesData);

  useEffect(() => {
    if (!provinces || provinces?.length <= 0) {
      excecute();
    } else completer.current.complete();
  }, []);

  useEffect(() => {
    if (state === ConnectionState.hasData || state === ConnectionState.hasEmptyData) {
      completer?.current.complete();
    } else if (state === ConnectionState.hasError) {
      const _error = new HandledError({
        error: error as Error,
        stack: 'useGetProvinces.useEffect',
      });
      _error.log(true);
      completer?.current.reject(_error);
    }
  }, [state, error]);

  return { state, error, promise: completer?.current?.promise };
};
