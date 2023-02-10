import AsyncStorage from '@react-native-community/async-storage';
import { DabiFont, NotFoundIcon } from 'assets/icons';
import { toast } from 'components/alert/toast';
import { ButtonType } from 'components/button/Button';
import IconButton from 'components/button/IconButton';
import { Header } from 'components/header/Header';
import { HandledError } from 'error';
import { isNil, range } from 'lodash';
import { Magazine } from 'model';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  Animated,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Fade, Placeholder, PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import {
  MagazineDetailParams,
  MagazineDetailRouteSetting
} from 'routes';
import { getMagazine } from 'services/api';
import { linkService } from 'services/link/link.service';
import { Colors, Spacing, Typography } from 'styles';
import { fontPlaceHolder } from 'styles/typography';
import { storeKey } from 'utils/constant';
import { useActions } from 'utils/hooks/useActions';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { defaultShare } from 'utils/hooks/useShare';
import { _Context } from './context';
import { MagazineSlide } from './magazine.slider';

interface Props {
  route: { params: { id: number } };
}

export const MagazineScreen = ({ route }: Props) => {
  const id = route?.params?.id;
  const animation = useRef(new Animated.Value(0)).current;

  const fetchData = useCallback(() => getMagazine(id), []);
  const { state, data, error, excecute } = useAsync<Magazine>(fetchData);

  const [showSlideTooltip, setShowSlideTooltip] = useState<boolean | undefined>();
  const [showCommentTooltip, setShowCommentTooltip] = useState(false);

  const { showDialog, setLoading } = useActions();

  useEffect(() => {
    excecute();
  }, []);

  useEffect(() => {
    if (!error) return;
    const handledError = new HandledError({
      error,
      stack: 'MagazineScreen.useEffect',
    });
    showDialog({
      title: handledError.friendlyMessage,
      actions: [
        {
          type: ButtonType.primary,
          text: 'Ok',
          onPress: () => {
            /** */
          },
        },
      ],
    });
    handledError.log(true);
  }, [error]);

  const context = useMemo(
    () => ({
      commentCount: data?.total_comment ?? 0,
      showSlideTooltip,
      showCommentTooltip,
      setShowSlideTooltip,
      setShowCommentTooltip,
    }),
    [showSlideTooltip, showCommentTooltip, data],
  );

  const shareLink = async () => {
    try {
      setLoading(true);
      const path = new MagazineDetailRouteSetting().toURLPath(new MagazineDetailParams(data!.pk));
      const link = await linkService().buildLink({
        path,
        social: {
          imageUrl: data?.cover_picture,
          descriptionText: data?.content,
          title: data?.title,
        },
      });
      defaultShare({ title: data?.title ?? '', message: link });
    } catch (e) {
      toast('Không thể chia sẻ bài viết');
    } finally {
      setLoading(false);
    }
  };

  return (
    <_Context.Provider value={context}>
      <SafeAreaView style={{ flex: 1 }} >
        <Header
          title={data?.title}
          trailing={
            !isNil(data) ? (
              <IconButton icon={"share-1"} style={{ marginHorizontal: 12 }} onPress={shareLink} />
            ) : (
              <></>
            )
          }
        />
        {(state === ConnectionState.waiting || state === ConnectionState.hasError) && <Loading />}
        {state === ConnectionState.hasEmptyData && <EmptyData />}
        {state === ConnectionState.hasData && !!data && <MagazineSlide data={data} />}
        {<Tooltips />}
      </SafeAreaView>
    </_Context.Provider>
  );
};

const Loading = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      <Placeholder Animation={Fade}>
        <PlaceholderMedia
          color={Colors.surface.darkGray}
          size={30}
          style={{ width: '100%', height: Spacing.screen.width }}
        />
        <View style={{ height: 16 }} />
        <View style={{ paddingHorizontal: 28 }}>
          <View style={{ height: 10 }} />
          {range(10).map((_, index) => (
            <PlaceholderLine
              color={Colors.surface.darkGray}
              style={{
                ...fontPlaceHolder.description,
                marginVertical: 3,
                width: `${Math.min(60 + index * 15, 100)}%`,
              }}
              key={index}
            />
          ))}
        </View>
      </Placeholder>
      <Placeholder Animation={Fade}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 12,
            paddingRight: 16,
            paddingBottom: 8,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ padding: 4 }}>
              <DabiFont name={'comment'} />
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
            }}>
              <Text style={Typography.name_button}>Có thể bạn cũng thích</Text>
            </View>
            <View style={{ width: 4 }} />
            <DabiFont name={'small_arrow_right'} size={12} /></View>
          {/* TODO Help me with setting bottom safearea.... */}
        </View>
      </Placeholder>
    </View>
  );
};

const EmptyData = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <NotFoundIcon />
      <Text
        style={{
          marginTop: 10,
          color: Colors.text,
          textAlign: 'center',
          ...Typography.title,
        }}>
        {'Không tìm thấy bài viết'}
      </Text>
    </View>
  );
};

const Tooltips = () => {
  const { showSlideTooltip, setShowSlideTooltip, setShowCommentTooltip } = useContext(_Context);

  useEffect(() => {
    async function checkIfShowTooltip() {
      const isShowModal = await AsyncStorage.getItem(storeKey.showTooltip);
      if (isShowModal !== 'true') {
        setShowSlideTooltip(true);
        await AsyncStorage.setItem(storeKey.showTooltip, 'true');
      } else {
        setShowSlideTooltip(false);
      }
    }

    checkIfShowTooltip();
  }, []);

  const closeModal = () => {
    setShowSlideTooltip(false);
  };

  useEffect(() => {
    if (showSlideTooltip === false) {
      setShowCommentTooltip(true);
    }
  }, [showSlideTooltip]);

  return (
    <Modal
      hardwareAccelerated={true}
      visible={showSlideTooltip === true}
      transparent={true}
      onRequestClose={closeModal}>
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.content}>
            <Text style={styles.textToolTipStyle}>{'Vuốt theo\nhướng này'}</Text>
            <FastImage
              source={require('_assets/images/popup/swipe_tooltip.gif')}
              style={styles.imageTooltip}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageTooltip: {
    tintColor: 'red',
    height: 68,
    width: 92,
    resizeMode: 'contain',
  },
  textToolTipStyle: {
    ...Typography.body,
    color: Colors.white,
    marginVertical: 12,
    textAlign: 'center',
  },
  content: {
    backgroundColor: '#000000',
    height: 150,
    width: 150,
    alignItems: 'center',
    borderRadius: 4,
  },
});
