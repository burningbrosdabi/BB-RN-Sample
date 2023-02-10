import { useIsFocused, useNavigation } from '@react-navigation/native';
import { toast } from 'components/alert/toast';
import { Button, ButtonType } from 'components/button/Button';
import IconButton, { DEFAULT_IC_BTN_PADDING } from 'components/button/IconButton';
import { Link } from 'components/button/Link';
import { BookmarkButton } from 'components/button/post/BookmarkButton';
import { LikeButton } from 'components/button/post/LikeButton';
import { InlineComment } from 'components/comment/CommentItem';
import { CommentContext } from 'components/comment/context';
import { ImageSlider } from 'components/images/ImageSlider';
import { ModalRef } from 'components/modal/modal';
import { HashtagParagraph } from 'components/text/HashtagParagraph';
import { HandledError } from 'error';
import { isEmpty, isNil } from 'lodash';
import { CommentItemModel, CommentType, FeedbackInfo } from 'model';
import { RelatedProduct } from 'model/product/related.product';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Text, View, Linking } from 'react-native';
import { CommentListRouteSetting, ProductDetailRouteSetting, RoutePath } from 'routes';
import { FeedDetailParams, FeedDetailRouteSetting, FeedWritingRouteSetting } from 'routes/feed/feed.route';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { linkService } from 'services/link/link.service';
import { NavigationService } from 'services/navigation';
import { useNavigator } from 'services/navigation/navigation.service';
import { feedLikeController } from 'services/user';
import { Colors, Spacing, Typography } from 'styles';
import { fontExtraBold } from 'styles/typography';
import { useActions } from 'utils/hooks/useActions';
import { defaultShare } from 'utils/hooks/useShare';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { setLoading } from 'utils/state/action-creators';
import { createAffiliateLog, deleteFeed, feedUpdateHistory } from '_api';
import { dateTimeDiff, postMessageToChannel } from '_helper';
import { FeedOptionModal, ModalContext } from './FeedOptionModal';
import FeedProduct from './FeedProduct';
import Video from 'react-native-video';
import { Placeholder, PlaceholderMedia, Fade } from 'rn-placeholder';
import { DabiFont } from 'assets/icons';
import Ripple from 'react-native-material-ripple';
import { PlaceDetailRouteSetting } from 'routes/place/place.route';
import { FeatureMeasurement } from 'components/tutorial';

