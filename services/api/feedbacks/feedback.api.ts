import { FeedErrorCode, HandledError } from 'error';
import { isNil } from 'lodash';
import { CommentItemModel, CommentType, FeedbackInfo, JSONType } from 'model';
import { Influencer, InfluencerInteface } from 'model/influencer/influencer';
import { Asset } from 'react-native-image-picker';
import { http, Http } from 'services/http/http.service';
import { PaginationResponse } from 'services/http/type';
import { FetchPreset } from '../api_helper';
import { apiUrl } from '../api_variables';
import { CommentResponse } from '../magazine/comment.dtos';
import { store } from 'utils/state';
import moment from 'moment';
import { Subject } from 'rxjs';
import { getUserInfo } from 'services/api';
import { commentLikeController } from 'services/user';
import { hashtagRegex, sleep } from '_helper';

export enum FeedbackOrdering {
  recent = '-created_at',
  popular = 'popular',

}

export interface FeedListFilterInterface {
  offset?: number;
  isFollowing?: boolean;
  styleFilter?: string;
  weightFilter?: string;
  heightFilter?: string;
  personalization?: boolean;
}


export const getUnReadFollowingFeed = async (nextUrl?: string,
  options?: {
  }
): Promise<PaginationResponse<FeedbackInfo>> => {
  try {
    const { data: { next, count, previous, results },
    } = await http().get<PaginationResponse<JSONType>>('v1/feedbacks/?is_following=True&is_unread=True', {})

    const data = new FeedbackInfo().fromListJSON(results) as unknown as FeedbackInfo[];
    return { next, count, previous, results: data };
  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'api.feedback.getFeedbackListV2',
    });
  }
}
export const getFeedbackListV2 = async (
  nextUrl?: string,
  options?: {
    offset?: number;
    ordering?: FeedbackOrdering;
    is_feedback?: boolean;
    is_promotion?: boolean;
    is_ended?: boolean;
    limit?: number;
    hashtags?: string;
    model_height_min?: number;
    model_height_max?: number;
    model_weight_min?: number;
    model_weight_max?: number;
    styleFilter?: string;
    weightFilter?: string;
    heightFilter?: string;
    isFollowing?: boolean;
    isValid?: boolean;
    personalization?: boolean;
    location_id?: number;
  },
): Promise<PaginationResponse<FeedbackInfo>> => {
  try {
    const { offset = 0, ordering, is_feedback, location_id, is_promotion, is_ended, limit = 20, hashtags, styleFilter, weightFilter, heightFilter, isFollowing, isValid, personalization } = options ?? {};
    const url = nextUrl?.replace('http:', 'https:');
    console.log(weightFilter?.split(','))
    const {
      data: { next, count, previous, results },
    } = await http().get<PaginationResponse<JSONType>>(url ?? `v1/feedbacks/`, {
      params: isNil(nextUrl)
        ? {
          limit,
          offset,
          ...(styleFilter ? { user_style: styleFilter } : undefined),
          ...(is_feedback ? { is_feedback: true } : undefined),
          ...(is_promotion ? { is_promotion: true } : undefined),
          ...(ordering ? { 'order-by': ordering } : undefined),
          ...(!isNil(is_ended) ? { is_promotion_ended: is_ended } : undefined),
          ...(hashtags ? { 'hashtags': hashtags } : undefined),
          ...(weightFilter ? {
            user__weight_min: weightFilter?.split(',')[0] != 'undefined' ? weightFilter?.split(',')[0] : undefined,
            user__weight_max: weightFilter?.split(',')[1] != 'undefined' ? weightFilter?.split(',')[1] : undefined
          } : undefined),
          ...(heightFilter ? {
            user__height_min: heightFilter?.split(',')[0] != 'undefined' ? heightFilter?.split(',')[0] : undefined,
            user__height_max: heightFilter?.split(',')[1] != 'undefined' ? heightFilter?.split(',')[1] : undefined
          } : undefined),
          ...(isFollowing ? { is_following: true } : undefined),
          ...(isValid ? { is_valid: true } : undefined),
          ...(personalization ? { personalization: true } : undefined),
          ...(location_id ? { location_id } : undefined),

        }
        : undefined,
    });

    const data = new FeedbackInfo().fromListJSON(results) as unknown as FeedbackInfo[];
    return { next, count, previous, results: data };
  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'api.feedback.getFeedbackListV2',
    });
  }
};



export const getFeedbackPersonalizedList = async (
  nextUrl?: string,
): Promise<PaginationResponse<FeedbackInfo>> => {

  try {
    const url = nextUrl?.replace('http:', 'https:');
    const {
      data: { next, count, previous, results },
    } = await http().get<PaginationResponse<JSONType>>(url ?? `v1/feedbacks/personalized/`, {});

    const data = new FeedbackInfo().fromListJSON(results) as unknown as FeedbackInfo[];
    return { next, count, previous, results: data };
  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'api.feedback.getFeedbackPersonalizedList',
    });
  }
};


