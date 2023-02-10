import { createContext, useContext } from 'react';
import { CommentItemModel } from 'model';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

type ICommentReplyContext = {
  sourceCommentStream: BehaviorSubject<CommentItemModel | undefined>;
  replyStream: Subject<CommentItemModel>;
};

export const CommentReplyContext = createContext<ICommentReplyContext>({
  sourceCommentStream: new BehaviorSubject<CommentItemModel | undefined>(undefined),
  replyStream: new Subject<CommentItemModel>(),
});

type ICommentContext = {
  commentStream?: Subject<CommentItemModel>;
};

export const CommentContext = createContext<ICommentContext>({});
