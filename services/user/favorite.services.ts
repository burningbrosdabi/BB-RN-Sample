import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CommentType, FeedbackInfo, ProductInfo, StoreInfo } from 'model';
import { favoriteFeedback, likeFeed } from 'utils/state/action-creators';
import { favoriteProduct, favoriteStore, likeComment } from '_api';
import { StoreCollectionItem } from 'model/collection';
import { Influencer } from 'model/influencer/influencer';
import { followInfluencer } from 'services/api/influencer/influencer.api';
import { Logger } from 'services/log';

export class FavoriteController<T extends { pk: number }> {
  stream: Subject<T>;
  repo: { [id: number]: boolean } = {};
  valueExtractor: (data: T) => boolean;
  next: (data: T) => Promise<void>;
  private subscription: Subscription | undefined;
  nextStream = new Subject();

  reset() {
    this.repo = {};
    this.subscription?.unsubscribe();
    this.subscription = undefined;
  }

  subscribe() {
    if (this.subscription) return;
    this.subscription = this.stream
      .pipe(
        debounceTime(500),
        // distinctUntilChanged((prev, curr) => {
        //     return prev.pk === curr.pk && this.valueExtractor(prev) === this.valueExtractor(curr);
        // })
      )
      .subscribe(value => {
        this.next(value).finally(() => this.nextStream.next());
      });
  }

  constructor({
    stream,
    valueExtractor,
    next,
  }: {
    stream: Subject<T>;
    next: (data: T) => Promise<void>;
    valueExtractor: (data: T) => boolean;
  }) {
    this.stream = stream;
    this.valueExtractor = valueExtractor;
    this.next = next;
    this.stream.subscribe(value => {
      this.repo[value.pk] = valueExtractor(value);
    });
  }
}

export type FeedCollectStreamData = { pk: number; is_collected: boolean };

export const feedCollectController = new FavoriteController<FeedCollectStreamData>({
  stream: new Subject<FeedCollectStreamData>(),
  valueExtractor: value => value.is_collected,
  next: data => {
    return favoriteFeedback({
      pk: data.pk,
      follow: data.is_collected,
    });
  },
});

export type FeedLikeStreamData = { pk: number; like: boolean };

class FeedLikeController extends FavoriteController<FeedLikeStreamData> {
  likeCounts: { [pk: number]: number } = {};
}

export const feedLikeController = new FeedLikeController({
  stream: new Subject<FeedLikeStreamData>(),
  valueExtractor: value => value.like,
  next: data => {
    if (data.like) {
      Logger.instance.logLikePost(data.pk);
    }
    return likeFeed({
      pk: data.pk,
      like: data.like,
    });
  },
});

export type ProductLikeStreamData = { pk: number; is_liked: boolean };

export const productLikeController = new FavoriteController<ProductLikeStreamData>({
  stream: new Subject<ProductLikeStreamData>(),
  valueExtractor: value => value.is_liked,
  next: data => {
    if (data.is_liked) {
      Logger.instance.logSaveProduct(data.pk);
    }
    return favoriteProduct({
      pk: data.pk,
      like: data.is_liked,
    });
  },
});

export type StoreFollowData = { pk: number; is_following: boolean };
export const storeLikeController = new FavoriteController<StoreFollowData>({
  stream: new Subject<StoreFollowData>(),
  valueExtractor: value => value.is_following,
  next: data => {
    return favoriteStore({ pk: data.pk, like: data.is_following });
  },
});

export type UserFollowStreamData = {
  pk: number;
  is_following: boolean;
};

export const userFollowController = new FavoriteController<UserFollowStreamData>({
  stream: new Subject<UserFollowStreamData>(),
  valueExtractor: value => value.is_following,
  next: data => {
    if (data.is_following) {
      Logger.instance.logFollowKOL(data.pk);
    }
    return followInfluencer(data.pk, data.is_following);
  },
});

export type CommentLikeStreamData = { pk: number; is_liked: boolean };

class CommentLikeController extends FavoriteController<CommentLikeStreamData> {
  likeCounts: { [pk: number]: number } = {};
}

const feedCommentLikeController = new CommentLikeController({
  stream: new Subject<CommentLikeStreamData>(),
  valueExtractor: value => value.is_liked,
  next: data => {
    return likeComment(data.pk, data.is_liked, CommentType.feed);
  },
});

const magazineCommentLikeController = new CommentLikeController({
  stream: new Subject<CommentLikeStreamData>(),
  valueExtractor: value => value.is_liked,
  next: data => {
    return likeComment(data.pk, data.is_liked, CommentType.magazine);
  },
});

export const commentLikeController = {
  [CommentType.feed]: feedCommentLikeController,
  [CommentType.magazine]: magazineCommentLikeController,
};
