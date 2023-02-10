import { PaginationResponse } from 'services/http/type';
import { RenderProps } from "components/list/RenderProps";
import { ListController } from "components/list/ListController";
import { ConnectionState } from "utils/hooks/useAsync";

export type InfScrollListProps<T> = {
    fetch: () => Promise<T[]>;
    refresh?: () => Promise<T[]>;
    initialData?: T[];
    item: RenderProps<T>;
    controller?: ListController<T>;
    isHorizontal?: boolean;
    infFetch?: () => Promise<T[]>;
    infRender: (state: ConnectionState) => JSX.Element;
    // tslint:disable-next-line:no-any
    stopFetchConditon: (infData: any[]) => boolean;
    Header?: JSX.Element;
    renderAheadMultiply?: number;
    floatingButtonBottomMargin?: number;
    showScrollToTopBtn?:boolean
};

export type PagingFetch<T> = (next?: string) => Promise<PaginationResponse<T>>;
