import React, { useMemo } from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { Typography } from 'styles';
import { omit } from 'lodash';
import { hashtagRegex } from "_helper";

type Props = { children: string };

export const HashtagParagraph = (props: Props & TextProps) => {
  const text = props.children;

  const hashtags = text.match(hashtagRegex);
  const textSpliced = text.split(hashtagRegex);

  const child = useMemo(() => {
    if (textSpliced.length <= 1 || !hashtags) return textSpliced;
    return textSpliced.reduce((acc: unknown[], current: string, index) => {
      const hashtagText = (
        <Text
          key={`${index}`}
          onPress={() => {
            // console.log(hashtags[index]);
          }}
          style={{
            color: '#2277D7',
          }}>
          {hashtags[index]}
        </Text>
      );
      return [...acc, current, hashtagText];
    }, []);
  }, [props]);

  const textElem = React.createElement(Text, omit(props, ['children']), child);

  return textElem;
};
