import {createContext} from "react";

export const _Context = createContext({
    commentCount: 0,
    showSlideTooltip: undefined,
    showCommentTooltip: false,
    setShowSlideTooltip: (_?: boolean) => {},
    setShowCommentTooltip: (_: boolean) => {},
});