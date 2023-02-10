import { EmptyView, GenericErrorView } from 'components/empty/EmptyView';
import { PaggingScrollList } from "components/list/InfiniteScrollList";
import { ListController, ListOnScroll } from "components/list/ListController";
import { FeedbackContext } from "components/list/post/context";
import FeedbackBox, { FEEDBACKBOX_HEADER_HEIGHT } from "components/list/post/FeedbackBox";
import { FeedbackListItemPlaceholder } from "components/list/post/FeedbackListPlaceholder";
import { RenderProps } from "components/list/RenderProps";
import { isNil, range } from "lodash";
import { FeedbackInfo } from "model";
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { ImageRequireSource, Text, View } from "react-native";
import { Fade, Placeholder } from "rn-placeholder";
import { FeedbackOrdering, FeedListFilterInterface, getFeedbackListV2 } from 'services/api';
import { PaginationFetch } from "services/http/type";
import { Spacing } from "styles";
import { feedbackOrderingList } from 'utils/data';
import { ConnectionState } from "utils/hooks/useAsync";
import { listHasSameItem } from '../product/ProductList.v2';
import { FeedbackBoxGrid, FeedbackGridRowPlaceholder } from './FeedbackBoxGrid';
import { FeedFilter, useFilterModal } from './filter';
import { FeedFilterRepoContext, FeedOrderingRepoContext } from './filter/context';
import HOC from './filter/hoc';


type Props = {
    Header?: JSX.Element,
    fetch?: PaginationFetch<FeedbackInfo>,
    onScroll?: ListOnScroll, renderEmpty?: () => JSX.Element,
    controller?: ListController<FeedbackInfo>,
    renderAheadMultiply?: number,
    layout?: Layout,
    floatingButtonBottomMargin?: number,
    showScrollToTopBtn?: boolean,
    showSpec?: boolean,
    isFollowingList?: boolean
}

export enum Layout {
    list,
    grid
}


export type FeedbackListRef = {
    switchLayout: (layout: Layout) => void;
    refresh: () => void;
}

const _List =
    forwardRef(({
        Header,
        fetch,
        onScroll,
        renderEmpty,
        controller: ctrl,
        showSpec = false,
        renderAheadMultiply = 1,
        layout = Layout.grid,
        isFollowingList = false,
        floatingButtonBottomMargin,
        showScrollToTopBtn = true,
    }: Props, ref) => {
        const controller = useRef(ctrl ?? new ListController<FeedbackInfo>()).current;
        let feedFetch
        if (!fetch) {
            const prevFilter = useRef<FeedListFilterInterface | undefined>();

            const { weightFilter, heightFilter, styleFilter } =
                useContext(FeedFilterRepoContext).repo;

            const { repo: orderingType } = useContext(FeedOrderingRepoContext);

            const filterParams: FeedListFilterInterface = useMemo(
                () => ({
                    weightFilter,
                    heightFilter,
                    styleFilter,
                }),
                [
                    weightFilter,
                    heightFilter,
                    styleFilter,
                    orderingType,
                ],
            );

            useEffect(() => {
                controller.refresh();
                prevFilter.current = filterParams;

            }, [weightFilter,
                heightFilter,
                styleFilter,
                orderingType
            ]);

            feedFetch = (next?: string) => {
                const params: FeedListFilterInterface = {
                    ...filterParams,
                    isFollowing: isFollowingList
                };
                let orderingParam = {}
                let randomOrderingList = ["updated_at", "pk", "post_id", "created_at", "post_taken_at_timestamp"]
                if (orderingType.key == feedbackOrderingList[1].key) {
                    orderingParam = { offset: Math.floor(Math.random() * (100 - 20) + 20), ordering: randomOrderingList[Math.floor(Math.random() * 5)] }
                }
                return getFeedbackListV2(next, {
                    ...params,
                    ...isFollowingList ? undefined : { isValid: true },
                    ...orderingParam
                });
            };
        }
        else {
            feedFetch = fetch
        }

        const filter = useFilterModal();

        if (onScroll) {
            controller.onScroll = onScroll
        }

        const { orderingType } = useContext(FeedbackContext);
        const prevOrdering = useRef(orderingType);

        useEffect(() => {
            if (prevOrdering.current === orderingType) {
                return;
            }
            prevOrdering.current = orderingType
            controller.refresh();
        }, [orderingType])


        const {
            infRender: initialInfRenderer,
            render: initialRenderer
        } = useMemo(() => {
            return getRenderer(layout, showSpec, renderEmpty)
        }, [layout])

        const [renderer, setRenderer] = useState(initialRenderer);
        const [infRenderer, setInfRenderer] = useState(initialInfRenderer);

        const switchLayout = (layout: Layout) => {
            const { infRender, render } = getRenderer(layout, renderEmpty)
            setRenderer(render);
            setInfRenderer(infRender);
        }

        useImperativeHandle<unknown, FeedbackListRef>(ref, () => ({
            switchLayout,
            refresh: () => {
                controller.refresh();
            }
        }))

        const [orderingVisible, setOrderingVisible] = useState(false);

        const toogleOrderingModal = () => {
            setOrderingVisible(!orderingVisible);
        };
        const orderingContext = useMemo(
            () => ({
                visible: orderingVisible,
                toogle: toogleOrderingModal,
            }),
            [orderingVisible],
        );


        return <FeedFilter.FilterContext.Provider value={filter}>
            <FeedFilter.FeedOrderingContext.Provider value={orderingContext}>
                <PaggingScrollList<FeedbackInfo>
                    showScrollToTopBtn={showScrollToTopBtn}
                    renderAheadMultiply={renderAheadMultiply}
                    fetch={feedFetch}
                    controller={controller}
                    Header={Header}
                    infRender={infRenderer}
                    item={renderer}
                    floatingButtonBottomMargin={floatingButtonBottomMargin}
                />
                <FeedFilter.Modal />
                <FeedFilter.FeedOrderingModal />
            </FeedFilter.FeedOrderingContext.Provider>
        </FeedFilter.FilterContext.Provider>
    })


