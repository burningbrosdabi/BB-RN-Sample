import { createContext } from 'react';
import type { FeatureIds, OverlayedComponent, OverlayedMap } from './type';

export interface IFeatureDiscoveryContext {
  activeId?: FeatureIds;
  overlayeds: OverlayedMap;
  steps: FeatureIds[];
  setActiveId: (value: FeatureIds) => void;
  addOverlay: (id: FeatureIds, value: OverlayedComponent) => void;
  dismiss: () => void;
  completeAt: (stepId: FeatureIds) => void;
  discover: (id: string) => Promise<void>;
}
export const FeatureDiscoveryContext = createContext<IFeatureDiscoveryContext>({
  overlayeds: {} as OverlayedMap,
  activeId: undefined,
  steps: [],
  addOverlay: (id: FeatureIds, value: OverlayedComponent) => {},
  setActiveId: (value: FeatureIds) => {},
  dismiss: () => {},
  completeAt: (stepId: FeatureIds) => {},
  discover: async (id: string) => {},
});
