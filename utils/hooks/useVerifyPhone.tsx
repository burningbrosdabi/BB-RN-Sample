import { HandledError, PhoneVerifyErrorCode } from 'error';
import { useEffect } from 'react';
import { VerifyBlockedRouteSetting } from 'routes/verify/verifyPhone.route';
import { OTPMethod, verifyPhone } from 'services/api/verify';
import { useNavigator } from 'services/navigation/navigation.service';
import { ConnectionState, IUseAsyncReturned, useAsync } from './useAsync';
import { useActions } from './useActions';

export const useVerifyPhone = ({
  phone,
  method = OTPMethod.sms,
  onBlocked = () => {},
}: {
  phone: string;
  method?: OTPMethod;
  onBlocked?: () => void;
}): IUseAsyncReturned<void> => {
  const useAsyncProps = useAsync(() => verifyPhone(phone, method));
  const navigator = useNavigator();
  const { state, error } = useAsyncProps;
  const { showDialog } = useActions();

  useEffect(() => {
    if (state === ConnectionState.hasError) {
      const handledError = new HandledError({
        error: error as Error,
        stack: 'useVerifyPhone.useEffect[error,state]',
      });
      handledError.log(true);

      if (handledError.code === PhoneVerifyErrorCode.ACCOUNT_HAS_BEEN_BLOCKED) {
        onBlocked();
        navigator.navigate(
          new VerifyBlockedRouteSetting({
            phone,
          }),
        );
      } else {
        showDialog({
          title: 'Không thể xác thực số điện thoại',
          description: handledError.friendlyMessage,
          actions: [
            {
              text: 'OK',
              onPress: () => {},
            },
          ],
        });
      }
    }
  }, [error, state]);

  return useAsyncProps;
};
