import { createContext } from 'react';
import { Job, JobType } from 'services/apptour/type';
import {
  CodepushSyncJob,
  DynamicLinkJob,
  FeatureDiscoveryJob,
  InAppMessageJob,
  OnboardingJob,
} from 'services/apptour/apptour.service';

type IAppTourContext = {
  jobs: { [key in JobType]: Job };
};

export const AppTourContext = createContext<IAppTourContext>({
  jobs: {
    [JobType.codepush]: new CodepushSyncJob(),
    [JobType.onboarding]: new OnboardingJob(),
    [JobType.link]: new DynamicLinkJob(),
    [JobType.featureDiscovery]: new FeatureDiscoveryJob(),
    [JobType.inappMessage]: new InAppMessageJob(),
  },
});
