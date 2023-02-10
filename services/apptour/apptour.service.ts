import { Completer } from 'services/remote.config';
import { linkService } from 'services/link/link.service';
import { Job, JobType } from './type';
import AsyncStorage from '@react-native-community/async-storage';
import { storeKey } from 'utils/constant';
import { isNil } from 'lodash';
import inAppMessaging from '@react-native-firebase/in-app-messaging';
import { NavigationService } from 'services/navigation';

export class CodepushSyncJob extends Job {}

export class OnboardingJob extends Job {
  async shouldExecute(): Promise<boolean> {
    const passTutorial = (await AsyncStorage.getItem(storeKey.passTutorial)) != null;
    return Promise.resolve(!passTutorial);
  }
}

export class DynamicLinkJob extends Job {
  execute = async (): Promise<void> => {
    await linkService().checkInitialLink();
    this.complete();
    NavigationService.instance.onReady();
  };

  shouldStop(): Promise<boolean> {
    return Promise.resolve(linkService().hasInitialLink);
  }
}

export class FeatureDiscoveryJob extends Job {
  async shouldExecute(): Promise<boolean> {
    return (
      !linkService().hasInitialLink &&
      isNil(await AsyncStorage.getItem(storeKey.homeFeatureDiscovery))
    );
  }
}

export class InAppMessageJob extends Job {
  execute = async () => {
    inAppMessaging().triggerEvent('session_start');
    this.complete();
  };
}

export class TouristGuide {
  jobs: { [key in JobType]: Job };

  constructor() {
    this.jobs = {
      [JobType.codepush]: new CodepushSyncJob(),
      [JobType.onboarding]: new OnboardingJob(),
      [JobType.link]: new DynamicLinkJob(),
      [JobType.featureDiscovery]: new FeatureDiscoveryJob(),
      [JobType.inappMessage]: new InAppMessageJob(),
    };
  }

  async run() {
    for (const job of Object.values(this.jobs)) {
      await job.queue();
      const shouldStop = await job.shouldStop();
      if (shouldStop) break;
    }
  }
}
