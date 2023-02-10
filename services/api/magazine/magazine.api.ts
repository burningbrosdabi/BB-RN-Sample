import { HandledError } from 'error';
import { Magazine, MagazineType, ProductInfo } from 'model';
import { Http } from 'services/http/http.service';
import {
  ProductListDTO,
  ProductListFilterInterface,
  ProductListResponse,
} from '../product/product.dtos';
import { CommentDTO, CommentResponse } from './comment.dtos';
import { omit } from 'lodash';

export const getMagazine = async (id: number): Promise<Magazine> => {
  try {
    const response = await Http.instance.get<MagazineType>(`v1/magazines/${id}/`);
    const data = new Magazine().fromJSON(response.data);

    return data;
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'MagazineApi.getMagazine',
    });
    throw exception;
  }
};

export const getMagazineRelatedProducts = async (params: {
  magazine_id: number;
  offset: number;
}): Promise<ProductListDTO> => {
  try {
    const { magazine_id, offset } = params;
    const url = `v1/magazines/${magazine_id}/related_products/`;

    const {
      data: { count, results },
    } = await Http.instance.get<ProductListResponse>(url, {
      params: {
        limit: 20,
        'is-discount': 'True',
        offset,
      },
    });

    const products = new ProductInfo().fromListJSON(results ?? []) as ProductInfo[];

    return {
      totalCount: count,
      data: products,
    };
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'magazine.api.getMagazineRelatedProducts',
    });
    throw exception;
  }
};

export const getMagazineComments = async ({ magazine_id }: { magazine_id: number }) => {
  try {
    const url = `v1/magazines/${magazine_id}/comments/`;
    const response = await Http.instance.get<CommentResponse>(url);

    return {
      totalCount: response.data.count,
      data: response.data.results,
    } as CommentDTO;
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'magazine.api.getMagazineComments',
    });
    throw exception;
  }
};

export const createMagazineCommenttApi = async (pk: number, params: any) => {
  try {
    const url = `v1/magazines/${pk}/comments/`;
    let formData = new FormData();
    formData.append('text', params.message);
    (params.images || []).forEach((element: any, index: number) => {
      formData.append(`image_${index + 1}`, element.data);
    });

    console.log(formData);
    const response = await Http.instance.post(url, formData);

    console.log(response);
    return response.data;
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'magazine.api.createMagazineCommenttApi',
    });
    throw exception;
  }
};
