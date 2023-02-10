import { ScrollEvent } from 'recyclerlistview/dist/reactnative/core/scrollcomponent/BaseScrollView';

export type ListOnScroll = (rawEvent: ScrollEvent, offsetX: number, offsetY: number) => void;
export class ListController<T = undefined> {
  onScroll?: ListOnScroll;
  refresh: () => Promise<void> = () => Promise.resolve();
  data: T[] = [];
  remove!: (where:(value:T,index:number) => boolean) => void;
  // put!:(data:T[]) => void;
  unshift!: (data:T) => void;
  push!: (data:T) => void;
}
