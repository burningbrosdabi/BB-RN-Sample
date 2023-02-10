import { useRoute } from '@react-navigation/native';
import { toast } from 'components/alert/toast';
import { Link } from 'components/button/Link';
import { Header } from 'components/header/Header';
import ImageElement from 'components/images/ImageElement';
import { HandledError } from 'error';
import { get, toLength } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  FlatList,
  Keyboard,
  KeyboardEvent,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  Platform,
  SafeAreaView, ScrollView,
  StyleSheet,
  TextInput,
  TextInputSelectionChangeEventData,
  View,
} from 'react-native';
import { Asset } from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FeedDetailRouteSetting } from 'routes/feed/feed.route';
import { useNavigator } from 'services/navigation/navigation.service';
import { Colors, Typography } from 'styles';
import { useActions } from 'utils/hooks/useActions';
import { feedUpdateHistory, updateFeed, uploadFeed } from '_api';
import { Logger } from 'services/log';
import { useKeyboardListener } from 'utils/hooks/useKeyboardListener';
import { screen } from 'styles/spacing';
import { getHeaderLayout } from '_helper';
import { Subject } from 'rxjs';
import { FeedWritingContext, InputData } from './context';
import { HashtagList } from 'scenes/feed/HashTagRecommendList';

const MAX_CHARACTERS = 1000;



export const FeedWriting = () => {
  const { params } = useRoute();

  const assets = get(params, 'assets', []) as Asset[] | string[];
  const feedPk = get(params, 'pk', null);
  const description = get(params, 'description', '');

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [composeHeight, setComposeHeight] = useState(screen.height - getHeaderLayout().height);
  const [viewportHeight, setViewportHeight] = useState(screen.height - getHeaderLayout().height);
  const inputStream = useRef(new Subject<InputData>()).current;
  const textInputRef = useRef<TextInput>();
  const { setLoading } = useActions();
  const navigator = useNavigator();
  const isAndroid = Platform.OS === 'android';
  const cursorPos = useRef(0);
  const hashtagAppended = useRef(false);
  const [text, setText] = useState(description);
  const [selection, setSelection] = useState<{ start: number, end: number } | undefined>(undefined);

  const submit = () => {
    Keyboard.dismiss();
    if (feedPk) {
      update();
    } else {
      upload();
    }
  };

  const update = async () => {
    try {
      setLoading(true);
      await updateFeed({
        text,
        pk: feedPk,
      });
      feedUpdateHistory.stream.next({
        pk: feedPk,
        description: text,
      });
      navigator.goBack();
      navigator.goBack();
      navigator.navigate(new FeedDetailRouteSetting({ pk: feedPk }));
    } catch (e) {
      const error = new HandledError({
        error: e as Error,
        stack: 'FeedWriting.update',
      });
      toast(error.friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const upload = async () => {
    try {
      Logger.instance.logWritingFeed();
      setLoading(true);
      const pk = await uploadFeed({
        text,
        images: assets as Asset[],
      });
      navigator.goBack();
      navigator.goBack();
      navigator.navigate(new FeedDetailRouteSetting({ pk }));
    } catch (e) {
      const error = new HandledError({
        error: e as Error,
        stack: 'FeedWriting.upload',
      });
      toast(error.friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Asset | string }) => {
    const source = typeof item === 'string' ? item : item.uri;
    return (
      <View style={{ marginRight: 12, borderRadius: 4, overflow: 'hidden' }}>
        <ImageElement width={78} height={78} sourceURL={source} />
      </View>
    );
  };

  const onChangeText = (_text: string) => {
    // checkHashtag(_text);
    // curText.current = _text;
    setText(_text);
    if (_text.length >= 1000) {
      toast('Vượt quá 1000 ký tự');
    }
  };

  const appendHashtag = (hashtag: string) => {
    hashtagAppended.current = true;

    setText(curr => {
      const pos = text.lastIndexOf('#') + 1;
      const newString = `${curr.substring(0, pos)}${hashtag} `;
      const newCursorPos = newString.length;
      setSelection({ start: newCursorPos, end: newCursorPos });

      return newString + curr.substring(cursorPos.current);
    });
  };

  useEffect(() => {
    checkHashtag();
  }, [text]);

  const checkHashtag = useCallback(() => {
    if (hashtagAppended.current) {
      setSelection(undefined);
      hashtagAppended.current = false;
      return;
    }
    inputStream.next({ text, cursorPos: cursorPos.current });
  }, [text, cursorPos]);

  const onShow = (event: KeyboardEvent) => {
    if (isAndroid) return;
    setKeyboardHeight(event.endCoordinates.height);
  };

  useKeyboardListener({ onShow });

  const onLayout = (event: LayoutChangeEvent) => {
    if (isAndroid) return;
    setViewportHeight(event.nativeEvent.layout.height);
  };

  useEffect(() => {
    if (isAndroid) return;
    setComposeHeight(viewportHeight - keyboardHeight);
  }, [viewportHeight, keyboardHeight]);

  const onSelectionChange = (event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
    const { end } = event.nativeEvent.selection;
    cursorPos.current = end;
  };

  return (
    <FeedWritingContext.Provider value={{ inputStream, appendHashtag }}>
      <SafeAreaView onLayout={onLayout} >
        <Header
          title={feedPk ? 'Chỉnh sửa bài viết' : 'Tạo bài viết'}
          trailing={
            <Link
              disabled={toLength(text.length) <= 0}
              style={{ textDecorationLine: 'none' }}
              blurColor={Colors.primary}
              onPress={submit}
              text={feedPk ? 'Sửa' : 'Đăng'}
            />
          }
        />
      </SafeAreaView>
      <View style={{ height: 12 }} />
      <View style={{ height: 187 }}>
        <ScrollView keyboardShouldPersistTaps={'always'}>
          <View>
            <FlatList<string | Asset>
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              horizontal
              data={assets}
              renderItem={renderItem}
            />
          </View>
          <View style={{ height: 24 }} />
          <TextInput
            ref={textInputRef}
            selection={selection}
            onSelectionChange={onSelectionChange}
            autoFocus
            value={text}
            scrollEnabled={false}
            defaultValue={description}
            maxLength={MAX_CHARACTERS}
            onChangeText={onChangeText}
            placeholder={'Hãy chia sẻ suy nghĩ của bạn'}
            placeholderTextColor={Colors.text}
            multiline
            style={styles.input}
          />
        </ScrollView>
      </View>
      <View style={{ flex: 1, borderTopWidth: 1, borderColor: Colors.background }}>
        <HashtagList />
      </View>
      <View style={{ height: keyboardHeight }} />

    </FeedWritingContext.Provider>
  );
};



const styles = StyleSheet.create({
  input: {
    ...Typography.body,
    // flex: 1,
    paddingHorizontal: 16,

    textAlign: 'left',
    textAlignVertical: 'top',
  },
});
