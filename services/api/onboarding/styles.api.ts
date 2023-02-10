import { HandledError } from 'error';
import { JSONType, StyleItem } from 'model';
import { Http } from 'services/http/http.service';
import { PaginationResponse } from "services/http/type";
import { PagingFetch } from "components/list/type";

interface StylesListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: JSONType[]
}

export const getStylesList: PagingFetch<StyleItem> = async (next) => {
    try {
        const {
            data: {
                count, next: nextUrl, previous, results
            }
        } = await Http.instance.get<StylesListResponse>(
            next ?? 'pick/', {
            params: next ? {
                limit: 21
            } : undefined
        }
        );
        const data = new StyleItem().fromListJSON(results);
        return {
            count, next: nextUrl, results: data, previous
        };
    } catch (error) {
        throw new HandledError({
            error: error as Error,
            stack: 'OnboardingApi.getStylesList'
        });
    }
};
