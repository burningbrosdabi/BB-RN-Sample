import { RoutePath, RoutePathSetting } from 'routes/RouteSetting';
import { CommentDTO } from 'services/api/magazine/comment.dtos';
import {CommentType} from "model";

interface CommentListScreenProps {
  type:CommentType,
  pk: number,
}

export class CommentListRouteSetting extends RoutePathSetting<CommentListScreenProps>  {
  shouldBeAuth = false;
  protected _path = RoutePath.commentListScreen;
}

export type { CommentListScreenProps };

