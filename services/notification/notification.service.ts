import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { HandledError } from 'error';
import { Platform } from 'react-native';
import { BehaviorSubject } from 'rxjs';
import { Http } from 'services/http/http.service';
import { linkService } from 'services/link/link.service';
import { Logger } from 'services/log';
import { unAwaited } from 'utils/helper';
import { NotificationResponse, NotificationResponseInterface } from './notification.dtos';
import { asyncGuard } from '_helper';

type RemoteMessage = FirebaseMessagingTypes.RemoteMessage;

class NotificationRequest {
  static async getNotifications(
    url?: string,
    options?: { limit: number },
  ): Promise<NotificationResponse> {
    try {
      const nextUrl = url;
      const response = await Http.instance.get<NotificationResponseInterface>(
        nextUrl ?? '/notification/',
        options
          ? {
              params: { limit: options.limit },
            }
          : undefined,
      );
      const data = new NotificationResponse().fromJSON(response.data);

      return data;
    } catch (error) {
      const exeption = new HandledError({
        error: error as Error,
        stack: 'NotificationRequest.getNotifications',
      });
      throw exeption;
    }
  }
}

export class NotificationService extends NotificationRequest {
  private static _instance: NotificationService;
  hasNotificationObserver = new BehaviorSubject<boolean>(false);

  static get instance(): NotificationService {
    if (!this._instance) this._instance = new this();

    return this._instance;
  }

  private constructor() {
    super();
    unAwaited(this.setBage(0));

    messaging()
      .getToken()
      .then(token => {
        Logger.instance.log('FCM_TOKEN', token);
      })
      .catch();
  }

  handleInitialMessage() {
    messaging()
      .getInitialNotification()
      .then(message => onMessage(message, true))
      .catch();
  }

  async hasPermission(): Promise<boolean> {
    try {
      const status = await messaging().hasPermission();

      return status === messaging.AuthorizationStatus.AUTHORIZED;
    } catch (error) {
      new HandledError({
        error: error as Error,
        stack: 'NotificationSerivce.hasPermission',
      }).log(true);

      return false;
    }
  }

  async setBage(number?: number) {
    if (Platform.OS === 'android') return;
    if (number !== undefined) {
      PushNotificationIOS.setApplicationIconBadgeNumber(number);

      return;
    }
    // autoincrement the badge number
    await new Promise<void>((resolve, _) => {
      PushNotificationIOS.getApplicationIconBadgeNumber(number => {
        const badge = !number ? 0 : number;
        PushNotificationIOS.setApplicationIconBadgeNumber(badge + 1);
        resolve();
      });
    });
  }

  resetBadge() {
    return this.setBage(0);
  }

  extractRoute(message: RemoteMessage): string | undefined {
    return message?.data?.route;
  }

  async checkUnread() {
    try {
      const { unread_count } = await NotificationService.getNotifications(undefined, { limit: 1 });
      if (unread_count > 0) this.hasNotificationObserver.next(true);
    } catch (e) {}
  }

  async markAsRead(id?: number | string) {
    try {
      if (!id) {
        await Http.instance.get(`/notification/all-read/`);
      } else {
        await Http.instance.put(`/notification/${id}/update/`, {
          is_read: true,
        });
      }
      this.checkUnread();
    } catch (error) {
      /**/
    }
  }
}

const onMessage = async (
  message: RemoteMessage | null,
  isInitialNotification?: boolean,
): Promise<void> => {
  try {
    NotificationService.instance.checkUnread();

    asyncGuard(async () => {
      if (!message?.data?.pk) return;
      NotificationService.instance.markAsRead(message?.data?.pk);
    });

    const route = message?.data?.route;
    if (!route) return;
    linkService().queue(`apps://dabi${route}`);
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'NotificationService.onMessage',
    });
    exception.log(true);
  }
};

// for now we do nothing when app is on foreground
messaging().onMessage(message => {
  NotificationService.instance.checkUnread();
});

messaging().onNotificationOpenedApp(onMessage);
messaging().setBackgroundMessageHandler(message => {
  NotificationService.instance.checkUnread();

  return NotificationService.instance.setBage();
});
