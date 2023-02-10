import { HandledError } from 'error';

abstract class RouteSetting<I = undefined> {
  protected abstract _path: RoutePath;
  abstract shouldBeAuth: boolean;
  params?: I;

  get path(): string {
    return this._path;
  }

  guard(): boolean {
    return true;
  }

  constructor(params?: I) {
    this.params = params;
  }

  toURLPath(params: I): string {
    return `/${this.path}`;
  }
}

abstract class RoutePathSetting<T> extends RouteSetting<T> {
  constructor(params?: T) {
    super(params);
  }

  static fromURLPath<T>(
    this: new (params?: T) => RouteSetting<T>,
    urlString: string,
    classRef: new (...args: any[]) => T,
  ): RouteSetting<T> {
    try {
      const url = new URL(urlString);

      const pathname = new this().path;
      const keys = pathname.split('/') ?? [];
      const values = url.pathname.split('/')?.splice(1) ?? [];
      const classKeys = Object.keys(new classRef());

      if (keys.length > values.length) throw Error('url path not in the right format ');
      const param: T = new classRef();

      keys.forEach((value, index) => {
        const pattern = /^\:/g;
        if (!value.startsWith(':')) return;
        const key = value.replace(':', '');
        if (!classKeys.includes(key)) throw Error(`invalid params key: ${key} `);
        (param as any)[key] = parseToPrimitive(values[index]);
      });

      return new this(param);
    } catch (error) {
      throw new HandledError({
        error: error as Error,
        stack: `${this.constructor.name}.fromURLPath`,
      });
    }
  }

  toURLPath(params: T): string {
    const classKeys = Object.entries(params);
    let _path = this.path;
    classKeys.forEach(([key, value]) => {
      _path = _path.replace(`:${key}`, value);
    });
    return _path;
  }
}

// tslint:disable-next-line: no-any
function parseToPrimitive(value: string): any {
  try {
    return JSON.parse(value);
  } catch (e) {
    return `${value}`;
  }
}

export enum RoutePath {
  main = 'Main',
  home = 'Home',
  auth = 'Auth',
  magazineList = 'main/magazine',
  favoriteTab = 'main/favorite',

  onboardingAuth = 'auth/onboarding',
  onboardingSocial = 'auth/onboardingSocial',
  emailSignUp = 'auth/emailSignup',
  emailLogin = 'auth/emailLogin',
  socialAuth = 'auth/social',

  category = 'Category',
  store = 'Store',
  social = 'SocialFeed',
  favorite = 'Favorite',
  profile = 'Profile',

  productList = 'ProductList',
  productDetail = 'product/:productPk',
  productFilter = 'ProductFilter',
  productWebView = 'ProductWebView',
  productFeedbackDetail = 'ProductFeedbackDetail',
  productSubCategory = 'ProductSubCategory',
  storeList = 'StoreList',
  storeDetail = 'StoreDetail',
  setting = 'setting',
  profileUpdate = 'ProfileUpdate',
  search = 'Search',
  pickResult = 'PickResult',
  pickAB = 'PickAB',
  pickIn6 = 'PickIn6',
  pickExplanation = 'pick/explanation',

  pickAnalysis = 'PickAnalysis',
  pickRecommend = 'pick/recommend',
  pickHistory = 'pick/me',

  magazines = 'magazines',
  magazine = 'magazine/:id',

  sales = 'sales',
  saleDetail = 'sale/:id',
  saleProductList = 'sale/:id/product',

  notifications = 'notifications',
  productCategoryFilter = 'category/filter',
  favoriteWatchedProduct = 'favorite/product/watched/',
  UserProfile = 'profile/:pk',
  storeUpdateScreen = 'StoreUpdateScreen',
  ageSelectionScreen = 'AgeSelectionScreen',
  citySelectionScreen = 'CitySelectionScreen',
  createEditRecipientScreen = 'CreateEditRecipientScreen',
  recipientListScreen = 'recipients',
  voucherScreen = 'VoucherScreen',
  cart = 'cart',
  // new screeen
  orderHistoryScreen = 'OrderHistoryScreen',
  orders = 'orders/:status',
  orderDetailScreen = 'order/:id',
  orderDeliveryStatusScreen = 'order/:id/delivery',
  orderFeedbackScreen = 'OrderFeedbackScreen',
  ordersRefundExchangScreen = 'OrdersRefundExchangScreen',
  productFeedbackListScreen = 'ProductFeedbackListScreen',
  userFeedbackImageScreen = 'UserFeedbackImageScreen',
  userFeedbackListScreen = 'UserFeedbackListScreen',
  relatedProductScreen = 'RelatedProductScreen',
  commentListScreen = 'CommentListScreen',

  verifyPhone = 'verify/phone',
  verifyOTP = 'verify/otp',
  verifyBlocked = 'verify/blocked',
  checkout = 'checkout',
  checkoutDigest = 'checkout/digest',
  checkoutPayment = 'checkout/payment',
  checkoutOverview = 'checkout/overview',
  checkoutArchive = 'checkout/archive',

  follow = 'follow',
  feedbacks = 'feedbacks',
  collections = 'collections',
  collection = 'collection/:type/:id',

  feeds = 'feeds',
  feed = 'feed/:pk',
  feedCreate = 'feed/create',
  feedWriting = 'feed/write',
  feedFollows = 'feed/follows',
  kolFeedback = 'feed/kolfeedback',
  followingFeeds = 'feed/following',

  searchRecommend = 'search/recommend',
  searchResult = 'search/result',

  promotion = 'promotion',
  lorem = 'lorem/:boolProp/ipsum/:stringProp/barz/:numberProp',
  report = 'report',

  socialSetting = 'setting/social',
  notificationSetting = 'setting/notification',
  termsAndConditions = 'setting/termsandcontions',
  supporterSetting = 'setting/supperter',
  styleSetting = 'setting/style',

  heightAndWeight = 'auth/heightAndWeight',
  styleSelection = 'auth/styleSelection',
  pickSelection = 'auth/pickSelection',
  followSuggestion = 'auth/followSuggestion',

  placeDetail = 'place/detail'
}

export { RouteSetting, RoutePathSetting };
