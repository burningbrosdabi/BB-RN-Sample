import { HandledError } from 'error';
import { IRecipient } from 'model/recipient/recipient';
import { Http } from 'services/http/http.service';

export const getRecipientList = async ({
  offset = 0,
}: {
  offset?: number;
}): Promise<{ totalCount: number; data: IRecipient[] }> => {
  try {
    const response = await Http.instance.get<{ count: number; results: IRecipient[] }>(
      `v1/recipients/?limit=20&offset=${offset}`,
    );

    return { totalCount: response.data.count, data: response.data.results };
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'recipient.get',
    });
    throw exception;
  }
};

export const deleteRecipientApi = async (id: any): Promise<void> => {
  try {
    await Http.instance.delete(`v1/recipients/${id}/`);
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'recipient.delete',
    });
    throw exception;
  }
};

export const createRecipientApi = async (body: any): Promise<any> => {
  try {
    const response = await Http.instance.post('v1/recipients/', body);

    return response.data;
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'recipient.create',
    });
    throw exception;
  }
};

export const updateRecipientApi = async (id: number, body: any): Promise<any> => {
  try {
    const response = await Http.instance.put(`v1/recipients/${id}/`, body);

    return response.data;
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'recipient.update',
    });
    throw exception;
  }
};
