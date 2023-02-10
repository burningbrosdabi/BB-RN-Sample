import { IRecipient } from 'model/recipient/recipient';
import { RoutePath, RoutePathSetting } from 'routes/RouteSetting';
import { Completer } from 'services/remote.config';

export interface RecipientScreenParams {
  onSelectItem?: (item: IRecipient) => void;
}
export class RecipientRouteSetting extends RoutePathSetting<RecipientScreenParams> {
  protected _path: RoutePath = RoutePath.recipientListScreen;
  shouldBeAuth = true;
}

export class CreateRecipientRouteSetting extends RoutePathSetting<{
  data?: IRecipient;
  isEditing: boolean;
  completer?: Completer<void>;
}> {
  protected _path: RoutePath = RoutePath.createEditRecipientScreen;
  shouldBeAuth = true;
}
