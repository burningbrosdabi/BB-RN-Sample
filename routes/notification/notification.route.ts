import { RoutePath, RouteSetting } from 'routes/RouteSetting';

export class NotificationRouteSetting extends RouteSetting {
  protected _path = RoutePath.notifications;
  shouldBeAuth = true;
  
}
