import { useNavigation } from '@react-navigation/native';
import ProfileImage from 'components/images/ProfileImage';
import { isNil } from 'lodash';
import { CommentItemModel, CommentType } from 'model';
import moment from 'moment';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Ripple from 'react-native-material-ripple';
import { PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { CommentListRouteSetting, RoutePath } from 'routes';
import { applyOpacity, Colors, Typography } from 'styles';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { Link } from 'components/button/Link';
import { CommentReplyContext } from 'components/comment/context';
import { filter, skipWhile } from 'rxjs/operators';
import { DabiFont } from '_icons';
import { getFriendlyMomentStr } from '_helper';
import Collapsible from 'react-native-collapsible';
import { AuthDialog } from 'components/alert/dialog';
import { showDialog } from 'utils/state/action-creators';
import { useActions } from 'utils/hooks/useActions';
import { CommentLikeButton } from 'components/comment/CommentLikeButton';
import { commentLikeController } from 'services/user';
import HeartFilledIcon from 'assets/icons/product/HeartFilledIcon';
import { useNavigator } from 'services/navigation/navigation.service';
import { UserType } from 'model/user/user';

type Props = {
  comment: CommentItemModel;
  onTextPressed?: () => void;
  parentPk?: number;
  type: CommentType;
};

export const InlineComment = ({ type, comment, feedPk }: Props & { feedPk: number }) => {
  const navigator = useNavigator();
  const showAllComments = () => {
    navigator.navigate(
      new CommentListRouteSetting({
        pk: feedPk,
        type,
      }),
    );
  };
  return (
    <TouchableWithoutFeedback onPress={showAllComments}>
      <View style={{ flexDirection: 'row' }}>
        <ProfileImage pk={comment.user.pk} size={24} source={comment.user.profile_image} />
        <View style={{ width: 8 }} />
        <Text style={Typography.name_button}>{comment.user.user_id}</Text>
        <View style={{ width: 4 }} />
        <Text numberOfLines={1} style={[Typography.body, { flex: 1 }]}>
          {comment.text}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export const CommentItem = ({
  comment,
  onTextPressed = () => {
    /**/
  },
  parentPk,
  type,
}: Props) => {
  const hasImage = comment.images.length > 0;
  const { created_at } = comment;
  const navigation = useNavigation();
  const user_id = useTypedSelector(state => state.user.userInfo?.id);
  const [reply, setReply] = useState<CommentItemModel[]>(comment.sub_comments);
  const { sourceCommentStream, replyStream } = useContext(CommentReplyContext);
  const logined = useTypedSelector(state => state.auth.isLoggedIn);
  const { showDialog } = useActions();

  const isSubComment = useMemo(() => {
    return !isNil(parentPk);
  }, []);

  useEffect(() => {
    const sub = replyStream
      ?.pipe(
        skipWhile(_ => {
          return comment.pk !== sourceCommentStream.value?.pk;
        }),
      )
      .subscribe(value => {
        setReply([...reply, value]);
      });

    return () => {
      sub?.unsubscribe();
    };
  }, [reply]);

  const onReply = () => {
    if (!logined) {
      showDialog(AuthDialog);
      return;
    }
    sourceCommentStream.next({
      ...comment,
      pk: parentPk ?? comment.pk,
      reply: comment.pk,
    } as CommentItemModel);
  };

  return (
    <View style={{ paddingRight: 16, paddingLeft: 8, paddingBottom: 12, flexDirection: 'row' }}>
      {isSubComment ? (
        <View style={{ width: 24, paddingRight: 8, alignItems: 'flex-end' }}>
          <DabiFont name={'small_branch'} size={12} />
        </View>
      ) : (
        <View style={{ width: 8 }} />
      )}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row' }}>
          <Ripple
            onPress={() => {
              if (user_id && user_id === comment.user?.pk) return;
              navigation.navigate({
                name: RoutePath.UserProfile,
                key: comment.user?.pk,
                params: { pk: comment.user?.pk },
              });
            }}
            rippleContainerBorderRadius={12}
            style={{ width: 24, height: 24 }}>
            <ProfileImage pk={comment.user.pk} size={24} source={comment.user.profile_image} />
          </Ripple>
          <View style={{ width: 8 }} />
          <TouchableOpacity
            style={{
              flexShrink: 1,
              ...(isSubComment
                ? {
                  padding: 8,
                  paddingTop: 10,
                  borderRadius: 8,
                  backgroundColor: Colors.background,
                }
                : undefined),
            }}
            disabled={isNil(onTextPressed)}
            onPress={onTextPressed}>
            <Text style={Typography.body}>
              {!isNil(comment.user?.user_type) && comment.user?.user_type == UserType.INFLUENCER && (<View style={{ paddingRight: 4, paddingBottom: 1 }}>
                <DabiFont name={'crown'} size={12} color={Colors.red} />
              </View>)}
              {!isNil(comment.user?.user_type) && comment.user?.user_type == UserType.SELLER && (<View style={{ paddingRight: 4, paddingBottom: 1 }}>
                <DabiFont name={'small_store'} size={12} color={Colors.red} />
              </View>)}
              <Text style={Typography.name_button}>{comment.user.user_id}</Text>

              {` ${comment.text}`}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ paddingLeft: 32 }}>
          <View style={{ height: 4 }} />
          {hasImage && <Images data={comment} images={comment.images} />}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={Typography.description}>{getFriendlyMomentStr(created_at)}</Text>

            <View style={{ width: 24 }} />
            <CommentLikeButton type={type} initialCount={comment.reaction_count} pk={comment.pk} />
            <View style={{ width: 24 }} />
            <Link
              horizontalPadding={0}
              focusColor={Colors.primary}
              style={[Typography.description, { textDecorationLine: 'none' }]}
              text={'Trả lời'}
              onPress={onReply}
            />
            <View style={{ flex: 1 }} />
            <CommentFollowCount type={type} pk={comment.pk} initialCount={comment.reaction_count} />
          </View>
        </View>
        <View style={{ height: 12 }} />
        <View>{!isSubComment && <SubComments type={type} parentPk={comment?.pk} subcomment={reply} />}</View>
      </View>
    </View>
  );
};

const SubComments = ({
  subcomment,
  parentPk,
  type,
}: {
  type: CommentType;
  parentPk: number;
  subcomment: CommentItemModel[];
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const { sourceCommentStream, replyStream } = useContext(CommentReplyContext);

  useEffect(() => {
    replyStream.subscribe(value => {
      if (sourceCommentStream.value?.pk === parentPk) {
        setCollapsed(false);
      }
    });
  }, [subcomment]);

  const toogle = () => {
    setCollapsed(!collapsed);
  };

  if (subcomment.length <= 0) return <></>;
  return (
    <View>
      <View style={{ alignItems: 'flex-start', paddingLeft: 32 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {collapsed && (
            <View style={{ position: 'absolute', left: -20 }}>
              <DabiFont name={'small_branch'} size={12} />
            </View>
          )}
          <Link
            horizontalPadding={0}
            style={{ textDecorationLine: 'none', ...Typography.description }}
            text={collapsed ? `Hiện tất cả ${subcomment.length} bình luận` : 'Ẩn bớt'}
            onPress={toogle}
          />
        </View>
      </View>
      <View style={{ height: 12 }} />
      <Collapsible collapsed={collapsed}>
        {subcomment.map((subcomment, index) => {
          return (
            <CommentItem
              type={type}
              key={`${subcomment.pk}`}
              parentPk={parentPk}
              comment={subcomment}
            />
          );
        })}
      </Collapsible>
    </View>
  );
};

const Images = ({ images, data }: { images: string[]; data: CommentItemModel }) => {
  const moreThan2 = images.length >= 3;
  if (images.length <= 0) return <></>;

  const navigation = useNavigation();

  const navigateImageScreen = (index: number) => {
    navigation.navigate(RoutePath.userFeedbackImageScreen, {
      data: { ...data, content: data.text },
      currentIndex: index,
      itemIndex: index,
    });
  };

  return (
    <View style={{ flexDirection: 'row', marginBottom: 4 }}>
      <Ripple
        rippleContainerBorderRadius={4}
        onPress={() => navigateImageScreen(0)}
        style={styles.imageItem}>
        <FastImage
          style={{ flex: 1, backgroundColor: Colors.surface.lightGray }}
          source={{ uri: images[0] }}
        />
      </Ripple>
      <View style={{ width: 12 }} />
      <Ripple
        rippleContainerBorderRadius={4}
        onPress={() => {
          if (isNil(images[1])) return;
          navigateImageScreen(1);
        }}
        style={styles.imageItem}>
        {!isNil(images[1]) && (
          <>
            <FastImage
              style={{ flex: 1, backgroundColor: Colors.surface.lightGray }}
              source={{ uri: images[1] }}
            />
            {moreThan2 && (
              <View style={styles.backdrop}>
                <Text style={[Typography.name_button, { color: 'white' }]}>+{images.length - 1}</Text>
              </View>
            )}
          </>
        )}
      </Ripple>
    </View>
  );
};

export const CommentItemPlaceholder = () => {
  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <PlaceholderMedia
          style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: 'white' }}
        />
        <View style={{ width: 8 }} />
        <PlaceholderLine noMargin style={{ width: 60, height: 16, backgroundColor: 'white' }} />
      </View>
      <View style={{ paddingLeft: 32 }}>
        <PlaceholderLine noMargin style={{ width: '60%', height: 16, backgroundColor: 'white' }} />
        <View style={{ height: 4 }} />
        <PlaceholderLine noMargin style={{ width: '80%', height: 16, backgroundColor: 'white' }} />
        {/*<View style={{height: 4}}/>*/}
        {/*<PlaceholderLine noMargin style={{width: '90%', height: 16, backgroundColor: 'white'}}/>*/}
        {/*<View style={{height:12}}/>*/}
        {/*<View style={{flexDirection: 'row', flex: 1}}>*/}
        {/*    <PlaceholderMedia color={'white'} style={styles.imageItem}/>*/}
        {/*    <View style={{width: 12}}/>*/}
        {/*    <PlaceholderMedia color={'white'} style={styles.imageItem}/>*/}
        {/*</View>*/}
      </View>
    </View>
  );
};

const CommentFollowCount = ({
  type,
  pk,
  initialCount,
}: {
  type: CommentType;
  pk: number;
  initialCount: number;
}) => {
  const [count, setCount] = useState(commentLikeController[type].likeCounts[pk] ?? initialCount);
  const isLoginned = useTypedSelector(state => state.auth.isLoggedIn);

  useEffect(() => {
    // if (!isLoginned) return;
    const sub = commentLikeController[type].stream
      .pipe(filter(({ pk: _pk }) => pk === _pk))
      .subscribe(() => {
        setCount(commentLikeController[type].likeCounts[pk] ?? initialCount);
      });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  if (count <= 0) return <></>;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', height: 14 }}>
      <Text style={[Typography.description, { color: Colors.primary }]}>{`${count}`}</Text>
      <View style={{ width: 4 }} />
      <DabiFont name={'heart_filled'} size={10} color={Colors.red} />
    </View>
  );
};

const styles = StyleSheet.create({
  imageItem: { width: 80, aspectRatio: 1, borderRadius: 4, overflow: 'hidden' },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: applyOpacity('#000000', 0.3),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
