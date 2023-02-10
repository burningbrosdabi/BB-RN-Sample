import {nanoid} from 'nanoid/non-secure';
import flat from 'flat';
import type {Primitive} from 'utils/types';
import {FirebaseAnalyticsTypes} from '@react-native-firebase/analytics';
import {store} from 'utils/state';
import {HandledError} from 'error';
import {isFunction, omit, omitBy} from 'lodash';
import {JSONType} from 'model';
import moment from 'moment';

export abstract class TrackingEvent {
    abstract name: string;
    timestamp = moment.utc(new Date()).format('YYYY-MM-DDTHH:mm:ss');
    // kibana required key
    message = '';
    id = nanoid(21);
    userId = store.getState()?.user?.userInfo.id ?? '';
    sessionId = '';

    toJSON(option?: { flatten?: boolean }): { [id: string]: Primitive } | JSONType {
        let json: { [id: string]: Primitive } | JSONType;
        const flatten = option?.flatten ?? true;
        if (flatten) {
            json = flat<TrackingEvent, { [id: string]: Primitive } | JSONType>(this, {
                delimiter: '_',
            });
        } else {
            json = omitBy<JSONType>(this, isFunction);
        }

        if (!flatten) {
            // kibana required key
            json['@timestamp'] = this.timestamp;

            return omit(json, 'timestamp');
        }

        return json;
    }
}

export class NavigationEvent extends TrackingEvent {
    name = 'navigate';
    from: string;
    to: string;
    params?: object;

    constructor(from: string, to: string, params?: object) {
        super();
        this.from = from;
        this.to = to;
        this.params = params;
    }
}

interface LogNavigationParams {
    from: string;
    to: string;
    params?: object;
}

interface ProductEventParams {
    value: number;
    item: FirebaseAnalyticsTypes.Item;
}

interface CommerceEventParams {
    value: number;
    items: FirebaseAnalyticsTypes.Item[];
    coupon?: string;
    payment_type?: string;
    affiliation?: string;
    transaction_id?: string;
    shipping?: number;
}

export class AddToCartEvent {
    #event: CommerceEventParams;

    constructor(event: CommerceEventParams) {
        this.#event = event;
    }

    toFirebaseEvent(): FirebaseAnalyticsTypes.AddToCartEventParameters {
        return {
            items: this.#event.items,
            value: this.#event.value,
            currency: 'vnd',
        };
    }
}

export class BeginCheckoutEvent {
    #event: CommerceEventParams;

    constructor(event: CommerceEventParams) {
        this.#event = event;
    }

    toFirebaseEvent(): FirebaseAnalyticsTypes.BeginCheckoutEventParameters {
        return {
            items: this.#event.items,
            currency: 'vnd',
            value: this.#event.value,
            coupon: this.#event.coupon,
        };
    }
}

export class AddPaymentInfoEvent {
    #event: CommerceEventParams;

    constructor(event: CommerceEventParams) {
        this.#event = event;
    }

    toFirebaseEvent(): FirebaseAnalyticsTypes.AddPaymentInfoEventParameters {
        return {
            items: this.#event.items,
            currency: 'vnd',
            value: this.#event.value,
            payment_type: this.#event.payment_type,
        };
    }
}

export class PurchaseEvent {
    #event: CommerceEventParams;

    constructor(event: CommerceEventParams) {
        this.#event = event;
    }

    toFirebaseEvent(): FirebaseAnalyticsTypes.PurchaseEventParameters {
        return {
            items: this.#event.items,
            affiliation: this.#event.affiliation,
            currency: 'vnd',
            value: this.#event.value,
            coupon: this.#event.coupon,
            transaction_id: this.#event.transaction_id,
            shipping: this.#event.shipping,
        };
    }
}

export class BackFromShopeeEvent extends TrackingEvent {
    name = 'back_from_shopee';
    from: string;
    to: string;
    params?: object;

    constructor(event: LogNavigationParams) {
        super();
        this.from = event.from;
        this.to = event.to;
        this.params = event.params;
    }
}

export class WillingToBuyEvent extends TrackingEvent {
    name = 'willing_to_buy';
    price: number;
    item_id: string;

    constructor(event: ProductEventParams) {
        super();
        this.price = event.value;
        this.item_id = event.item.item_id!;
    }
}

export class ProductEventAdapter {
    #event: ProductEventParams;

    constructor(event: ProductEventParams) {
        this.#event = event;
    }

    toFirebaseEvent(): FirebaseAnalyticsTypes.ViewItemEventParameters {
        return {
            value: this.#event.value,
            currency: 'vnd',
            items: [this.#event.item],
        };
    }

    toAppsFlyer(): {
        af_content_id: string;
        af_content_type: string;
        af_price: number;
        af_currency: 'vnd';
    } {
        return {
            af_content_id: this.#event.item.item_id!,
            af_content_type: this.#event.item.item_category!,
            af_price: this.#event.value,
            af_currency: 'vnd',
        };
    }
}

export class PhoneVerifyEvent extends TrackingEvent {
    name = 'phone_verify';
    phone: string;

    constructor({phone}: { phone: string }) {
        super();
        this.phone = phone;
    }
}

export class PhoneVerifySuccess extends PhoneVerifyEvent {
    name = 'phone_verify_success';
}

export class OTPVerifyEvent extends TrackingEvent {
    name = 'otp_verify';
    phone: string;
    otp: string;
    method: number;

    constructor({phone, otp, method}: { phone: string; otp: string; method: number }) {
        super();
        this.phone = phone;
        this.otp = otp;
        this.method = method;
    }
}

export class OTPVerifyEventSuccess extends OTPVerifyEvent {
    name = 'otp_verify_success';
}

export class ErrorEvent extends TrackingEvent {
    name = 'ERROR';

    message = '';
    code = '';
    stack = '';
    extra: JSONType = {};

    private constructor() {
        super();
    }

    static fromError(error: HandledError) {
        const event = new ErrorEvent();
        event.id = error.id;
        event.message = error.message;
        event.code = error.code;
        event.stack = error.fullStackTrace;
        event.extra = error.extra;

        return event;
    }
}

export class HTTPRequestLog extends TrackingEvent {
    name = 'HTTP_REQUEST';
    curl: string;
    request_id: string;

    constructor(id: string, curl: string, message: string) {
        super();
        this.curl = curl;
        this.message = message;
        this.request_id = id;
    }
}

export class HTTPResponseLog extends TrackingEvent {
    name = 'HTTP_RESPONSE';
    request_id: string;
    status?: number;
    data?: JSONType;

    constructor(id: string, reponseData: { status?: number; data?: JSONType }, message: string) {
        super();
        this.request_id = id;
        this.status = reponseData.status;
        this.data = reponseData.data;
        this.message = message;
    }
}

export class ShowProductOptionEvent extends TrackingEvent {
    name = 'show_product_option';
    product_id?: number;

    constructor(product_id?: number) {
        super();
        this.product_id = product_id;
    }
}

export class WritingFeedEvent extends TrackingEvent {
    name = 'writing_feed';

}

export class SharePickEvent extends TrackingEvent {
    name = 'share_pick';
    source?: 'facebook' | 'instagram';

    constructor(source?: 'facebook' | 'instagram') {
        super();
        this.source = source;
    }
}

export type {LogNavigationParams, ProductEventParams, CommerceEventParams};
