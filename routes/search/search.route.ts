import { RoutePath, RoutePathSetting, RouteSetting } from 'routes';

export class SearchRouteSetting extends RoutePathSetting<{ query: string }> {
  protected _path = RoutePath.searchRecommend;
  shouldBeAuth = false;
}

export type SearchResultParams = {
  query: string;
  subCategory?: string;
  category?: string;
};

export class SearchResultRouteSetting extends RoutePathSetting<SearchResultParams> {
  protected _path = RoutePath.searchResult;
  shouldBeAuth = false;
}