const gridWidth = Math.round(Spacing.screen.width / 2) - 1;
const gridItemWidth = gridWidth - 4;
const gridImageHeight = gridItemWidth * 5 / 4
const gridHeight = gridImageHeight
const headerHeight = 72;

const gridDimension = {
    // To deal with precision issues on android
    width: gridWidth,
    height: gridHeight + 8, // item height + padding
};

const BOTTOM_HEIGHT = 128 // 12 + 24(icon_button) + 12 + 16(luot thich) + 12 + 40(2line of text) + 12
const STANDARD_HEIGHT = BOTTOM_HEIGHT + FEEDBACKBOX_HEADER_HEIGHT + Spacing.screen.width

const listDimension = {
    width: Spacing.screen.width,
    height: STANDARD_HEIGHT,
}

const listItemWithCmtDimension = {
    width: Spacing.screen.width,
    height: STANDARD_HEIGHT + 68,
}

const listItemFeedbackDim = {
    ...listDimension,
    height: listDimension.height + 88,
}

const listItemFeedbackWithCmtDim = {
    ...listItemWithCmtDimension,
    height: listItemWithCmtDimension.height + 88
}


const _Placeholder = () => {
    return <Placeholder style={{ flex: 1 }} Animation={Fade}>
        {
            range(3).map((_, index) => {
                return <FeedbackListItemPlaceholder key={`${index}`} />
            })
        }
    </Placeholder>;
}

export const PlaceholderGrid = ({ height }: { height?: number }) => {

    return <Placeholder style={{ flex: 1 }} Animation={Fade}>
        {
            range(3).map((_, index) => {
                return <View style={{ height: gridDimension.height, paddingBottom: 8 }} key={`${index}`}>
                    <FeedbackGridRowPlaceholder />
                </View>
            })
        }
    </Placeholder>;
}

const getRenderer = (layout: Layout, showSpec: boolean, renderEmpty?: () => JSX.Element) => {
    switch (layout) {
        case Layout.grid:
            return { infRender: infGridRender, render: gridRender(showSpec, renderEmpty) };
        case Layout.list:
        default:
            return { infRender: infListRender, render: listRender(renderEmpty) };

    }

}

const infListRender = () => (state: ConnectionState) => {
    if (state === ConnectionState.waiting) return <_Placeholder />
    return <></>
}

const infGridRender = () => (state: ConnectionState) => {
    if (state === ConnectionState.waiting) return <PlaceholderGrid height={gridHeight} />
    return <></>
}

const Empty = () => {
    return <EmptyView
        title={'Không có kết quả bạn cần tìm'}
        description={'Vui lòng kiểm tra lại từ khóa của bạn'}
        file={require('assets/images/empty/info_post.png') as ImageRequireSource}

    />
}


const gridRender = (showSpec: boolean, renderEmpty?: () => JSX.Element) => {
    let _renderEmpty = () => <Empty />;
    if (renderEmpty) {
        _renderEmpty = renderEmpty
    }
    return new RenderProps<FeedbackInfo>({
        getTypeByData: (_) => 'item',
        uid: "grid",
        // approximateDimension: true,
        builder: {
            hasEmptyData: _renderEmpty,
            hasError: ({ width, height }) => <GenericErrorView />,
            none: ({ height }) => (<PlaceholderGrid height={height} />),
            hasData: ({ height, width }, data, index) => {
                const isOdd = index! % 2;
                return (
                    <View key={`${data!.pk}`}
                        style={{ width, height, paddingRight: isOdd ? 0 : 4, paddingLeft: isOdd ? 4 : 0 }}>
                        <FeedbackBoxGrid data={data!} showSpec={showSpec} />
                    </View>
                )
            },
        },
        dimension: { 'item': gridDimension }
    });
}
const listRender = (renderEmpty?: () => JSX.Element) => {

    let _renderEmpty = () => <Empty />;
    console.log('renderEmpty')
    console.log(renderEmpty)
    if (renderEmpty) {
        _renderEmpty = renderEmpty
    }

    return new RenderProps<FeedbackInfo>({
        getTypeByData: (data, index) => {

            let cmt = '';
            let feedback = '';

            if (data![index]?.comments?.length > 0) cmt = '_with_comment';
            if (!isNil(data![index]?.related_product)) feedback = '_feedback';

            return `item${feedback}${cmt}`
        },
        builder: {
            hasEmptyData: _renderEmpty,
            hasError: ({ width, height }) => <GenericErrorView />,
            none: () => (<_Placeholder />),
            hasData: ({ height, width }, data) => (
                <FeedbackBox key={`${data?.pk}`} data={data!} />
            ),
        },
        dimension: {
            'item': listDimension,
            'item_with_comment': listItemWithCmtDimension,
            'item_feedback': listItemFeedbackDim,
            'item_feedback_with_comment': listItemFeedbackWithCmtDim,
        },
    })
}

export const FeedbackList = HOC(_List)