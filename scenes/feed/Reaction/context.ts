import { createContext } from 'react';
import { EmojiData } from 'scenes/feed/Reaction/type';

type IReactionContext = {
  setEmoji: (value?: EmojiData) => void;
};

export const ReactionContext = createContext<IReactionContext>({
  setEmoji: (_) => {},
});
