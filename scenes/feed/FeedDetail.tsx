import { useNavigation, useRoute } from '@react-navigation/native';
import { DabiFont } from 'assets/icons';
import { CommentPreview } from 'components/comment/CommentPreview';
import { CommentContext } from 'components/comment/context';
import { GenericErrorView } from 'components/empty/EmptyView';
import { Header } from 'components/header/Header';
import ProfileImage from 'components/images/ProfileImage';
import FeedbackBox from 'components/list/post/FeedbackBox';
import { FeedbackListItemPlaceholder } from 'components/list/post/FeedbackListPlaceholder';
import { FeatureDiscoveryContext } from 'components/tutorial/context';
import { get, isEmpty, isNil } from 'lodash';
import { CommentItemModel, FeedbackInfo } from 'model';
import { UserType } from 'model/user/user';
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import {
  Keyboard, SafeAreaView, Text,
  TouchableOpacity,
  View
} from 'react-native';
import {
  KeyboardAwareScrollView
} from 'react-native-keyboard-aware-scroll-view';
import { Fade, Placeholder, PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { RoutePath } from 'routes';
import { Subject } from 'rxjs';
import { FollowButton, FollowButtonPlaceHolder } from 'scenes/user/follow/FollowButton';
import { useNavigator } from 'services/navigation/navigation.service';
import { Colors, Spacing, Typography } from 'styles';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { useKeyboardSpacer } from 'utils/hooks/useKeyboardListener';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { createFeedDetailLog, getFeedDetail } from '_api';
import { getHeaderLayout } from '_helper';

const { height } = Spacing.screen;

const _Header = ({ data }: { data: FeedbackInfo }) => {
  if (!data) return <Placeholder Animation={Fade}>
    <View style={{ flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 12, alignItems: 'center' }}>
      <PlaceholderMedia style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'white' }} />
      <View style={{ width: 12 }} />
      <View>
        <PlaceholderLine noMargin style={{ width: 120, height: 16, backgroundColor: 'white' }} />
        <View style={{ height: 4 }} />
        <PlaceholderLine noMargin style={{ width: 80, height: 14, backgroundColor: 'white' }} />
      </View>
      <View style={{ flex: 1 }} />
      <FollowButtonPlaceHolder />

    </View>
  </Placeholder>

  const navigator = useNavigator();
  const navigation = useNavigation();
  const isInProfile =
    navigator.currentTab === RoutePath.kolFeedbackProfile ||
    navigator.currentTab === RoutePath.profile;
  const { influencer, post_taken_at_timestamp } = data;

  const userId = useTypedSelector(state => state?.user?.userInfo?.id);
  return (
    <View style={{ flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 12, alignItems: 'center' }}>
      <TouchableOpacity
        disabled={isInProfile}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        }}
        onPress={() => {
          if (!isInProfile) {
            if (!isNil(userId) && userId === influencer.pk) {
              navigation.navigate(RoutePath.profile);
            } else {
              navigation.push(RoutePath.UserProfile, { pk: influencer?.pk });
            }
          }
        }}>
        <ProfileImage
          pk={influencer.pk}
          source={!isEmpty(influencer?.profile_image) ? influencer?.profile_image : undefined}
        />
        <View style={{ width: 12 }} />
        <View style={{ flex: 1 }}>
          <View style={{ width: '70%', flexDirection: 'row', alignItems: 'flex-start' }}>
            <Text numberOfLines={1} style={Typography.name_button}>
              {influencer.user_id}
            </Text>
            {!isNil(influencer?.user_type) && influencer?.user_type == UserType.INFLUENCER && (
              <View style={{ marginLeft: 4, height: 20, bottom: 1, justifyContent: 'center' }}>
                <DabiFont name={'crown'} size={12} color={Colors.red} />
              </View>
            )}
            {!isNil(influencer?.user_type) && influencer?.user_type == UserType.SELLER && (
              <View style={{ marginLeft: 4, height: 20, bottom: 1, justifyContent: 'center' }}>
                <DabiFont name={'small_store'} size={12} color={Colors.red} />
              </View>
            )}
          </View>
          {(influencer?.height || influencer?.weight) &&
            <Text style={Typography.description}>{!isNil(influencer?.height) && (influencer?.height + 'cm')}
              {!isNil(influencer?.height && influencer?.weight) && ", "}
              {!isNil(influencer?.weight) && (influencer?.weight + 'kg')}</Text>}
        </View>
      </TouchableOpacity>
      <View style={{ width: 12, }} />
      <FollowButton name={influencer.name} pk={influencer.pk} />
    </View>
  );
};

export const FeedDetail = () => {
  const { params } = useRoute();
  const pk = get(params, 'pk');
  if (!pk) return <GenericErrorView />;

  const { data, excecute, state } = useAsync(() => getFeedDetail(pk));
  const commentStream = useRef(new Subject<CommentItemModel>()).current;
  const listRef = useRef<KeyboardAwareScrollView>();
  const { discover } = useContext(FeatureDiscoveryContext);

  useEffect(() => {
    excecute();
    // discover(storeKey.feedDetailFeatureDiscovery);
    createFeedDetailLog({ pk })
  }, []);

  const { Spacer, onChangeText } = useKeyboardSpacer({ listRef: listRef?.current });

  const child = useMemo(() => {
    if (state === ConnectionState.waiting || state === ConnectionState.none) {
      return (
        <View style={{ flex: 1 }}>
          <Placeholder Animation={Fade}>
            <Placeholder Animation={Fade}>
              <View style={{ flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 12, alignItems: 'center' }}>
                <PlaceholderMedia style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'white' }} />
                <View style={{ width: 12 }} />
                <View>
                  <PlaceholderLine noMargin style={{ width: 120, height: 16, backgroundColor: 'white' }} />
                  <View style={{ height: 4 }} />
                  <PlaceholderLine noMargin style={{ width: 80, height: 14, backgroundColor: 'white' }} />
                </View>
                <View style={{ flex: 1 }} />
                <FollowButtonPlaceHolder />

              </View>
            </Placeholder>
            <FeedbackListItemPlaceholder />
          </Placeholder>
        </View>
      );
    } else if (state === ConnectionState.hasData) {
      return (
        <>
          <KeyboardAwareScrollView
            onTouchStart={() => {
              Keyboard.dismiss();
            }}
            showsVerticalScrollIndicator={false}
            ref={listRef}
            style={{ height: height - getHeaderLayout().height }}>
            <_Header data={data} />
            <FeedbackBox ellipsis={false} data={data!} />
            <View style={{ height: 36 }} />
            <CommentPreview countIncludedSub={data?.total_comment} pk={data!.pk} />
            {Spacer}
          </KeyboardAwareScrollView>
        </>
      );
    }
    return <GenericErrorView />;
  }, [state, Spacer]);

  return (
    <CommentContext.Provider value={{ commentStream }}>
      <View style={{ flex: 1, }}>
        <SafeAreaView>
          <Header />
        </SafeAreaView>
        {child}
      </View>
    </CommentContext.Provider>
  );
};
