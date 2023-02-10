import { RoutePath, RoutePathSetting } from 'routes/RouteSetting';

interface ProductDetailProps {
  productPk: number;
  affiliateLink?: string;
}
export class ProductDetailParams implements ProductDetailProps {
  productPk: number;
  affiliateLink?: string
  constructor(productPk: number, affiliateLink?: string) {
    this.productPk = productPk;
    this.affiliateLink = affiliateLink
  }
}

export class ProductDetailRouteSetting extends RoutePathSetting<ProductDetailProps> {
  protected _path: RoutePath = RoutePath.productDetail;
  shouldBeAuth = false;
}

export type { ProductDetailProps };
