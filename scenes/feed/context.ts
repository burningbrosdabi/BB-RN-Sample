import {Subject} from "rxjs";
import {createContext} from "react";

export type InputData = {
    cursorPos: number;
    text: string;
};


export type IFeedWritingContext = {
    inputStream: Subject<InputData>;
    appendHashtag: (hashtag: string) => void;
};

export const FeedWritingContext = createContext<IFeedWritingContext>({
    inputStream: new Subject<InputData>(),
    appendHashtag: value => {},
});
