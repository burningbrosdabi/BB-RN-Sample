import { RoutePath, RoutePathSetting, RouteSetting } from 'routes/RouteSetting';

export class CheckoutRouteSetting extends RoutePathSetting<{ ids: number[] }> {
  shouldBeAuth = true;
  protected _path = RoutePath.checkout;
}

export class CheckoutDigestRouteSetting extends RouteSetting {
  shouldBeAuth = true;
  protected _path = RoutePath.checkoutDigest;
}

export class CheckoutPaymentRouteSetting extends RouteSetting {
  shouldBeAuth = true;
  protected _path = RoutePath.checkoutPayment;
}

export class CheckoutOverviewRouteSetting extends RouteSetting {
  shouldBeAuth = true;
  protected _path = RoutePath.checkoutOverview;
}

export class CheckoutArchiveRouteSetting extends RouteSetting {
  shouldBeAuth = true;
  protected _path = RoutePath.checkoutArchive;
}