export const FEEDBACKBOX_HEADER_HEIGHT = 72;
const FeedbackBox = ({ data, ellipsis = true }: { data: FeedbackInfo; ellipsis?: boolean }) => {
  const {
    related_products,
    post_thumb_image,
    post_description,
    pk = 0,
    media_type,
    video,
    influencerpostimage_set, location, created_at
  } = data || {};

  const time = dateTimeDiff(created_at);

  const [description, setDescription] = useState(
    feedUpdateHistory.getFeedDescription(pk) ?? post_description,
  );

  useEffect(() => {
    const subscription = feedUpdateHistory.stream.subscribe(({ pk: _pk, description }) => {
      if (_pk !== pk) return;
      setDescription(description);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const navigator = useNavigator();
  const modalRef = useRef<ModalRef>();
  const { showDialog } = useActions();
  const [showVideoPlaceholder, SetShowVideoPlaceholder] = useState(true)

  const navigateFeed = () => {
    if (navigator.currentTab !== RoutePath.feed) {
      navigator.navigate(new FeedDetailRouteSetting({ pk: data.pk }));
    }
  };

  const navigatePlace = () => {
    if (isNil(location)) return
    navigator.navigate(new PlaceDetailRouteSetting({ location }));
  };

  const context = useMemo(() => {
    return {
      open: () => {
        modalRef.current?.open();
      },
      close: () => {
        modalRef.current?.close();
      },
    };
  }, [modalRef]);

  const onSelectOption = () => {
    modalRef.current?.close();
    let assets: string[] = [post_thumb_image];
    if (influencerpostimage_set.length > 0) {
      assets = influencerpostimage_set.map(value => value.source);
    }
    navigator.navigate(
      new FeedWritingRouteSetting({
        pk,
        assets,
        description: post_description,
      }),
    );
  };

  const onDeleteFeed = async () => {
    try {
      setLoading(true);
      await deleteFeed(pk);
      navigator.goBack();
    } catch (e) {
      const error = new HandledError({
        error: e as Error,
        stack: 'FeedbackBox.onDeleteFeed',
      });
      toast(error.friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const onConfirmRemove = () => {
    modalRef.current?.close();
    showDialog({
      title: 'Xóa bài viết',
      description: 'Bạn có chắc chắn muốn xóa bài viết',
      actions: [
        {
          text: 'Xóa bài viết',
          onPress: () => {
            onDeleteFeed();
          },
        },
        {
          type: ButtonType.flat,
          text: 'Hủy bỏ',
          onPress: () => { },
        },
      ],
    });
  };

  const thumbs = useMemo(() => {
    if (!isEmpty(influencerpostimage_set)) {
      return influencerpostimage_set.map(value => value.source);
    }
    return [post_thumb_image];
  }, [influencerpostimage_set, post_thumb_image]);
  const screenIsFocused = useIsFocused();
  const [muted, setMuted] = useState(false)
  const onMute = () => setMuted(!muted)
  return (
    // <View style={{flex: 1}}>
    <ModalContext.Provider value={context}>
      <ReactionDataStreamWrapper ellipsis={ellipsis}>
        <View style={{ flex: 1 }}>
          {/* <Header data={data} /> */}
          <View
            style={{
              ...(ellipsis ? { flex: 1 } : { width: Spacing.screen.width }),
            }}>
            {media_type == 1 ? <View style={{ flex: 1, width: '100%', aspectRatio: 4 / 5, }}>
              {showVideoPlaceholder && <Placeholder Animation={Fade} style={{ width: '100%', aspectRatio: 4 / 5, }}>
                <PlaceholderMedia style={{ flex: 1, width: '100%', aspectRatio: 4 / 5, }} /></Placeholder>}
              <Video
                style={{ flex: 1, width: '100%', aspectRatio: 4 / 5, backgroundColor: Colors.black }}
                source={{ uri: video }}
                resizeMode='contain'
                onLoad={() => { SetShowVideoPlaceholder(false) }}
                repeat
                paused={!screenIsFocused}
                muted={muted}

              />
              <View style={{ position: 'absolute', top: 12, right: 16 }}>
                <IconButton icon={muted ? 'mute' : 'sound'} color={'white'} onPress={onMute} />
              </View>
            </View> : <ImageSlider key={`${pk}`} onPress={navigateFeed} images={thumbs}
              related_products={related_products} />}
            {/* <View style={{ backgroundColor: 'blue', width: '100%', aspectRatio: 1 }} /> */}
          </View>

          <View style={{ height: 12 - DEFAULT_IC_BTN_PADDING }} />
          <Actions key={`${pk}`} data={data} />
          <View style={{ height: 12 - DEFAULT_IC_BTN_PADDING }} />
          {!isNil(location) && location.is_active ?
            <View style={{ paddingHorizontal: 16, paddingBottom: 12, alignItems: 'flex-start' }}>
              <Ripple style={{ flexDirection: 'row', alignItems: 'center' }} onPress={navigatePlace}>
                <DabiFont name='place' size={12} paddingRight={4} />
                <View style={{ flex: 1 }}>
                  <Text style={Typography.name_button} numberOfLines={1}>{location?.name}</Text></View>
              </Ripple>
            </View> : <></>}
          {!isEmpty(description) && (
            <View style={{ paddingHorizontal: 16 }}>
              <HashtagParagraph numberOfLines={ellipsis ? 2 : undefined} style={Typography.body}>
                {description}
              </HashtagParagraph>
            </View>
          )}
          <View style={{ height: 24 }} />
          <View style={{ paddingHorizontal: 16 }}>
            <Text
              style={{ ...Typography.description, color: Colors.surface.darkGray, }}>
              {time ? `${time} trước` : 'Vừa xong'}
            </Text>
          </View>
          <View style={{ height: 36 }} />
          {related_products && related_products?.length > 0 ? (

            <View style={{ paddingHorizontal: 16 }}>
              <Text style={Typography.subtitle}>Sản phẩm đang dùng</Text>
              <View style={{ height: 12 }} />
              {related_products.map((item, index) => {
                const { affiliate_link, out_link, pk } = item
                const onPressAffiliateLink = () => {
                  if (isNil(affiliate_link) && isNil(out_link)) {
                    toast('Đường dẫn đến sản phẩm không tồn tại!\nXin lỗi bạn vì sự cố này, chúng tôi sẽ khắc phục lỗi này một cách nhanh nhất.')
                    postMessageToChannel({
                      message: `Error with affiliate link. product_pk:${pk}`,
                      channel: 'product_sentry_log'
                    })
                    return
                  }
                  Linking.openURL(affiliate_link ?? out_link).then(
                    async () =>
                      await createAffiliateLog({ pk: pk })
                  ).catch(() => {
                    toast('Đường dẫn đến sản phẩm không tồn tại!\nXin lỗi bạn vì sự cố này, chúng tôi sẽ khắc phục lỗi này một cách nhanh nhất.')
                    postMessageToChannel({
                      message: `Error with affiliate link. product_pk:${pk}`,
                      channel: 'product_sentry_log'
                    })
                  })
                  // }
                }
                return <View style={{ zIndex: 10 - index }}><FeedProduct
                  key={`${index}`}
                  data={item}
                  onPress={onPressAffiliateLink}
                /></View>
              })}
            </View>
          ) : (
            <></>
          )}
          {ellipsis && <InlinePreviewComments data={data} />}
          <FeedOptionModal ref={modalRef}>
            <View style={{ paddingHorizontal: 16 }}>
              <Button type={ButtonType.option} text={'Xóa bài viết'} onPress={onConfirmRemove} />
            </View>
            <View style={{ height: 12 }} />
            <View style={{ paddingHorizontal: 16 }}>
              <Button
                type={ButtonType.option}
                text={'Chỉnh sửa bài viết'}
                onPress={onSelectOption}
              />
            </View>
            <View style={{ height: 12 }} />
          </FeedOptionModal>
        </View>
      </ReactionDataStreamWrapper>
    </ModalContext.Provider>
    // </View>
  );
};

const LikeStats = ({ pk, count: _count }: { pk: number; count: number }) => {
  const [count, setCount] = useState(feedLikeController.likeCounts[pk] ?? _count);
  const isLoginned = useTypedSelector(state => state.auth.isLoggedIn);

  useEffect(() => {
    // if (!isLoginned) return;
    const sub = feedLikeController.stream
      .pipe(filter(({ pk: _pk }) => pk === _pk))
      .subscribe(() => {
        setCount(feedLikeController.likeCounts[pk] ?? _count);
      });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  return (
    <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
      <Text style={Typography.description}>
        <Text style={{ fontFamily: fontExtraBold, color: 'black' }}>{Math.max(count, 0)}</Text> lượt
        thích
      </Text>
    </View>
  );
};

const onPressShare = async (data: FeedbackInfo) => {
  try {
    setLoading(true);

    if (isNil(data)) {
      return
    }
    const path = new FeedDetailRouteSetting().toURLPath(new FeedDetailParams(data.pk));
    const link = await linkService().buildLink({
      path,
      social: {
        imageUrl: data?.post_thumb_image,
        descriptionText: data.post_description,
        title: data.influencer.name
      }
    });
    defaultShare({
      title: data.post_description,
      message: link,
    })
  } catch (e) {
    toast('Không thể chia sẻ bài viết');
  } finally {
    setLoading(false);
  }
}

const Actions = ({ data }: { data: FeedbackInfo }) => {
  const { pk } = data;
  const navigator = useNavigator();
  const navigateComment = () => {
    navigator.navigate(
      new CommentListRouteSetting({
        pk,
        type: CommentType.feed,
      }),
    );
  };
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12 }}>
      <LikeButton key={`like_${pk}`} pk={pk} like_count={data.like_count} />
      <View style={{ flexDirection: 'row' }}>
        <IconButton icon={"share-1"} onPress={() => onPressShare(data)} />
        <View style={{ width: 24 - 2 * DEFAULT_IC_BTN_PADDING }} />
        {/* <FeatureMeasurement
          id={'feed-save'}
          title={'Lưu lại bài viết mà bạn thích'}
          description={
            'Bạn có thể xem lại bài viết đã lưu ở kho lưu trữ!'
          }
          overlay={
            <DabiFont name={'bookmark_line'} />
          }> */}
        <BookmarkButton key={`bookmark_${pk}`} data={data} />
        {/* </FeatureMeasurement> */}
      </View>
    </View>
  );
};

const InlinePreviewComments = ({ data }: { data: FeedbackInfo }) => {
  const { pk, total_comment, comments: _comments } = data;
  const { commentStream } = useContext(CommentContext);
  const [comments, setComment] = useState(_comments);
  const [totalComments, setTotalComments] = useState(total_comment);

  useEffect(() => {
    const sub = commentStream?.subscribe(value => {
      setComment([value, ...comments]);
      setTotalComments(current => current + 1);
    });
    return () => {
      sub?.unsubscribe();
    };
  }, []);

  const onShowAllComments = () => {
    NavigationService.instance.navigate(
      new CommentListRouteSetting({
        pk,
        type: CommentType.feed,
      }),
    );
  };

  if (comments.length <= 0) return <></>;

  return (
    <View style={{ paddingHorizontal: 16 }}>
      {totalComments > 2 && (
        <View style={{ alignSelf: 'flex-start', paddingBottom: 6 }}>
          <Link
            horizontalPadding={0}
            style={{ textDecorationLine: 'none' }}
            onPress={onShowAllComments}
            text={`Xem tất cả ${totalComments ?? 0} bình luận`}
          />
        </View>
      )}
      {comments.slice(0, 1).map((comment, index) => {
        return (
          <View key={`${index}`} style={{ paddingVertical: 6 }}>
            <InlineComment type={CommentType.feed} feedPk={pk} comment={comment} />
          </View>
        );
      })}
      <View style={{ height: 6 }} />
    </View>
  );
};

const ReactionDataStreamWrapper = ({
  ellipsis,
  children,
}: {
  ellipsis: boolean;
  children: JSX.Element;
}) => {
  const commentStream = ellipsis ? useRef(new Subject<CommentItemModel>()).current : undefined;

  useEffect(() => {
    return () => commentStream?.unsubscribe();
  }, []);

  if (!ellipsis) return children;

  return <CommentContext.Provider value={{ commentStream }}>{children}</CommentContext.Provider>;
};

export default React.memo(FeedbackBox);
