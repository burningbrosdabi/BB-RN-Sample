import { CheckoutErrorCode, HandledError } from 'error';
import { useCallback } from 'react';
import { CheckoutRouteSetting } from 'routes/checkout/checkout.route';
import { CreateRecipientRouteSetting } from 'routes/recipient/recipient.route';
import { PhoneVerifyRouteSetting } from 'routes/verify/verifyPhone.route';
import { getRecipientList } from 'services/api';
import { getCheckoutDigest } from 'services/api/checkout/checkout.api';
import { useNavigator } from 'services/navigation/navigation.service';
import { Completer } from 'services/remote.config';
import { useActions } from 'utils/hooks/useActions';
import { useGetProvinces } from 'utils/hooks/useGetProvinces';

export const useCheckout = () => {
  const navigator = useNavigator();
  const { setLoading } = useActions();

  const { promise: onGetProvinces } = useGetProvinces();

  const excecute = useCallback(async ({ item_ids }: { item_ids: number[] }) => {
    // call digest first
    try {
      setLoading(true);
      const shouldVerifyPhone = await onGetCheckoutDigest(item_ids);
      setLoading(false);
      let phoneNumber;
      if (shouldVerifyPhone) {
        phoneNumber = await onVerifyPhoneFlow();
      }

      setLoading(true);
      const hasRecipient = await checkRecipient();
      setLoading(false);

      if (!hasRecipient) {
        await onCreateNewAddress(phoneNumber);
      }

      navigator.navigate(new CheckoutRouteSetting({ ids: item_ids }));
    } catch (e) {
      const error = new HandledError({
        error: e as Error,
        stack: 'useCheckout.excecute',
      });
      setLoading(false);
      if (
        [CheckoutErrorCode.CANCEL_PHONE_VERIFY, CheckoutErrorCode.CANCEL_CREATE_RECIPIENT].includes(
          error.code,
        )
      ) {
        return;
      }
      throw error;
    }
  }, []);

  const onGetCheckoutDigest = async (item_ids: number[]) => {
    try {
      await getCheckoutDigest(item_ids);

      return false;
    } catch (e) {
      if (!(e instanceof HandledError)) throw e;
      if (e.code !== CheckoutErrorCode.PHONE_VERIFICATION_IS_REQUIRED) throw e;

      return true;
    }
  };

  const onVerifyPhoneFlow = (): Promise<string> => {
    const promise = new Promise<string>((resolve, reject) => {
      navigator.navigate(
        new PhoneVerifyRouteSetting({
          onSuccess: (phone) => resolve(phone),
          onCanceled: () => {
            const error = new HandledError({
              error: new Error('User cancel verify step'),
              stack: 'useCheckout.onVerifyPhoneFlow',
              code: CheckoutErrorCode.CANCEL_PHONE_VERIFY,
            });
            reject(error);
          },
        }),
      );
    });

    return promise;
  };

  const onCreateNewAddress = async (phone?: string): Promise<void> => {
    const completer = new Completer<void>();
    navigator.navigate(
      new CreateRecipientRouteSetting({
        data: phone ? { contact_number: phone } : undefined,
        completer,
        isEditing: false,
      }),
    );
    try {
      setLoading(true);
      await onGetProvinces;
    } catch (error) {
      setLoading(false);
      const _error = new HandledError({
        error: Error(''),
        stack: 'useCheckout.onCreateNewAddress',
        code: CheckoutErrorCode.UNABLE_TO_GET_PROVINCES,
      });
      navigator.goBack();
      completer.reject(_error);
    }
    setLoading(false);

    return completer.promise;
  };

  const checkRecipient = async (): Promise<boolean> => {
    try {
      const recipients = await getRecipientList({ offset: 0 });

      return recipients.totalCount > 0;
    } catch (error) {
      const _error = new HandledError({
        error: Error(''),
        stack: 'useCheckout.checkRecipient',
        code: CheckoutErrorCode.FAILED_TO_GET_USER_RECIPIENT,
      });
      throw _error;
    }
  };

  return excecute;
};