import { CheckoutErrorCode, HandledError, ServerError } from 'error';
import { isEmpty, omit, first } from 'lodash';
import { JSONType } from 'model';
import { CartSummary, CheckoutDigest, ShippingOptions } from 'model/checkout/checkout';
import type {
  ICartSummary,
  ICheckoutDigest,
  IShippingOptions,
  ShippingOptionMap,
  SubcartOption,
} from 'model/checkout/type';
import { Http } from 'services/http/http.service';
import { store } from 'utils/state';
import { setRecipients } from 'utils/state/action-creators';
import { getRecipientList } from '../recipient/recipient.api';

export const getCheckoutDigest = async (ids: number[]): Promise<CheckoutDigest> => {
  try {
    const response = await Http.instance.get<ICheckoutDigest>('v1/checkout/digest/', {
      params: { item_ids: ids.join(',') },
    });

    return new CheckoutDigest().fromJSON(response.data);
  } catch (e) {
    const error = new HandledError({
      error: e as Error,
      stack: 'checkout.api.getCheckoutDigest',
    });

    if (error.rootError instanceof ServerError) {
      const message = error.rootError.friendlyMessage;
      if (
        CheckoutErrorCode[message] &&
        message === CheckoutErrorCode.PHONE_VERIFICATION_IS_REQUIRED
      ) {
        // user have not verify phone yet
        throw new HandledError({
          error: new Error('otp_verify_failed'),
          code: CheckoutErrorCode.PHONE_VERIFICATION_IS_REQUIRED,
          stack: 'checkout.api.getCheckoutDigest',
        });
      }
    }

    throw error;
  }
};

const getShippingOption = async (
  id: number,
  shipping_address?: number,
): Promise<[number, ShippingOptions[]] | null> => {
  try {
    const params: JSONType = { store_id: id };
    if (shipping_address) {
      params['to_address_id'] = shipping_address;
    }
    const response = await Http.instance.get<IShippingOptions[]>('v1/checkout/shipping-options/', {
      params,
    });

    return [id, new ShippingOptions().fromListJSON(response.data)];
  } catch (error) {
    new HandledError({
      error: error as Error,
      stack: 'checkout.api.getShippingOption',
    }).log(true);

    return null;
  }
};

export const getShippingOptionMap = async (
  ids: number[],
  shipping_address?: number,
): Promise<ShippingOptionMap> => {
  try {
    const promises = ids.map<Promise<[number, ShippingOptions[]] | null>>((id) =>
      getShippingOption(id, shipping_address),
    );

    const options = await Promise.all(promises);
    const results: ShippingOptionMap = {};
    options.forEach((option) => {
      if (!option) return;
      const [id, value] = option;
      results[id] = value;
    });

    return results;
  } catch (error) {
    throw new HandledError({
      error: error as Error,
      stack: 'checkout.api.getShippingOptionMap',
    });
  }
};

export const getCheckoutData = async (
  ids: number[],
): Promise<{
  digest: CheckoutDigest;
  shippingOption: ShippingOptionMap;
}> => {
  try {
    const digest = await getCheckoutDigest(ids);
    const subcart = digest.cart.sub_carts ?? [];
    if (isEmpty(subcart)) throw Error('sub_carts is empty');
    const storeIds = subcart.map((sub) => sub.store.pk);
    const shippingOption = await getShippingOptionMap(storeIds);
    const { data: recipients } = await getRecipientList({ offset: 0 });

    if (isEmpty(recipients)) {
      throw new HandledError({
        error: new Error('Recipient list not found'),
        code: CheckoutErrorCode.EMPTY_RECIPIENT_LIST,
        stack: 'checkout.getCheckoutData',
      });
    }

    store.dispatch(setRecipients(recipients));

    return {
      digest,
      shippingOption,
    };
  } catch (error) {
    throw new HandledError({
      error: error as Error,
      stack: 'checkout.api.getCheckoutData',
    });
  }
};

export const recalculate = async (
  _digest_key: string,
  sub_carts: SubcartOption[],
  shipping_address: number | null,
): Promise<ICartSummary> => {
  try {
    const response = await Http.instance.post<ICartSummary>('v1/checkout/summary/', {
      _digest_key,
      sub_carts,
      shipping_address,
    });

    const data = new CartSummary().fromJSON(response.data);

    return data;
  } catch (error) {
    throw new HandledError({
      error: error as Error,
      stack: 'checkout.api.recalculate',
    });
  }
};

interface PurchaseDTO {
  _digest_key: string;
  payment_method: number;
  shipping_address?: number | null;
  sub_carts: SubcartOption[];
}

export const purchase = async (purchaseDTO: PurchaseDTO) => {
  try {
    const data = omit(purchaseDTO, 'sub_carts') as JSONType;
    data.cart = {};
    const sub_carts = purchaseDTO.sub_carts.map((option) => {
      const newOption = omit(option, 'shipping_option_id') as JSONType;

      newOption.shipping = {
        pk: option.shipping_option_id,
        prefer_delivery_time: 1,
      };

      return newOption;
    });
    data.cart.sub_carts = sub_carts;
    await Http.instance.post('v1/checkout/purchase/', data);
  } catch (error) {
    throw new HandledError({
      error: error as Error,
      stack: 'checkout.api.purchase',
    });
  }
};
