import analytics from '@react-native-firebase/analytics';
import * as Sentry from '@sentry/react-native';
import { HandledError } from 'error';
import { omit } from 'lodash';
import { nanoid } from 'nanoid/non-secure';
import appsFlyer from 'react-native-appsflyer';
import { configLoggerType, consoleTransport, logger } from 'react-native-logs';
import { unAwaited } from 'utils/helper/function.helper';
import { kibana } from './EKLog.service';
import {
  ErrorEvent,
  LogNavigationParams,
  NavigationEvent,
  OTPVerifyEvent,
  PhoneVerifyEvent,
  ProductEventAdapter,
  ProductEventParams,
  TrackingEvent,
  WillingToBuyEvent,
  CommerceEventParams,
  AddToCartEvent,
  BeginCheckoutEvent,
  PurchaseEvent,
  BackFromShopeeEvent,
  AddPaymentInfoEvent,
  ShowProductOptionEvent,
  WritingFeedEvent,
  SharePickEvent,
} from './tracking.event';

const defaultConfig: configLoggerType = {
  severity: 'debug',
  transport: consoleTransport,
  transportOptions: {
    color: 'ansi', // custom option that color consoleTransport logs
  },
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  async: true,
  printLevel: true,
  printDate: false,
  enabled: true,
};

export type AuthMethod = 'email' | 'apple' | 'facebook';

class EventLogger {
  #analytics = analytics();
  #sessionId = nanoid(21);
  #kibana = kibana();

  constructor() {
    this.resetUserId();
  }