export const getFeedDetail = async (pk: number) => {
  try {
    const { data } = await http().get(`v1/feedbacks/${pk}/`);

    return new FeedbackInfo().fromJSON(data);
  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'feedback.api.getFeedDetail',
    });
  }
};

export const getFeedbackListByInfluencer = async ({ token, offset = 0, influencerPk }) => {
  const requestURL = apiUrl + 'influencer/' + influencerPk + '/feedback/?limit=20&offset=' + offset;
  console.log(requestURL);

  const responseJson = await FetchPreset({ requestURL, token });
  return { totalCount: responseJson.count, data: responseJson.results };
};

export const getKolProfileDetail = async ({ influencerPk }: { influencerPk: number }) => {
  try {
    const requestURL = `v1/users/${influencerPk}/`;
    const response = await http().get<InfluencerInteface>(requestURL);
    const data = new Influencer().fromJSON(response.data);

    return data;
  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'feedback.api.getKolProfileDetail',
    });
  }
};

export const getKolProfileFeedbackList = async ({
  nextUrl,
  pk,
  limit,
  offset
}: {
  pk: string;
  nextUrl?: string;
  limit?: number;
  offset?: number;
}) => {
  const url = nextUrl?.replace('http:', 'https:');

  const {
    data: { next, count, previous, results },
  } = await http().get<PaginationResponse<JSONType>>(url ?? `v1/influencers/${pk}/feedbacks/`, {
    params: isNil(nextUrl)
      ? {
        limit: limit ?? 20,
        offset: offset ?? 0,
        "order-by": FeedbackOrdering.recent
      }
      : undefined,
  });

  const data = new FeedbackInfo().fromListJSON(results) as unknown as FeedbackInfo[];

  return { next, count, previous, results: data };
};

export const getFeedbackComments = async (params: {
  url?: string;
  pk: number;
  limit?: number;
  type?: CommentType;
}): Promise<PaginationResponse<CommentItemModel>> => {
  try {
    const { limit = 20, type = CommentType.feed, pk, url } = params;
    const _url =
      url ??
      (type === CommentType.feed
        ? `v1/influencers/feedbacks/${pk}/comments/`
        : `v1/magazines/${pk}/comments/`);

    const {
      data: { count, next, results },
    } = await http().get<CommentResponse>(_url, {
      ...(isNil(url) && { params: { limit, offset: 0 } }),
    });
    const comments = new CommentItemModel().fromListJSON(results);

    return {
      next,
      count,
      previous: null,
      results: comments,
    };
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'feedback.api.getFeedbackComments',
    });
    throw exception;
  }
};

export const createCommentApi = async (
  pk: number,
  params: {
    sourceComment?: number;
    message: string;
    images?: Asset[];
    reply?: number;
  },
  type: CommentType,
) => {
  try {
    const url =
      type === CommentType.magazine
        ? `v1/magazines/${pk}/comments/`
        : `v1/influencers/feedbacks/${pk}/comments/`;
    const formData = new FormData();
    formData.append('text', params.message);
    (params.images || []).forEach((element: Asset, index: number) => {
      formData.append(`image_${index + 1}`, element.base64);
    });
    if (params?.sourceComment) {
      formData.append('parent', params.sourceComment);
    }
    if (params?.reply) {
      formData.append('reply_to', params.reply);
    }

    const response = await Http.instance.post(url, formData);

    return new CommentItemModel().fromJSON(response.data);
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'feedback.api.createCommentApi',
    });
    throw exception;
  }
};

const uploadFeedImage = async ({ }) => {
  try {
  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'feedback.api.uploadFeedImage',
    });
  }
};

const uploadFeedImages = async ({ pk, images }: { pk: number; images: Asset[] }) => {
  try {
    const promises = images.map((image, index) => {
      const formData = new FormData();
      formData.append('source', image.base64);
      formData.append('ordering', index);
      return http().post(`v1/feedbacks/${pk}/images/`, formData);
    });
    await Promise.all(promises);
  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'feedback.api.uploadFeedImages',
      code: FeedErrorCode.FAILED_TO_UPLOAD_IMAGE,
    });
  }
};

const extractHashtag = (text: string): string[] => {
  const hashtags = text.match(hashtagRegex) ?? [];
  if (hashtags.length > 0) {
    return hashtags.map(value => value.toLowerCase().replace('#', ''));
  }
  return [];
};

