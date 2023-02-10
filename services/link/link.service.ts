import HandledError from 'error/error';
import { isEmpty, isNil } from 'lodash';
import { Linking } from 'react-native';
import {
  MagazineDetailParams,
  MagazineDetailRouteSetting,
  MagazinesScreenRouteSettings,
} from 'routes/magazine/magazine.route';
import {
  OrderDeliveryParams,
  OrderDeliveryRouteSetting,
  OrderDetailParams,
  OrderDetailRouteSetting,
} from 'routes/order/order.route';
import { ProductDetailParams, ProductDetailRouteSetting } from 'routes/product/productDetail.route';
import { RoutePath, RouteSetting } from 'routes/RouteSetting';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  FeedDetailParams,
  FeedDetailRouteSetting,
  FeedsScreenRoutSetting,
  FollowingFeedRoutSetting,
} from 'routes/feed/feed.route';
import { debounceTime } from 'rxjs/operators';
import { PromotionRouteSetting } from 'routes/promotion/promotion.route';
import {
  CollectionsScreenRouteSetting,
  LandingParams,
  LandingRouteSetting,
} from 'routes/collection/collection.route';
import { PickIn6ExplanationRouteSetting } from 'routes/pick/pick.route';
import dynamicLinks, { FirebaseDynamicLinksTypes } from '@react-native-firebase/dynamic-links';
import { UserProfileParams, UserProfileRouteSetting } from 'routes';
import {
  SaleDetailParams,
  SaleDetailRouteSetting,
  SalesRouteSetting,
} from 'routes/sale/sale.route';

type DynamicLinkSocialParameters = FirebaseDynamicLinksTypes.DynamicLinkSocialParameters;

class LinkService {
  static #instance: LinkService;

  static get instance(): LinkService {
    if (!this.#instance) {
      this.#instance = new this();
    }

    return this.#instance;
  }

  private constructor() {
    Linking.getInitialURL()
      .then(_url => {
        if (!_url) return;
        linkService().queue(_url);
      })
      .catch(err => {
        // tslint:disable-next-line: no-console
        console.warn('Deeplinking error', err);
      });

    Linking.addEventListener('url', _url => {
      if (!_url) return;
      linkService().queue(_url.url);
    });
  }

  handleDeeplink = ({ url }: { url: string }) => {
    linkService().queue(url);
  };

  #linkObservable = new BehaviorSubject<RouteSetting | null>(null);
  #routeSubscription?: Subscription;
  #dynamicLinkSubscription?: () => void;

  get hasInitialLink() {
    return !isNil(this.#linkObservable.value);
  }

  queue(link: string) {
    const routeSetting = this.getRouteSetting(link);
    if (!routeSetting) return;
    this.#linkObservable.next(routeSetting);
  }

  addRouteListener(callback: (route: RouteSetting | null) => void) {
    if (this.#routeSubscription) return;
    this.#routeSubscription = this.#linkObservable.pipe(debounceTime(200)).subscribe(callback);
  }

  dispose() {
    this.#linkObservable.next(null);
    if (this.#dynamicLinkSubscription) this.#dynamicLinkSubscription();
  }

  private isMatchPathPattern(url: URL, route: RoutePath): boolean {
    const values = url.pathname.split('/').filter(value => !isEmpty(value));
    const urlPath = route.split('/');

    for (let i = 0; i < urlPath.length; i++) {
      const path = urlPath[i];

      if (/^\:/g.test(path)) continue;

      if (path !== values[i]) return false;
    }

    return true;
  }

  getRouteSetting(urlString: string): RouteSetting<any> | null {
    try {
      const url = new URL(urlString);
      const paths = url?.pathname ?? '';

      if (isEmpty(paths)) return null;

      if (this.isMatchPathPattern(url, RoutePath.productDetail)) {
        return ProductDetailRouteSetting.fromURLPath(urlString, ProductDetailParams);
      } else if (this.isMatchPathPattern(url, RoutePath.magazine)) {
        return MagazineDetailRouteSetting.fromURLPath(urlString, MagazineDetailParams);
      } else if (this.isMatchPathPattern(url, RoutePath.orderDetailScreen)) {
        if (this.isMatchPathPattern(url, RoutePath.orderDeliveryStatusScreen)) {
          return OrderDeliveryRouteSetting.fromURLPath(urlString, OrderDeliveryParams);
        }
        return OrderDetailRouteSetting.fromURLPath(urlString, OrderDetailParams);
      } else if (this.isMatchPathPattern(url, RoutePath.feed)) {
        if (this.isMatchPathPattern(url, RoutePath.followingFeeds)) {
          return new FollowingFeedRoutSetting();
        }
        return FeedDetailRouteSetting.fromURLPath(urlString, FeedDetailParams);
      } else if (this.isMatchPathPattern(url, RoutePath.promotion)) {
        return new PromotionRouteSetting();
      } else if (this.isMatchPathPattern(url, RoutePath.collections)) {
        return new CollectionsScreenRouteSetting();
      } else if (this.isMatchPathPattern(url, RoutePath.pickExplanation)) {
        return new PickIn6ExplanationRouteSetting();
      } else if (this.isMatchPathPattern(url, RoutePath.magazines)) {
        return new MagazinesScreenRouteSettings();
      } else if (this.isMatchPathPattern(url, RoutePath.feeds)) {
        return new FeedsScreenRoutSetting();
      } else if (this.isMatchPathPattern(url, RoutePath.collection)) {
        return LandingRouteSetting.fromURLPath(urlString, LandingParams);
      } else if (this.isMatchPathPattern(url, RoutePath.UserProfile)) {
        return UserProfileRouteSetting.fromURLPath(urlString, UserProfileParams);
      } else if (this.isMatchPathPattern(url, RoutePath.saleDetail)) {
        return SaleDetailRouteSetting.fromURLPath(urlString, SaleDetailParams);
      } else if (this.isMatchPathPattern(url, RoutePath.sales)) {
        return new SalesRouteSetting();
      }
      return null;
    } catch (error) {
      throw new HandledError({
        error: error as Error,
        stack: `${this.constructor.name}.handleDeeplink`,
      }).log(true);
    }
  }

  async buildLink({
    social,
    path,
  }: {
    path: string;
    social: DynamicLinkSocialParameters;
  }): Promise<string> {
    return dynamicLinks().buildShortLink({
      social,
      link: `https://dabi.com.vn/${path}`,
      domainUriPrefix: 'https://dabi.page.link',
      android: {
        packageName: 'com.dabi.dabi',
        //  minimumVersion: '2.5.9'
      },
      ios: {
        bundleId: 'com.dabi.dabi',
        appStoreId: '1476368502',
        // minimumVersion: '2.5.9'
      },
    });
  }

  async checkInitialLink() {
    const link = await dynamicLinks().getInitialLink();
    if (isNil(link?.url)) return;
    this.queue(link?.url ?? '');
  }

  onLink() {
    this.#dynamicLinkSubscription = dynamicLinks().onLink(
      (link: FirebaseDynamicLinksTypes.DynamicLink) => {
        // const url = new URL(link.url);
        if (isNil(link?.url)) return;
        this.queue(link?.url ?? '');
      },
    );
  }
}

export const linkService = (): LinkService => {
  return LinkService.instance;
};
