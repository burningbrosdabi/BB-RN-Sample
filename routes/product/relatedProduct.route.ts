import { RoutePath, RoutePathSetting } from 'routes/RouteSetting';
import { ProductListDTO, ProductListFilterInterface } from 'services/api/product/product.dtos';

interface RelatedProductProps {
  fetchFunc?: (params: ProductListFilterInterface) => Promise<ProductListDTO>,
}

export class RelatedProductRouteSetting extends RoutePathSetting<RelatedProductProps>  {
  shouldBeAuth = false;
  protected _path = RoutePath.relatedProductScreen;
}

export type { RelatedProductProps };