export const uploadFeed = async ({ text, images }: { text: string; images: Asset[] }) => {
  try {
    if (images.length <= 0) throw new Error('Cannot create feed without image');
    const user = store.getState().user.userInfo;
    const formData = new FormData();
    formData.append('user', user.id);
    formData.append('content_type', user.user_type === 'NORMAL' ? 1 : 2);
    formData.append('post_description', text);
    const dateTime = moment().format('YYYY-MM-DDTHH:mm');
    formData.append('post_taken_at_timestamp', dateTime);

    const hashtags = extractHashtag(text).join(',');

    if (hashtags.length > 0) {
      formData.append('hashtags', hashtags);
    }

    const { data } = await http().post<{ pk: number }>('/v1/feedbacks/', formData);
    const { pk } = data;
    await uploadFeedImages({ pk, images });
    feedStream.next();
    return pk;
  } catch (e) {
    if (e instanceof HandledError && e.code === FeedErrorCode.FAILED_TO_UPLOAD_IMAGE) {
      throw e;
    }
    throw new HandledError({
      error: e as Error,
      stack: 'feedback.api.uploadFeed',
      code: FeedErrorCode.FAILED_TO_CREATE_FEED,
    });
  }
};

export const updateFeed = async ({ pk, text }: { pk: number; text: string }) => {
  try {
    const hashtags = extractHashtag(text);
    await http().patch(`v1/feedbacks/${pk}/`, {
      post_description: text,
      hashtags,
    });
  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'feedback.api.updateFeed',
      code: FeedErrorCode.FAILED_TO_UPDATE_FEED,
    });
  }
};

export const deleteFeed = async (pk: number) => {
  try {
    await http().delete(`v1/feedbacks/${pk}/`);
    feedStream.next();
  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'feedback.api.updateFeed',
      code: FeedErrorCode.FAILED_TO_DELETE_FEED,
    });
  }
};

export const feedStream = new Subject();
feedStream.subscribe(() => {
  getUserInfo();
});

type FeedUpdateData = { pk: number; description: string };

class FeedUpdateHistory {
  _repo: { [id: number]: string } = {};

  getFeedDescription(pk: number) {
    return this._repo[pk];
  }

  stream = new Subject<FeedUpdateData>();

  constructor() {
    this.stream.subscribe(({ pk, description }) => {
      console.log('constructor', { pk, description });
      this._repo[pk] = description;
    });
  }
}

export const likeComment = (pk: number, is_liked: boolean, type: CommentType): Promise<void> => {
  try {
    const prefix = type === CommentType.feed ? 'v1/post_comments' : 'v1/magazines_comments';
    if (is_liked) {
      return http().post(`${prefix}/${pk}/react/`);
    } else {
      return http().post(`${prefix}/${pk}/remove_react/`);
    }
  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'feedback.api.likeComment',
    });
  }
};

export const _getLikedComments = async (type: CommentType): Promise<void> => {
  try {
    const {
      data: { results },
    } = await http().get<{
      results: { pk: number }[];
    }>(
      `v1/${type === CommentType.feed ? 'post_comments' : 'magazines_comments'}/reacted_comments/`,
    );
    results.forEach(({ pk }) => {
      commentLikeController[type].stream.next({ pk, is_liked: true });
    });
    commentLikeController[type].subscribe();
  } catch (e) {
    /***/
  }
};

export const getLikedComments = async (): Promise<void> => {
  await Promise.all([_getLikedComments(CommentType.feed), _getLikedComments(CommentType.magazine)]);
};

export const searchHashtag = async (
  hashtag: string,
  nextUrl?: string,
): Promise<PaginationResponse<string>> => {
  try {
    const {
      data: { results, count, next },
    } = await http().get<{ count: number; next?: string; results: { text: string }[] }>(
      nextUrl ?? `v1/influencers/feedbacks/hashtags/?q=${hashtag}`,
    );
    const data = results.map<string>(value => value.text);

    return {
      previous: null,
      results: data,
      count,
      next,
    };
  } catch (e) {
    throw e;
  }
};

export const feedUpdateHistory = new FeedUpdateHistory();

export const feedUpdateStream = new Subject<FeedUpdateData>();


export const createAffiliateLog = async ({ pk }: { pk: number; }) => {
  try {
    await http().get(`v1/feed_relate_products/${pk}/logs/`);
  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'feedback.api.createAffiliateLog',
    });
  }
};

export const createFeedDetailLog = async ({ pk }: { pk: number; }) => {
  try {
    await http().get(`v1/feedbacks/${pk}/logs/`);
  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'feedback.api.createFeedDetailLog',
    });
  }
};

export const createUserDetailLog = async ({ pk }: { pk: number; }) => {
  try {
    await http().get(`v1/influencers/${pk}/logs/`);
  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'feedback.api.createUserDetailLog',
    });
  }
};