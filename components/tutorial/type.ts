import { ReactElement } from 'react';
import { Dimension } from 'recyclerlistview/dist/reactnative/core/dependencies/LayoutProvider';
import { RoutePath } from 'routes';

type Offset = { x: number; y: number };

type RenderBox = Offset & Dimension;

type ElementBuilder = (box: RenderBox) => JSX.Element;

interface IOverlayed {
  id: FeatureIds;
  children: JSX.Element;
  renderBox: RenderBox;
  description: string;
  backgroundColor: string;
  transparent?: boolean
}

interface TooltipOverlayed extends IOverlayed { }

interface IDescribedFeature extends IOverlayed {
  title?: string;
}

type FeatureIds =
  | 'productlist_filter'
  | 'category_filter'
  | 'feed_filter'
  | 'following_feed'
  | 'mix-match'
  | 'feed-tag'
  | 'feed-save'
  | 'user-follow'

type OverlayedComponent = ReactElement<IOverlayed>;

type OverlayedMap = {
  [key in FeatureIds]: () => JSX.Element;
};

export const featureScreenMap: { [key: string]: FeatureIds[] } = {
  [RoutePath.home]: ['feed_filter', 'following_feed'],
  [RoutePath.productCategoryFilter]: ['productlist_filter', 'category_filter'],
  [RoutePath.magazineList]: ['mix-match'],
  [RoutePath.feed]: ['feed-tag', 'feed-save'],
  [RoutePath.followSuggestion]: ['user-follow']
};

export type {
  Offset,
  RenderBox,
  ElementBuilder,
  IOverlayed,
  TooltipOverlayed,
  IDescribedFeature,
  FeatureIds,
  OverlayedMap,
  OverlayedComponent,
};
