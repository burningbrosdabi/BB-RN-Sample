import { RoutePath, RoutePathSetting, RouteSetting } from 'routes/RouteSetting';

// interface ProductCategoryFilterProps {
//   category?: string;
//   subCategory?: string;
// // }
// export class ProductCategoryFilterParams implements ProductCategoryFilterProps {
//   category = 'all';
//   subCategory = 'all';

//   constructor(category?: string, subCategory?: string) {
//     this.category = category ?? 'all';
//     this.subCategory = subCategory ?? 'all';
//   }
// }

export interface IProductCategoryFilterParams
  {
    subCategory: string;
    category: string;
  
}
export class ProductCategoryFilterRouteSetting extends RoutePathSetting<IProductCategoryFilterParams> {
  protected _path: RoutePath = RoutePath.productCategoryFilter;
  shouldBeAuth = false;
}

// export type { ProductCategoryFilterProps };
