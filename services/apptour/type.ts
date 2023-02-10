import { Completer } from 'services/remote.config';

export enum JobType {
  codepush,
  onboarding,
  link,
  featureDiscovery,
  inappMessage,
}

export abstract class Job {
  #completer = new Completer<undefined>();

  constructor() {}

  shouldStop(): Promise<boolean>{
    return Promise.resolve(false);
  };

  shouldExecute(): Promise<boolean> {
    return Promise.resolve(true);
  }

  execute?: () => Promise<void>;

  complete(fn?: () => void) {
    if (fn) fn();
    this.#completer.complete(undefined);
  }

  async queue() {
    const _shouldExecute = await this.shouldExecute();
    if (_shouldExecute) {
      if (this.execute) await this.execute();
      return this.#completer.promise;
    }
    this.#completer.complete(undefined);
  }
}