  setUserId(id: number) {
    unAwaited(this.#analytics.setUserId(`${id}`));
  }

  resetUserId() {
    unAwaited(this.#analytics.setUserId('null'));
  }

  logEvent({
    trackingEvent,
    platform = { AF: true, Firebase: true, Sentry: false },
  }: {
    trackingEvent: TrackingEvent;
    platform?: { AF?: boolean; Firebase?: boolean; Sentry?: boolean };
  }) {
    try {
      const jsonEvent = trackingEvent.toJSON();
      jsonEvent.sessionId = this.#sessionId;

      if (platform.Firebase) {
        unAwaited<void>(this.#analytics.logEvent(trackingEvent.name, jsonEvent));
      }
      if (platform.AF) unAwaited(appsFlyer.logEvent(trackingEvent.name, jsonEvent));
      if (platform.Sentry) {
        this.logSentry(trackingEvent);
      }
      this.logKibana(trackingEvent);
    } catch (_) {
      /**/
    }
  }

  logKibana(event: TrackingEvent) {
    event.sessionId = this.#sessionId;
    this.#kibana.log(event.toJSON({ flatten: false }));
  }

  logSentry(trackingEvent: TrackingEvent) {
    const extra = omit(trackingEvent, ['id', 'name', 'userId']);
    Sentry.addBreadcrumb({
      type: 'debug',
      level: Sentry.Severity.Log,
      message: trackingEvent.name,
      data: extra,
    });
  }

  logNavigation({ from, to, params }: LogNavigationParams) {
    this.logEvent({ trackingEvent: new NavigationEvent(from, to, params) });
    unAwaited(
      analytics().logScreenView({
        screen_name: to,
        screen_class: to,
      }),
    );
  }

  logViewProduct(event: ProductEventParams) {
    const adapter = new ProductEventAdapter(event);
    unAwaited(this.#analytics.logViewItem(adapter.toFirebaseEvent()));
    unAwaited(appsFlyer.logEvent('af_content_view', adapter.toFirebaseEvent()));
  }

  logSearch(searchTerm: string) {
    unAwaited(this.#analytics.logSearch({ search_term: searchTerm }));
    unAwaited(appsFlyer.logEvent('af_search', { af_search_string: searchTerm }));
  }

  logLogin(method: AuthMethod) {
    unAwaited(this.#analytics.logLogin({ method }));
    unAwaited(appsFlyer.logEvent('af_login', {}));
  }

  logSignUp(method: AuthMethod) {
    unAwaited(this.#analytics.logSignUp({ method }));
    unAwaited(appsFlyer.logEvent('logSignUp', {}));
  }

  logAddToWishList(event: ProductEventParams) {
    const adapter = new ProductEventAdapter(event);
    unAwaited(this.#analytics.logAddToWishlist(adapter.toFirebaseEvent()));
    unAwaited(appsFlyer.logEvent('af_add_to_wishlist', adapter.toAppsFlyer()));
  }

  logWillingToBuy(event: ProductEventParams) {
    const _event = new WillingToBuyEvent(event);
    this.logEvent({
      trackingEvent: _event,
    });
  }

  // new event
  logAddToCart(event: CommerceEventParams) {
    const adapter = new AddToCartEvent(event);
    unAwaited(this.#analytics.logAddToCart(adapter.toFirebaseEvent()));
    unAwaited(appsFlyer.logEvent('af_add_to_cart', adapter.toFirebaseEvent()));
  }

  logBeginCheckout(event: CommerceEventParams) {
    const adapter = new BeginCheckoutEvent(event);
    unAwaited(this.#analytics.logBeginCheckout(adapter.toFirebaseEvent()));
    unAwaited(appsFlyer.logEvent('af_begin_check_out', adapter.toFirebaseEvent()));
  }

  logAddPaymentInfo(event: CommerceEventParams) {
    const adapter = new AddPaymentInfoEvent(event);
    unAwaited(this.#analytics.logAddPaymentInfo(adapter.toFirebaseEvent()));
    unAwaited(appsFlyer.logEvent('af_add_payment_info', adapter.toFirebaseEvent()));
  }

  logPurchase(event: CommerceEventParams) {
    const adapter = new PurchaseEvent(event);
    unAwaited(this.#analytics.logPurchase(adapter.toFirebaseEvent()));
    unAwaited(appsFlyer.logEvent('af_purchase', adapter.toFirebaseEvent()));
  }

  logBackFromShopee(event: LogNavigationParams) {
    const _event = new BackFromShopeeEvent(event);
    this.logEvent({
      trackingEvent: _event,
    });
  }

  logVerifyPhone(event: PhoneVerifyEvent) {
    this.logEvent({
      trackingEvent: event,
      platform: {
        Firebase: true,
        Sentry: true,
        AF: false,
      },
    });
  }

  logErrorGA(error: HandledError) {
    this.logEvent({
      trackingEvent: ErrorEvent.fromError(error),
      platform: {
        Firebase: true,
        Sentry: false,
        AF: false,
      },
    });
  }

  logVerifyOTP(event: OTPVerifyEvent) {
    this.logEvent({
      trackingEvent: event,
      platform: {
        Firebase: true,
        Sentry: true,
        AF: false,
      },
    });
  }

  logShowProductOption(event: ShowProductOptionEvent) {
    this.logEvent({
      trackingEvent: event,
    });
  }

  logWritingFeed() {
    this.logEvent({
      trackingEvent: new WritingFeedEvent(),
    });
  }

  logSharePick(source: 'facebook' | 'instagram') {
    this.logEvent({
      trackingEvent: new SharePickEvent(source),
    });
  }

  logTutorialComplete() {
    unAwaited(this.#analytics.logTutorialComplete());
  }

  logTutorialBegin() {
    unAwaited(this.#analytics.logTutorialBegin());
  }

  logFollowKOL(id: number) {
    unAwaited<void>(this.#analytics.logEvent('folow_kol', { id }));
  }

    logSaveProduct(id: number) {
    unAwaited<void>(this.#analytics.logEvent('save_product', { id }));
  }

  logLikePost(id: number) {
    unAwaited<void>(this.#analytics.logEvent('like_post', { id }));
  }
}

export class Logger extends EventLogger {
  #log = logger.createLogger(defaultConfig);
  private static _inst: Logger;

  static get instance(): Logger {
    if (!this._inst) this._inst = new this();

    return this._inst;
  }

  private constructor() {
    super();
  }

  logError(error: HandledError): void {
    //if (!__DEV__) return;
    // tslint:disable-next-line: no-unsafe-any
    this.#log.error(
      '❌❌❌',
      [
        '',
        `id:${error.id}`,
        `name: ${error.name}`,
        `from: ${error.fullStackTrace}`,
        `message: ${error.message}`,
        `code: ${error.code}`,
      ].join('\n'),
    );
  }

  // tslint:disable-next-line: no-any
  log(tag: string, log: any): void {
    // if (!__DEV__) return;
    // tslint:disable-next-line: no-unsafe-any
    this.#log.debug(`${tag} | `, log);
  }
}
