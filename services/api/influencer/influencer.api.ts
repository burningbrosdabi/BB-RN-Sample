import HandledError from 'error/error';
import { Influencer } from 'model/influencer/influencer';
import { http } from 'services/http/http.service';
import { PaginationResponse } from 'services/http/type';
import { userFollowController } from 'services/user';

export const getInfluencerFollowingList = async (
  next?: string,
  pk: number,
): Promise<PaginationResponse<Influencer>> => {
  try {
    const response = await http().get<PaginationResponse<Influencer>>(
      next ?? `v1/influencers/${pk}/following/`,
    );

    return response.data;
  } catch (e) {
    const error = new HandledError({
      error: e as Error,
      stack: 'influencer.api.getInfluencerFollowingList',
    });
    throw error;
  }
};

export const getInfluencerFollowerList = async (
  next?: string,
  pk: number,
): Promise<PaginationResponse<Influencer>> => {
  try {
    const response = await http().get<PaginationResponse<Influencer>>(
      next ?? `v1/influencers/${pk}/followers/`,
    );

    return response.data;
  } catch (e) {
    const error = new HandledError({
      error: e as Error,
      stack: 'influencer.api.getInfluencerFollowerList',
    });
    throw error;
  }
};

export const getFollowingList = async (next?: string): Promise<PaginationResponse<Influencer>> => {
  try {
    const response = await http().get<PaginationResponse<Influencer>>(next ?? 'v1/users/follow/');

    return response.data;
  } catch (e) {
    const error = new HandledError({
      error: e as Error,
      stack: 'influencer.api.getFollowingList',
    });
    throw error;
  }
};

export const getFollowerList = async (next?: string): Promise<PaginationResponse<Influencer>> => {
  try {
    const response = await http().get<PaginationResponse<Influencer>>(
      next ?? 'v1/users/followers/',
    );

    return response.data;
  } catch (e) {
    const error = new HandledError({
      error: e as Error,
      stack: 'influencer.api.getFollowerList',
    });
    throw error;
  }
};

export const followInfluencer = async (pk: number, follow: boolean) => {
  try {
    if (follow) {
      await http().post(`v1/users/follow/`, { user_id: pk });
    } else {
      await http().delete(`v1/users/follow/${pk}/`);
    }
  } catch (e) {
    const error = new HandledError({
      error: e as Error,
      stack: 'influencer.api.followInfluencer',
    });
    throw error;
  }
};

export const getUserFollowingList = async (
  limit?: number,
): Promise<{ data: number[]; count: number }> => {
  try {
    let lim = limit ?? 20;

    if (!limit) {
      const response = await getUserFollowingList(1);
      if (response.count <= 0) return response;
      lim = response.count;
    }

    const {
      data: { results, count },
    } = await http().get<PaginationResponse<Influencer>>(`v1/users/follow/?limit=${lim}&field=pk`);

    const data = results.map(e => e.pk).filter(e => !!e);

    return {
      data,
      count,
    };
  } catch (e) {
    const error = new HandledError({
      error: e as Error,
      stack: 'influencer.api.getSetUserFollowingList',
    });
    throw error;
  }
};
